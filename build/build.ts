import esbuild from "esbuild";
import fs from "fs-extra";
import path from "path";

const srcDir = "src";
const distDir = "dist";

const buildInclude = [
    "_locales",
    "assets",
    "popup/index.html",
    "popup/popup.css",
    "main.css",
    "manifest.json"
];

async function copyFiles(){
    for(const i of buildInclude){
        await fs.copy(
            path.join(srcDir, i),
            path.join(distDir, i)
        )
    }
}

(async()=>{
    try{
        await esbuild.build({
            entryPoints: [
                path.join(srcDir, "main.ts"),
                path.join(srcDir, "popup/index.ts")
            ],
            outdir: "dist"
        });
        await copyFiles();
        console.log("[INFO] build successful.");
    }
    catch{
        console.error("[ERR!] build failed.");
    }

    // const ctx = await esbuild.context({
    //     entryPoints: [
    //         "src/main.ts",
    //         "src/popup/index.ts"
    //     ],
    //     outdir: "dist"
    // });
    // ctx.watch

})();