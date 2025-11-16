import { BuildOptions } from "esbuild";
import { readFileSync } from "fs";
import fs from "fs-extra";
import { writeFile } from "fs/promises";
import path from "path";
import archiver from "archiver";
import { createWriteStream } from "fs";

const srcDir = "src";
const distDir = "dist";

// manifest.jsonを含めない
const buildInclude = [
    "_locales",
    "assets",
    "popup/index.html",
    "popup/popup.css",
    "main.css"
];

export async function copyFiles(){
    for(const i of buildInclude){
        await fs.copy(
            path.join(srcDir, i),
            path.join(distDir, i)
        )
    }
}

export class Manifest{
    public version: string;

    private manifest: any;
    
    
    constructor(filepath: string){
        this.manifest = JSON.parse(readFileSync(filepath, {encoding: "utf-8"}));
        this.version = this.manifest.version;
    }

    getManifest(){
        const m = structuredClone(this.manifest);
        delete m.$schema;
        return m;
    }

    getManifestForFirefox(){
        const m = this.getManifest();
        m.browser_specific_settings = {
            gecko: {
                id: "{34daeb50-c2d2-4f14-886a-7160b24d66a4}"
            }
        };
        return m;
    }
}

export const buildOptions: BuildOptions = {
    entryPoints: [
        path.join(srcDir, "main.ts"),
        path.join(srcDir, "popup/index.ts")
    ],
    outdir: "dist",
    bundle: true
}

export const manifest = new Manifest(path.join(srcDir, "manifest.json"));
export async function copyManifest(){
    await writeFile(
        path.join(distDir, "manifest.json"),
        JSON.stringify(manifest.getManifest(), null, "    "),
        {encoding: "utf8"}
    );
}

export async function writeManifestFile(content: any){
    await writeFile(
        path.join(distDir, "manifest.json"),
        JSON.stringify(content, null, "    "),
        {encoding: "utf8"}
    );
}

export async function archiveDist(destination: string){
    return new Promise<void>((resolve, reject)=>{
        const archive = archiver("zip");
        const outputStream = createWriteStream(destination);
        archive.pipe(outputStream);
        archive.directory(distDir, false);
        archive.finalize();
        outputStream.on("close", resolve);
        outputStream.on("error", reject);
    });
}