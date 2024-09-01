export function reelShelfFilter(){
    const reels = document.querySelectorAll("ytd-reel-shelf-renderer, ytm-reel-shelf-renderer");
    for(const reel of reels){
        reel.remove();
    }
}