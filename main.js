let _uribuf=null;
document.addEventListener("yt-navigate-start",function(event){
    // console.log(event);
    let basURI=event.target.baseURI;
    let normalURI=uriCheck(basURI);
    if(normalURI!==null){
        // history.back();
        // location=normalURI;
        _uribuf=normalURI;
        redirectOnSite();
    }
});

let uri=uriCheck(location.href);
// if(uri!==null)location=uri;
if(uri!==null)redirect();

function uriCheck(_uri){
    let links=_uri.split("/");
    for(let i=0;i<links.length;i++){
        if(links[i]=="shorts"){
            return "https://www.youtube.com/watch?v="+links[i+1];
        }
    }
    return null;
}
function redirect(){
    chrome.storage.local.get("isEnable",function(value){
        if(value.isEnable!==false)
            location=uri;
    });
}
function redirectOnSite(){
    chrome.storage.local.get("isEnable",function(value){
        if(value.isEnable!==false){
            history.back();
            location=_uribuf;
        }
    });
}