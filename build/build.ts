import esbuild from "esbuild";
import { archiveDist, buildOptions, copyFiles, copyManifest, manifest, writeManifestFile } from "./common";


(async()=>{
    try{
        await esbuild.build(buildOptions);
        await copyManifest();
        await copyFiles();
        console.log("[INFO] build successful.");

        // Chrome用zip
        const zipName = `Youtube-shorts_block_v${manifest.version.replaceAll(".", "")}.zip`;
        await archiveDist(zipName);
        console.log(`[INFO] Chrome zip: ${zipName}`);

        // Firefox用manifest書き換え
        await writeManifestFile(manifest.getManifestForFirefox());

        // Firefox用zip
        const zipNameFx = `Youtube-shorts_block_v${manifest.version.replaceAll(".", "")}_fx.zip`;
        await archiveDist(zipNameFx);
        console.log(`[INFO] Firefox zip: ${zipNameFx}`);

        // manifest.jsonを元に戻す
        await copyManifest();
        
    }
    catch (e){
        console.error("[ERR!] build failed.");
        throw e;
    }
})();