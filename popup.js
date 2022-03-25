let _isEnable;
let _isHideTabs;
let _isHideVideos;

window.onload=function(){
    browser.storage.local.get(null, function(value){
        //isEnable
        if(value.isEnable===false){
            _isEnable=false;
            setToggleAttr(false);
        }
        else{
            _isEnable=true;
            setToggleAttr(true);
        }

        //isHideTabs
        if(value.isHideTabs===true){
            _isHideTabs=true;
        }
        else{
            _isHideTabs=false;
        }
        document.getElementById("hideShortTabInput").checked=_isHideTabs;

        //isHideVideos
        if(value.isHideVideos===true){
            _isHideVideos=true;
        }
        else{
            _isHideVideos=false;
        }
        document.getElementById("hideShortVideoInput").checked=_isHideVideos;
    });

    //set i18n
    document.getElementById("description").textContent=chrome.i18n.getMessage("ext_desc");
    document.querySelector("#hideShortTabInput + label").textContent=chrome.i18n.getMessage("cfg_hide_tab");
    document.querySelector("#hideShortVideoInput + label").textContent=chrome.i18n.getMessage("cfg_hide_video");
    document.getElementById("warn_col").textContent=chrome.i18n.getMessage("cfg_warn_col");
    document.getElementById("warn_msg").textContent=chrome.i18n.getMessage("cfg_warn_msg");
    document.getElementById("warn_fb").textContent=chrome.i18n.getMessage("cfg_warn_fb");
    document.getElementById("warn_or").textContent=chrome.i18n.getMessage("cfg_warn_or");
    document.getElementById("warn_pr").textContent=chrome.i18n.getMessage("cfg_warn_pr");

    document.getElementById("version").textContent="v"+chrome.runtime.getManifest().version;
    document.getElementById("more_icon").addEventListener("click", function(){
        let elem=document.getElementById("more_checkbox");
        elem.checked=!elem.checked;
    });
    document.getElementById("ghlink").addEventListener("click",function(){window.open("https://github.com/doma-itachi/Youtube-shorts-block","_blank")});
    document.getElementById("toggle_wrap").addEventListener("click",function(){
            _isEnable=!_isEnable;
            browser.storage.local.set({isEnable:_isEnable});
            setToggleAttr(_isEnable);
    });

    //setting event
    document.querySelectorAll(".settings_column>input").forEach(function(element){
        element.addEventListener("input", function(e){
            switch(e.target.id){
                case "hideShortTabInput":
                    browser.storage.local.set({isHideTabs:e.target.checked});
                    break;

                case "hideShortVideoInput":
                    browser.storage.local.set({isHideVideos:e.target.checked});
                    break;
            }
        });
    });
};

function setToggleAttr(bool){
    if(bool) browser.browserAction.setIcon({path:{"32":"icons/icon32.png","64":"icons/icon64.png","128":"icons/icon128.png"}});
    else browser.browserAction.setIcon({path:{"32":"icons/icon32_disabled.png","64":"icons/icon64_disabled.png","128":"icons/icon128_disabled.png"}});

    document.getElementById("logo").setAttribute("enabled",bool);
    document.getElementById("toggle_wrap").setAttribute("checked", bool);
    document.getElementById("toggle_circle").setAttribute("checked",bool);
}