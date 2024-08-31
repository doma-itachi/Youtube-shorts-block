let isEnable=true;
let isHideTabs=false;
let isHideVideos=true;

let observer=null;

// support kiwiBrowser(m.youtube.com)
if(window.location.hostname.at(0)==="m")
    window.addEventListener("state-navigatestart", (e)=>{
        let basURI=e.detail.href;
        let normalURI=uriCheck(basURI);
        if(normalURI!==null && isEnable){
            history.back();
            location=normalURI;
        }
    });

document.addEventListener("yt-navigate-start",function(event){
    //リダイレクト処理・ショートプレーヤーDOM改変処理をする
    let basURI=event.target.baseURI;
    let normalURI=uriCheck(basURI);
    if(normalURI!==null && isEnable){
        history.back();
        location=normalURI;
    }

    else if(normalURI!==null){
        //
        //もしショートプレーヤーならUIを挿入する
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
                        if(newURI!=null)window.open(newURI);
                    });
                }
            });
            logf("An additional UI has inserted.");
        }
            
        //ボタンが出てきたらaddUI()をハンドルする
        let menuSelector="div#menu.ytd-reel-player-overlay-renderer";//ショートプレーヤーのボタンUI
        let menus=document.querySelectorAll(menuSelector);
        if(menus.length==0){
            let t=10;
                let waitElement=()=>{
                    setTimeout(()=>{
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

logf("Youtube-shorts block activated.");

chrome.storage.onChanged.addListener(function(){
    loadSettings();
});

loadSettings();

//更新時または新しいタブで開いたときに実行される
let uri=uriCheck(location.href);
if(uri!==null && isEnable){
    location=uri;
}

//リンクがshortsだったら通常のリンクを返す(それ以外はnullを返す)
function uriCheck(_uri){
    let links=_uri.split("/");
    for(let i=0;i<links.length;i++){
        if(links[i]=="shorts" && links[i+1]!=undefined){
            return "https://www.youtube.com/watch?v="+links[i+1];
        }
    }
    return null;
}

//設定を読み込む
function loadSettings(){
    chrome.storage.local.get(null, function(value){
        //有効/無効
        if(value.isEnable!==false){
            isEnable=true;
        } else {
            isEnable=false;
        }

        //ビデオを非表示
        if(value.isHideVideos!==false){
            if(value.isHideVideos===undefined)
                logf("\"Hide shorts video\" is enabled by default!\nIf you don't want to do that, please disable in option page!");
                
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

//hide shorts videoが有効のとき、removeShortVideo関数を実行する。
function observeShorts(){
    if(observer===null && isEnable && isHideVideos){
        //youtube.comとm.youtube.comで監視対象を変える
        let isMobile=false;
        let container=document.getElementById("content");
        if(container===null){
            isMobile=true;
            container=document.getElementById("app");
        }

        observer=new MutationObserver(removeShortVideo);
        observer.observe(container, {childList:true, subtree:true});
        if(isMobile)removeShortVideo();
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
            logf("A shorts feed has blocked.");
            element.remove();
        });
    }
    del();

    //新しい登録ページを非表示にする
    document.querySelectorAll("ytd-rich-item-renderer").forEach(element=>{
        if(element.querySelector("span[aria-label='Shorts']")){
            element.remove();
        }
    });    

    //ショート関連のリールを非表示にする
    let reels=document.querySelectorAll("ytd-reel-shelf-renderer, ytm-reel-shelf-renderer");
    if(reels.length!=0){
        for(let reel of reels){
            reel.remove();
        }
        logf("A shorts reels has blocked.");
    }
    
    //ショート動画自体を非表示にする
    let videoArray=document.querySelectorAll("ytd-video-renderer ytd-thumbnail a, ytd-grid-video-renderer ytd-thumbnail a, ytm-video-with-context-renderer a.media-item-thumbnail-container");
    videoArray.forEach(e=>{
        if(e.href.indexOf("shorts")!=-1){
            let x=e.parentNode;
            while(true){
                if(x.tagName=="YTD-VIDEO-RENDERER" || x.tagName=="YTD-GRID-VIDEO-RENDERER" || x.tagName=="YTM-VIDEO-WITH-CONTEXT-RENDERER"){x.remove();break;}
                if(x)
                x=x.parentNode;
                if(x===null)break;
            }
        }
    });
}

//フォーマットされたログを出力する
function logf(string){
    console.log("[Youtube-shorts block] "+string);
}