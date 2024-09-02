import esbuild from "esbuild";
import { buildOptions, copyFiles, copyManifest } from "./common";

(async()=>{
    console.log("[INFO] Run `npm run dev` again if you have added or changed any static files");
    await copyManifest();
    await copyFiles();
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log("[INFO] watching...");
})();