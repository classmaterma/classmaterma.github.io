import { useEffect, useMemo, useRef, useState } from "react";
import type { Level, Song } from "../lib/tables";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const VIDEO_LABEL = { youtube: "YouTube", nico: "니코니코", vimeo: "Vimeo" } as const;

function matches(s: Song, q: string) {
  return (
    s.title.toLowerCase().includes(q) ||
    s.artist.toLowerCase().includes(q) ||
    s.charter.toLowerCase().includes(q) ||
    s.comment.toLowerCase().includes(q) ||
    s.md5 === q
  );
}

function Row({ song, lv }: { song: Song; lv: string }) {
  return (
    <li className={`row${song.state ? ` state${song.state}` : ""}`}>
      <span className="row-lv">{lv}</span>
      <div className="row-main">
        <a className="row-title" href={`https://ez2pattern.kr/bms/ir/qwilight?md5=${song.md5}`} {...ext} title="Qwilight IR">
          {song.title}
        </a>
        <span className="row-artist">
          {song.artistUrl ? <a href={song.artistUrl} {...ext}>{song.artist}</a> : song.artist}
          {song.pack && <> · {song.packUrl ? <a href={song.packUrl} {...ext}>{song.pack}</a> : song.pack}</>}
        </span>
      </div>
      <span className="row-charter">
        {song.charterUrl ? <a href={song.charterUrl} {...ext}>{song.charter}</a> : song.charter}
      </span>
      <span className="row-comment">{song.comment}</span>
      <span className="row-links">
        {song.video && (
          <a href={song.video.url} {...ext} className="chip" title={VIDEO_LABEL[song.video.kind]}>
            {song.video.kind === "youtube" ? "▶" : VIDEO_LABEL[song.video.kind]}
            <span className="sr-only"> {VIDEO_LABEL[song.video.kind]}</span>
          </a>
        )}
        <a href={`https://ez2pattern.kr/bms/chart?md5=${song.md5}`} {...ext} className="chip" title="패턴 보기">
          ♪<span className="sr-only"> 패턴 보기</span>
        </a>
        <a href={`https://ir.stellabms.xyz/charts/${song.md5}`} {...ext} className="chip" title="Stella IR">
          ★<span className="sr-only"> Stella IR</span>
        </a>
      </span>
    </li>
  );
}

export default function TableView({ symbol, levels }: { symbol: string; levels: Level[] }) {
  const [query, setQuery] = useState("");
  // 1,500개 가까운 패턴을 다시 그리므로 타이핑이 멈추고 200ms 뒤에 한 번만 필터링 (디바운스)
  const [q, setQ] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setQ(query.trim().toLowerCase()), 200);
    return () => clearTimeout(id);
  }, [query]);

  const shown = useMemo(
    () => (q ? levels.map((l) => ({ ...l, songs: l.songs.filter((s) => matches(s, q)) })).filter((l) => l.songs.length) : levels),
    [levels, q],
  );
  const hits = q ? shown.reduce((n, l) => n + l.songs.length, 0) : null;

  // 레벨로 이동할 때 고정된 상단바·툴바에 제목이 가려지지 않도록 툴바 높이만큼 스크롤 여백을 맞춤
  const toolbar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = toolbar.current!;
    const update = () => {
      document.documentElement.style.scrollPaddingTop = `${parseFloat(getComputedStyle(el).top) + el.offsetHeight + 12}px`;
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    // 외부에서 #6UE20 같은 주소로 들어온 경우. 하이드레이션 직후 라우터가 스크롤을 맨 위로 되돌리고,
    // 웹 폰트가 늦게 로드되면 행 높이가 바뀌므로 폰트 로드가 끝난 뒤에 이동
    const id = location.hash && decodeURIComponent(location.hash.slice(1));
    let cancelled = false;
    if (id) {
      document.fonts.ready.then(() => {
        if (!cancelled) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "instant" }));
      });
    }
    return () => {
      ro.disconnect();
      cancelled = true;
    };
  }, []);

  const jump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(history.state, "", `#${id}`);
  };

  return (
    <>
      <div className="toolbar" ref={toolbar}>
        <label className="search">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="sr-only">패턴 검색</span>
          <input
            type="search"
            placeholder="제목, 아티스트, 차분 제작자 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {hits !== null && <span className="hits">{hits}패턴</span>}
        </label>
        <nav className="levels" aria-label="레벨로 이동">
          {shown.map((l) => (
            <a key={l.level} href={`#${symbol}${l.level}`} onClick={(e) => jump(e, `${symbol}${l.level}`)}>
              {l.level}
            </a>
          ))}
        </nav>
      </div>

      {shown.length === 0 && <p className="empty">“{query}”에 맞는 패턴이 없습니다.</p>}

      {shown.map((l) => (
        <section key={l.level} className="level" id={`${symbol}${l.level}`} aria-labelledby={`h-${symbol}${l.level}`}>
          <h2 id={`h-${symbol}${l.level}`}>
            <span className="level-name">{symbol}{l.level}</span>
            <span className="level-count">{l.songs.length}패턴</span>
          </h2>
          <ul className="rows">
            {l.songs.map((s) => <Row key={s.md5 + s.title} song={s} lv={`${symbol}${l.level}`} />)}
          </ul>
        </section>
      ))}
    </>
  );
}
