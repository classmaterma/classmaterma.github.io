// 난이도표 데이터(header.json, score.json)는 기존처럼 저장소 루트의 UE/ 4UE/ 8UE/ 폴더에서 수정합니다.
// 빌드 전에 public/ 으로 복사해서 /UE/header.json 같은 기존 주소가 그대로 유지되게 합니다.
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";

for (const dir of ["UE", "4UE", "8UE"]) {
  mkdirSync(`public/${dir}`, { recursive: true });
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    cpSync(`${dir}/${file}`, `public/${dir}/${file}`);
  }
}
if (existsSync("UE.zip")) cpSync("UE.zip", "public/UE.zip");
