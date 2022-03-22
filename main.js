let isEnable=true;

//debug
// let startTime;
// let endTime;

document.addEventListener("yt-navigate-start",function(event){
    //debug
    // startTime=performance.now();

    let basURI=event.target.baseURI;
    let normalURI=uriCheck(basURI);
    if(normalURI!==null && isEnable){
        history.back();
        location=normalURI;

        //debug
        // endTime=performance.now();
        // getTime();
    }
});

chrome.storage.onChanged.addListener(function(){
    loadSettings();
});

//初期化
loadSettings();

//debug
// startTime=performance.now();

let uri=uriCheck(location.href);

if(uri!==null && isEnable){
    location=uri;

    //debug
    // endTime=performance.now();
    // getTime();
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
    chrome.storage.local.get("isEnable",function(value){
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

//debug
// function getTime(){
//     alert(endTime-startTime);
// }