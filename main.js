let isEnable=true;
let isHideTabs=false;
let isHideVideos=false;

let observer=null;

document.addEventListener("yt-navigate-start",function(event){
    // console.log(event);
    let basURI=event.target.baseURI;
    let normalURI=uriCheck(basURI);
    if(normalURI!==null && isEnable){
        history.back();
        location=normalURI;
    }
    else if(normalURI!==null){
        let addUI=(menus)=>{
            menus.forEach((element)=>{
                if(element.parentNode.querySelector(".youtube-shorts-block")==null){
                    element.insertAdjacentHTML("afterend",
                    `<div id="block" class="youtube-shorts-block" title="${chrome.i18n.getMessage("ui_openIn_title")}">
                    <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
                    <path d="M19.95 42 22 27.9h-7.3q-.55 0-.8-.5t0-.95L26.15 6h2.05l-2.05 14.05h7.2q.55 0 .825.5.275.5.025.95L22 42Z">
                        </svg>
                        ${chrome.i18n.getMessage("ui_openIn_view")}
                        </div>`);
                        
                        element.parentNode.querySelector("#block").addEventListener("click", ()=>{
                            document.querySelectorAll("video").forEach(videoElement=>{
                                videoElement.pause();
                            });
                            let newURI=uriCheck(document.location.href);
                            // console.log(newURI);
                            if(newURI!=null)window.open(newURI);
                        });
                    }
                });
            console.log("[Youtube-shorts block] An additional UI has inserted.");//削除
            }
            
            //ショート画面のとき、DOMを挿入する
            let menuSelector="div#menu.ytd-reel-player-overlay-renderer";
        let menus=document.querySelectorAll(menuSelector);
        if(menus.length==0){
            let t=10;
                let waitElement=()=>{
                    setTimeout(()=>{
                        console.log("エレメントを待っています");//削除
                        menus=document.querySelectorAll(menuSelector);
                        if(menus.length==0)
                            waitElement();
                        else
                            addUI(menus);
                    }, t);
                }
                waitElement();
        }
        else{
            addUI(menus);
        }
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
        //有効/無効
        if(value.isEnable!==false){
            isEnable=true;
        } else {
            isEnable=false;
        }

        //ビデオを非表示
        if(value.isHideVideos===true){
            isHideVideos=true;
        }else{
            isHideVideos=false;
        }
        observeShorts();

        if(value.isHideTabs===true){
            isHideTabs=true;
        }else{
            isHideTabs=false;
        }
        
        if(isHideTabs){
            document.body.classList.add("youtube-shorts-block");
        }else{
            document.body.classList.remove("youtube-shorts-block");
        }
    });
}

function observeShorts(){
    if(observer===null && isEnable && isHideVideos){
        //---Warning--- This function is called so often that it could be affecting performance! Please "pull request"!
        //---警告--- この機能は頻繁に呼び出されており、パフォーマンスに影響があることが考えられます！プルリクエストを！
        observer=new MutationObserver(removeShortVideo);
        observer.observe(document.getElementById("content"), {childList:true, subtree:true});
    }
    if(observer!==null && (isEnable===false || isHideVideos===false)){
        observer.disconnect();
        observer=null;
    }
}

function removeShortVideo(){
    //ショートフィードを削除
    let del=()=>{
        let elements = document.querySelectorAll("#dismissible.ytd-rich-shelf-renderer, #dismissible.ytd-shelf-renderer");
        elements.forEach(element => {
            let hrefs=element.querySelectorAll("#dismissible #details");
            if(hrefs.length==0)return;
            
            for(let i=0;i<hrefs.length;i++){
                let link=hrefs[i].querySelector("a");
                if(link===null)return;
                if(link.href.indexOf("shorts")==-1)return;
            }
            console.log("[Youtube-shorts block] A shorts feed has blocked.");
            element.remove();
        });
    }
    del();

    //ショート動画を削除
    let shortsArray=document.querySelector('[role="main"]').querySelectorAll('[overlay-style="SHORTS"]');
    shortsArray.forEach(e=>{
        let parent=e.parentNode;
        while(true){
            if(parent.tagName=="YTD-VIDEO-RENDERER" || parent.tagName=="YTD-GRID-VIDEO-RENDERER"){
                parent.remove();
                break;
            }
            else{
                parent=parent.parentNode;
                if(parent===null)break;
            }
            
        }
    });
}