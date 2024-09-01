export interface Config {
    enable: boolean,
    hideTabs: boolean,
    hideShorts: boolean
}

export type IStorage = Partial<{
    isEnable: boolean;
    isHideTabs: boolean;
    isHideVideos: boolean;
}>