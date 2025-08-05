import { channelFilter } from "./filter/channel";
import { reelShelfFilter } from "./filter/reelShelf";
import { richShelfFilter } from "./filter/richShelf";
import { shortsFilter } from "./filter/shorts";
import type { Config, IStorage } from "./types/config";
import {
    logf,
    querySelectorAllPromise,
    querySelectorPromise,
} from "./util/util";

const config: Config = {
    enable: true,
    hideTabs: false,
    hideShorts: true,
};

class Extension {
    observer: MutationObserver | null = null;

    filterList: (() => void | Promise<void>)[] = [
        reelShelfFilter,
        richShelfFilter,
        shortsFilter,
    ];

    constructor() {
        if (window.location.hostname.at(0) === "m") {
            window.addEventListener("state-navigatestart", (e) => {
                this.onNavigateStart(
                    ((e as CustomEvent).detail as { href: string }).href,
                    true,
                );
            });
        } else {
            document.addEventListener("yt-navigate-start", (e) => {
                this.onNavigateStart((e.target as Node).baseURI);
            });
        }

        chrome.storage.onChanged.addListener(() => this.loadConfig());
        this.loadConfig();

        const url = Extension.convertToVideoURL(location.href);
        if (url && config.enable) {
            location.href = url;
        }

        logf("Youtube-shorts block activated.");
    }

    private async onNavigateStart(destinationURL: string, mobile = false) {
        const videoURL = Extension.convertToVideoURL(destinationURL);
        if (videoURL && config.enable) {
            history.back();
            location.href = videoURL;
        } else if (videoURL && !mobile) {
            /* "新しいタブで開く"ボタンをDOMに注入 */
            const elements = await querySelectorAllPromise(
                "#actions.ytd-reel-player-overlay-renderer",
                20,
                100,
            );
            for (const element of elements) {
                if (
                    element.parentNode?.querySelector(
                        ".youtube-shorts-block",
                    ) == null
                ) {
                    element.insertAdjacentHTML(
                        "afterbegin",
                        `<div id="block" class="youtube-shorts-block" title="${chrome.i18n.getMessage("ui_openIn_title")}">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 -960 960 960">
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/>
                        </svg>
                        ${chrome.i18n.getMessage("ui_openIn_view")}
                        </div>`,
                    );

                    element.parentNode
                        ?.querySelector("#block")
                        ?.addEventListener("click", () => {
                            //動画の再生を停止する
                            document.querySelectorAll("video").forEach((e) => {
                                e.pause();
                            });
                            window.open(
                                Extension.convertToVideoURL(location.href),
                            );
                        });
                }
            }
        }
    }

    public async loadConfig() {
        const storage = (await chrome.storage.local.get(null)) as IStorage;

        if (typeof storage.isEnable === "boolean") {
            config.enable = storage.isEnable;
        }

        if (typeof storage.isHideVideos === "boolean") {
            config.hideShorts = storage.isHideVideos;
        } else {
            logf(
                `"Hide shorts video" is enabled by default!\nIf you don't want to do that, please disable in option page!`,
            );
        }

        if (typeof storage.isHideTabs === "boolean") {
            config.hideTabs = storage.isHideTabs;
        }

        /* 各種機能の有効化・無効化 */
        this.setObserve(config.enable && config.hideShorts);

        const extensionClass = "youtube-shorts-block";
        if (config.hideTabs) {
            document.body.classList.add(extensionClass);
        } else {
            document.body.classList.remove(extensionClass);
        }
    }

    private async setObserve(isObserve: boolean) {
        if (isObserve) {
            if (this.observer !== null) return;

            /**
             * #content ← youtube.com
             * #app ←m.youtube.com
             */
            const container = await querySelectorPromise("#content, #app");

            if (!container) {
                logf(
                    "cannot find rootElement. currently, HideShorts isn't working!",
                    "error",
                );
                return;
            }

            this.observer = new MutationObserver(() => this.domChanged());
            this.observer.observe(container, {
                childList: true,
                subtree: true,
            });
            this.domChanged();
        } else {
            if (this.observer === null) return;
            this.observer.disconnect();
            this.observer = null;
        }
    }

    private async domChanged() {
        for (const filter of this.filterList) {
            await filter();
        }
    }

    static convertToVideoURL(url: string): string | undefined {
        const result = url.match(/shorts\/(.{11})\/?/);
        if (result) {
            return `https://www.youtube.com/watch?v=${result[1]}`;
        }
    }
}

const extension = new Extension();
