debug=false;

window.onload=function(){
    document.getElementById("description").innerHTML=chrome.i18n.getMessage("ext_desc");
    document.getElementById("version").innerHTML="v"+chrome.runtime.getManifest().version;
    // document.getElementById("btn_repo").addEventListener("click",function(){window.open("https://github.com/doma-itachi/Youtube-shorts-block","_blank")});
    document.getElementById("toggle_wrap").addEventListener("click",function(){
            debug=!debug;
            document.getElementById("toggle_wrap").setAttribute("checked", debug);
            document.getElementById("toggle_circle").setAttribute("checked",debug);
    });
};
