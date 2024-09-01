import { Config } from "./types/config";

const config: Config = {
    enable: true,
    hideTabs: false,
    hideShorts: true
}

class Extension{
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
    }

    private onNavigateStart(destinationURL: string, mobile: boolean = false){
        const videoURL = Extension.convertToVideoURL(destinationURL);
        if(videoURL && config.enable){
            history.back();
            location.href = videoURL;
        }
        else if(videoURL && !mobile){
            
        }
    }

    private domChanged(){

    }

    static convertToVideoURL(url: string): string | undefined{
        const result = url.match(/shorts\/(.*)\/?/);
        if(result){
            return `https://www.youtube.com/watch?v=${result[1]}`;
        }
    }
}

const extension = new Extension();