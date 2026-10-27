import { DISCORD_URL, HOMEPAGE_URL, TABLES } from "../lib/tables";

export const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 모든 페이지 공통 상단바. current 는 지금 보고 있는 난이도표 slug
export function Topbar({ current }: { current?: string }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a href="/" className="brand">U_E <span>난이도표</span></a>
        <nav aria-label="난이도표">
          {TABLES.map((t) => (
            <a
              key={t.slug}
              href={`/${t.slug}/table.html`}
              className={`m${t.mode}`}
              aria-current={t.slug === current ? "page" : undefined}
            >
              {t.label}
            </a>
          ))}
          <a href={DISCORD_URL} {...ext} className="nav-ext">Discord</a>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <span>U_E 난이도표</span>
      <p className="credits">
        <a href={HOMEPAGE_URL} {...ext}>U_E 홈페이지</a> · <a href={DISCORD_URL} {...ext}>Discord</a>
      </p>
    </footer>
  );
}
