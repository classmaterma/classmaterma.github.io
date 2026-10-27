import { createFileRoute } from "@tanstack/react-router";
import { Arrow, Footer, Lanes, Topbar, ext } from "../components/Chrome";
import { DISCORD_URL, HOMEPAGE_URL, QWILIGHT_URL, TABLES, getTable } from "../lib/tables";

export const Route = createFileRoute("/")({
  // 카드에 보여줄 패턴 수·단계 수만 넘김 (빌드 때 계산되어 HTML 에 들어감)
  loader: () =>
    Promise.all(
      TABLES.map(async (t) => {
        const { total, songs, levels } = await getTable(t.slug);
        return { slug: t.slug, total, songs, levels: levels.length };
      }),
    ),
  component: Home,
});

function Home() {
  const stats = Route.useLoaderData();
  return (
    <>
      <Topbar />
      <main>
        <section className="hero">
          <p className="eyebrow"><span className="dot" /> Qwilight 전용 · BMS 최초</p>
          <h1>
            <span className="wordmark">U_E</span>
            <span className="title">4키 · 6키 · 8키 BMS 난이도표</span>
          </h1>
          <p className="lead">
            유이팩은 Qwilight 개발자 Dev Taehui와 협업하여 만들어진 BMS 최초의 4키, 6키, 8키 난이도표입니다.
          </p>
        </section>

        <aside className="notice">
          <strong>플레이 전 확인</strong>
          <span>
            유이팩은 LR2·beatoraja가 아닌 <a href={QWILIGHT_URL} {...ext}>Qwilight 구동기</a>에서 플레이할 수 있습니다.
          </span>
        </aside>

        <section className="block" aria-labelledby="tables-title">
          <div className="block-head">
            <p className="label">Tables</p>
            <h2 id="tables-title">난이도표</h2>
          </div>
          <ul className="grid">
            {TABLES.map((t) => {
              const s = stats.find((x) => x.slug === t.slug)!;
              return (
                <li key={t.slug} className={`card m${t.mode}`}>
                  <div className="card-top">
                    <Lanes keys={t.keys} />
                    <Arrow />
                  </div>
                  <h3 className="mode">
                    <a href={`/${t.slug}/table.html`} className="stretched">
                      {t.label}<span className="sr-only"> 난이도표</span>
                    </a>
                  </h3>
                  <p className="stats">{s.total.toLocaleString()}패턴 · 약 {s.songs.toLocaleString()}곡 · {s.levels}단계</p>
                  <p className="criteria-label">난이도 책정기준</p>
                  <ul className="tags">
                    {t.criteria.map((c) => <li key={c}>{c}</li>)}
                  </ul>
                  {t.extra && <a href={t.extra.url} {...ext} className="sub-link">{t.extra.label} 열기</a>}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="block" aria-labelledby="discord-title">
          <a href={DISCORD_URL} {...ext} className="discord">
            <span>
              <p className="label">Community</p>
              <h2 id="discord-title">디스코드에서 최신 소식을 받아보세요</h2>
              <p>패치 소식과 난이도 변경 내역은 U_E 커뮤니티에서 먼저 공지됩니다.</p>
            </span>
            <span className="btn light">Discord 입장 <Arrow /></span>
          </a>
          <p className="patch">
            패키지 다운로드는 <a href={HOMEPAGE_URL} {...ext}>U_E 홈페이지</a>에서 받을 수 있습니다.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
