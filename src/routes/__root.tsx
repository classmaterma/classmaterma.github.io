import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import styles from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#ffffff" },
      { title: "U_E 난이도표 | 4키·6키·8키 BMS" },
      { name: "description", content: "Qwilight 전용 BMS 4키·6키·8키 U_E 난이도표." },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      // 한글을 포함해 모든 텍스트에 Wanted Sans 하나만 사용
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css",
      },
      { rel: "stylesheet", href: styles },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
