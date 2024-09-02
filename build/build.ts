import esbuild from "esbuild";
import { archiveDist, buildOptions, copyFiles, copyManifest, manifest } from "./common";


(async()=>{
    try{
        await esbuild.build(buildOptions);
        await copyManifest();
        await copyFiles();
        console.log("[INFO] build successful.");

        const zipName = `Youtube-shorts_block_v${manifest.version.replaceAll(".", "")}.zip`;
        await archiveDist(zipName);
        console.log(`[INFO] zip: ${zipName}`)
        
    }
    catch (e){
        console.error("[ERR!] build failed.");
        throw e;
    }
})();