import { createFileRoute, notFound } from "@tanstack/react-router";
import { Footer, Topbar } from "../components/Chrome";
import TableView from "../components/TableView";
import { TABLES, getTable } from "../lib/tables";

// 주소: /UE/table.html, /4UE/table.html, /8UE/table.html (기존 주소 그대로)
export const Route = createFileRoute("/$table/table.html")({
  loader: async ({ params }) => {
    if (!TABLES.some((t) => t.slug === params.table)) throw notFound();
    const { info, header, levels, total, songs } = await getTable(params.table);
    return { info, header: { name: header.name, symbol: header.symbol }, levels, total, songs };
  },
  // bmstable 메타 태그: Qwilight·beatoraja 같은 구동기가 이 주소에서 header.json 을 찾습니다. 지우면 안 됩니다.
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.header.name} | U_E` },
      { name: "description", content: `${loaderData?.header.name} — Qwilight 전용 BMS 난이도표` },
      { name: "bmstable", content: "header.json" },
    ],
  }),
  component: TablePage,
});

function TablePage() {
  const { info, header, levels, total, songs } = Route.useLoaderData();
  return (
    <>
      <Topbar current={info.slug} />
      <main className={`m${info.mode}`}>
        <section className="table-head">
          <p className="label">{info.label} — Table</p>
          <h1>{header.name}</h1>
          <p className="stats">
            {total.toLocaleString()}패턴 · 약 {songs.toLocaleString()}곡 · {levels.length}단계 · 기준 {info.criteria.join(" / ")}
          </p>
        </section>
        <TableView symbol={header.symbol} levels={levels} />
      </main>
      <Footer />
    </>
  );
}
