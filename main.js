document.addEventListener("yt-navigate-start",function(event){
    // console.log(event);
    let basURI=event.target.baseURI;
    let normalURI=uriCheck(basURI);
    if(normalURI!==null){
        history.back();
        location=normalURI;
    }
});

let uri=uriCheck(location.href);
if(uri!==null)location=uri;

function uriCheck(_uri){
    let links=_uri.split("/");
    for(let i=0;i<links.length;i++){
        if(links[i]=="shorts"){
            return "https://www.youtube.com/watch?v="+links[i+1];
        }
    }
    return null;
}