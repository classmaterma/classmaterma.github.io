import { createFileRoute } from "@tanstack/react-router";
import { Arrow, Footer, Topbar, ext } from "../components/Chrome";
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
          <h1>U_E 난이도표</h1>
          <p className="lead">
            유이팩은 Qwilight 개발자 Dev Taehui와 협업하여 만들어진 BMS 최초의 4키, 6키, 8키 난이도표입니다.
          </p>
          <p className="notice">
            <strong>플레이 전 확인</strong> LR2·beatoraja가 아닌{" "}
            <a href={QWILIGHT_URL} {...ext}>Qwilight 구동기</a>에서 플레이할 수 있습니다.
          </p>
        </section>

        <section className="block" aria-labelledby="tables-title">
          <h2 id="tables-title">난이도표</h2>
          <ul className="grid">
            {TABLES.map((t) => {
              const s = stats.find((x) => x.slug === t.slug)!;
              return (
                <li key={t.slug} className={`card m${t.mode}`}>
                  <h3 className="mode">
                    <a href={`/${t.slug}/table.html`} className="stretched">
                      {t.label}<span className="sr-only"> 난이도표</span>
                    </a>
                    <Arrow />
                  </h3>
                  <p className="stats">{s.total.toLocaleString()}패턴 · 약 {s.songs.toLocaleString()}곡 · {s.levels}단계</p>
                  <dl className="criteria">
                    <dt>난이도 책정기준</dt>
                    {t.criteria.map((c) => <dd key={c}>{c}</dd>)}
                  </dl>
                  {t.extra && <a href={t.extra.url} {...ext} className="sub-link">{t.extra.label} 열기</a>}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="block links" aria-labelledby="links-title">
          <h2 id="links-title">링크</h2>
          <ul>
            <li>
              <a href={DISCORD_URL} {...ext}>Discord <Arrow /></a>
              <span>패치 소식과 난이도 변경 내역을 가장 먼저 공지합니다.</span>
            </li>
            <li>
              <a href={HOMEPAGE_URL} {...ext}>U_E 홈페이지 <Arrow /></a>
              <span>패키지 다운로드</span>
            </li>
            <li>
              <a href={QWILIGHT_URL} {...ext}>Qwilight (Steam) <Arrow /></a>
              <span>U_E를 플레이하는 구동기</span>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
