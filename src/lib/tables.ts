// 난이도표 목록. 폴더 이름(slug)이 그대로 /<slug>/table.html 주소가 됩니다.
export type Mode = "4k" | "6k" | "8k";

export interface TableInfo {
  slug: string;
  mode: Mode;
  label: string;
  keys: number;
  criteria: string[];
  extra?: { label: string; url: string };
}

export const TABLES: TableInfo[] = [
  {
    slug: "4UE",
    mode: "4k",
    label: "4K",
    keys: 4,
    criteria: ["4UE1~18: Qwilight Hard Gauge", "4UE19~: 97%"],
  },
  {
    slug: "UE",
    mode: "6k",
    label: "6K",
    keys: 6,
    criteria: ["Qwilight Hard Gauge"],
    extra: {
      label: "스프레드시트",
      url: "https://docs.google.com/spreadsheets/d/1Vjeqo8a6WF4QoscNCot3PszeWCpXIaN2B92kse0BoH0/edit?usp=sharing",
    },
  },
  {
    slug: "8UE",
    mode: "8k",
    label: "8K",
    keys: 8,
    criteria: ["Qwilight Hard Gauge"],
  },
];

export const DISCORD_URL = "https://discord.gg/WuRjRubyPQ";
export const HOMEPAGE_URL = "https://choseunghwi.github.io/UE/";
export const QWILIGHT_URL = "https://store.steampowered.com/app/1910130/Qwilight/";

export interface Header {
  name: string;
  symbol: string;
  data_url: string;
  level_order?: (string | number)[];
}

interface RawSong {
  level: string;
  title: string;
  md5: string;
  artist?: string;
  url?: string;
  name_diff?: string;
  url_diff?: string;
  name_pack?: string;
  url_pack?: string;
  video1?: string;
  video2?: string;
  video3?: string;
  comment?: string;
  state?: string | number;
}

// 화면에 필요한 필드만 남긴 패턴(차분) 정보 (클라이언트로 넘어가는 데이터를 줄이기 위함)
export interface Song {
  title: string;
  md5: string;
  artist: string;
  artistUrl?: string;
  pack?: string;
  packUrl?: string;
  charter: string;
  charterUrl?: string;
  video?: { kind: "youtube" | "nico" | "vimeo"; url: string };
  comment: string;
  state: number;
}

export interface Level {
  level: string;
  songs: Song[];
}

// 저장소 루트의 UE/ 4UE/ 8UE/ 폴더 JSON 을 그대로 읽음 (BOM 이 붙은 파일이 있어서 raw 로 읽고 직접 파싱)
const files = import.meta.glob<string>(["../../UE/*.json", "../../4UE/*.json", "../../8UE/*.json"], {
  query: "?raw",
  import: "default",
});

async function readJson<T>(slug: string, file: string): Promise<T> {
  const load = files[`../../${slug}/${file}`];
  if (!load) throw new Error(`Missing ${slug}/${file}`);
  return JSON.parse((await load()).replace(/^﻿/, "")) as T;
}

export async function getTable(slug: string) {
  const info = TABLES.find((t) => t.slug === slug);
  if (!info) throw new Error(`Unknown table: ${slug}`);
  const header = await readJson<Header>(slug, "header.json");
  const raw = await readJson<RawSong[]>(slug, header.data_url.split("/").pop()!);

  // 기존 table.html 과 같은 순서: level_order 순 → 제목 순
  const order = header.level_order?.map(String) ?? [];
  const rank = (lv: string) => {
    const i = order.indexOf(lv);
    if (i >= 0) return i;
    const n = Number(lv);
    return Number.isNaN(n) ? order.length + 1000 : order.length + n;
  };
  const byLevel = new Map<string, Song[]>();
  for (const s of [...raw].sort(
    (a, b) => rank(String(a.level)) - rank(String(b.level)) || a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
  )) {
    const lv = String(s.level);
    if (!byLevel.has(lv)) byLevel.set(lv, []);
    byLevel.get(lv)!.push(toSong(s));
  }
  const levels: Level[] = [...byLevel].map(([level, songs]) => ({ level, songs }));
  return { info, header, levels, total: raw.length };
}

function toSong(s: RawSong): Song {
  const video = s.video1
    ? { kind: "nico" as const, url: `https://www.nicovideo.jp/watch/sm${s.video1}` }
    : s.video2
      ? { kind: "youtube" as const, url: `https://www.youtube.com/watch?v=${s.video2}` }
      : s.video3
        ? { kind: "vimeo" as const, url: `https://vimeo.com/${s.video3}` }
        : undefined;
  return {
    title: s.title,
    md5: s.md5,
    artist: s.artist || s.url || "",
    artistUrl: s.url || undefined,
    pack: s.name_pack || s.url_pack || undefined,
    packUrl: s.url_pack || undefined,
    charter: s.name_diff || s.url_diff || "",
    charterUrl: s.url_diff || undefined,
    video,
    comment: s.comment ?? "",
    state: Number(s.state) || 0,
  };
}
