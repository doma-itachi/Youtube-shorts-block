import { channelFilter } from "./filter/channel";
import { reelShelfFilter } from "./filter/reelShelf";
import { richShelfFilter } from "./filter/richShelf";
import { shortsFilter } from "./filter/shorts";
import { Config, IStorage } from "./types/config";
import { logf, querySelectorPromise } from "./util/util";

const config: Config = {
    enable: true,
    hideTabs: false,
    hideShorts: true
}

class Extension{
    observer: MutationObserver | null = null;

    filterList: (()=>void)[] = [
        reelShelfFilter,
        richShelfFilter,
        shortsFilter
    ]

    constructor(){
        if(window.location.hostname.at(0)==="m"){
            window.addEventListener("state-navigatestart", (e)=>{
                this.onNavigateStart(((e as CustomEvent).detail as {href: string}).href, true);
            });
        }
        else{
            document.addEventListener("yt-navigate-start", (e)=>{
                this.onNavigateStart((e.target as Node).baseURI);
            });
        }

        chrome.storage.onChanged.addListener(()=>this.loadConfig());
        this.loadConfig();

        const url = Extension.convertToVideoURL(location.href);
        if(url && config.enable){
            location.href = url;
        }
        
        logf("Youtube-shorts block activated.");
    }

    private onNavigateStart(destinationURL: string, mobile: boolean = false){
        const videoURL = Extension.convertToVideoURL(destinationURL);
        if(videoURL && config.enable){
            history.back();
            location.href = videoURL;
        }
        else if(videoURL && !mobile){
            /* "新しいタブで開く"ボタンをDOMに注入 */
        }
    }

    public async loadConfig(){
        const storage = await chrome.storage.local.get(null) as IStorage;
        if(typeof storage.isHideVideos === "boolean"){
            config.hideShorts = storage.isHideVideos;
        }
        else{
            logf(`"Hide shorts video" is enabled by default!\nIf you don't want to do that, please disable in option page!`);
        }

        if(typeof storage.isHideTabs === "boolean"){
            config.hideTabs = storage.isHideTabs;
        }

        /* 各種機能の有効化・無効化 */
        this.setObserve(config.enable && config.hideShorts);

        const extensionClass = "youtube-shorts-block";
        if(config.hideTabs){
            document.body.classList.add(extensionClass);
        }
        else{
            document.body.classList.remove(extensionClass);
        }
    }

    private async setObserve(isObserve: boolean){
        if(isObserve){
            if(this.observer !== null) return;

            /**
             * #content ← youtube.com
             * #app ←m.youtube.com
             */
            const container = await querySelectorPromise("#content, #app");

            if(!container){
                logf("cannot find rootElement. currently, HideShorts isn't working!", "error");
                return;
            }

            this.observer = new MutationObserver(()=>this.domChanged());
            this.observer.observe(container, {childList: true, subtree: true});
            this.domChanged();
        }
        else{
            if(this.observer === null) return;
            this.observer.disconnect();
            this.observer = null;
        }
    }

    private domChanged(){
        for(const filter of this.filterList){
            filter();
        }
    }

    static convertToVideoURL(url: string): string | undefined{
        const result = url.match(/shorts\/(.*)\/?/);
        if(result){
            return `https://www.youtube.com/watch?v=${result[1]}`;
        }
    }
}

const extension = new Extension();