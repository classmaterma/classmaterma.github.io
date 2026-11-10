import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// GitHub Pages 용으로 모든 페이지를 정적 HTML 로 미리 렌더링합니다 (결과물: dist/client).
// 난이도표 주소는 구동기들이 쓰고 있으므로 기존과 똑같이 /UE/table.html 형태로 내보냅니다.
const TABLE_SLUGS = ["UE", "4UE", "8UE"];

export default defineConfig({
  plugins: [
    tanstackStart({
      prerender: { enabled: true, crawlLinks: false, autoSubfolderIndex: false },
      pages: [{ path: "/" }, ...TABLE_SLUGS.map((slug) => ({ path: `/${slug}/table.html` }))],
    }),
    viteReact(),
  ],
});
