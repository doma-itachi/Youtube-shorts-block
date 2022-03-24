let isEnable=true;
let isHideTabs=true;
let isHideVideos=true;

document.addEventListener("yt-navigate-start",function(event){
    let basURI=event.target.baseURI;
    let normalURI=uriCheck(basURI);
    if(normalURI!==null && isEnable){
        history.back();
        location=normalURI;
    }
});

chrome.storage.onChanged.addListener(function(){
    loadSettings();
});

//初期化
loadSettings();

let uri=uriCheck(location.href);

if(uri!==null && isEnable){
    location=uri;
}

function uriCheck(_uri){
    let links=_uri.split("/");
    for(let i=0;i<links.length;i++){
        if(links[i]=="shorts"){
            return "https://www.youtube.com/watch?v="+links[i+1];
        }
    }
    return null;
}
function loadSettings(){
    chrome.storage.local.get(null, function(value){
        if(value.isEnable!==false){
            isEnable=true;
        } else {
            isEnable=false;
        }

        if(isEnable){
            document.body.classList.add("youtube-short-block")
        }else{
            document.body.classList.remove("youtube-short-block")
        }
    });
}

document.addEventListener("yt-navigate-finish",function(e){
    removeShortVideo();
});

function removeShortVideo(){
    let videoArray=document.querySelectorAll("ytd-video-renderer ytd-thumbnail a, ytd-grid-video-renderer ytd-thumbnail a");
    console.log(videoArray[0].href);
    videoArray.forEach(e=>{
        if(e.href.indexOf("shrots")!=-1)
            console.log("ショート");
            else{console.log("ショートじゃない")}
    });
}