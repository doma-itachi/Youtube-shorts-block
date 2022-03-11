let _isEnable;
window.onload=function(){
    chrome.storage.local.get("isEnable", function(value){
        if(value.isEnable===false){
            _isEnable=false;
            setToggleAttr(false);
        }
        else{
            _isEnable=true;
            setToggleAttr(true);
        }
    });

    document.getElementById("description").innerHTML=chrome.i18n.getMessage("ext_desc");
    document.getElementById("version").innerHTML="v"+chrome.runtime.getManifest().version;
    document.getElementById("ghlink").addEventListener("click",function(){window.open("https://github.com/doma-itachi/Youtube-shorts-block","_blank")});
    document.getElementById("toggle_wrap").addEventListener("click",function(){
            _isEnable=!_isEnable;
            chrome.storage.local.set({isEnable:_isEnable});
            setToggleAttr(_isEnable);
    });
};
function setToggleAttr(bool){
    if(bool) chrome.action.setIcon({path:{"32":"icons/icon32.png","64":"icons/icon64.png","128":"icons/icon128.png"}});
    else chrome.action.setIcon({path:{"32":"icons/icon32_disabled.png","64":"icons/icon64_disabled.png","128":"icons/icon128_disabled.png"}});

    document.getElementById("logo").setAttribute("enabled",bool)
    document.getElementById("toggle_wrap").setAttribute("checked", bool);
    document.getElementById("toggle_circle").setAttribute("checked",bool);
}