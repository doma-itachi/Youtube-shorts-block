import argparse
import json
import os
import shutil

parser=argparse.ArgumentParser(description="アドオンをzipファイルにパックします")
parser.add_argument("directory", help="パックする対象のディレクトリ")
parser.add_argument("-f", default="", help="出力先のディレクトリ")

args=parser.parse_args()
manifestPath=os.path.join(args.directory, "manifest.json")
if os.path.isfile(manifestPath)==False:
    print("マニフェストファイルが存在しません")
    exit(0)

f=open(manifestPath, encoding="utf-8")
manifest=json.loads(f.read())
print("name =", manifest["name"])
print("version =", manifest["version"])
zipPath=manifest["name"].replace(" ", "_")+"_v"+manifest["version"].replace(".", "")
outputPath=os.path.join(args.f, zipPath)
print("output =>", outputPath)

shutil.make_archive(outputPath, "zip", args.directory)