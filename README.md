# U_E 난이도표

Qwilight 전용 BMS 4키 · 6키 · 8키 난이도표 사이트입니다.
TanStack Start로 만들고, 빌드할 때 모든 페이지를 정적 HTML로 미리 렌더링해서 GitHub Pages에 배포합니다.

| 난이도표 | 주소 |
| --- | --- |
| 4K (4UE) | https://classmaterma.github.io/4UE/table.html |
| 6K (6UE) | https://classmaterma.github.io/UE/table.html |
| 8K (8UE) | https://classmaterma.github.io/8UE/table.html |

구동기에 난이도표를 등록할 때는 위 주소를 그대로 쓰면 됩니다.

## 기술 스택

- [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router): 라우팅, 빌드 시 정적 HTML 프리렌더링
- [React](https://react.dev) 19
- [Vite](https://vite.dev) 8
- [TypeScript](https://www.typescriptlang.org)
- [Bun](https://bun.sh): 패키지 관리, 스크립트 실행
- GitHub Actions + GitHub Pages: 배포

## 난이도 수정하기

데이터는 저장소 루트의 `UE/`(6K), `4UE/`, `8UE/` 폴더에 있습니다. 이 JSON 파일만 고쳐서 `main`에 push하면 사이트에 반영됩니다.

- `header.json`: 난이도표 이름(`name`), 기호(`symbol`), 레벨 순서(`level_order`), 코스(`course`)
- `score.json`: 곡 목록

`score.json`의 곡 하나는 다음과 같습니다.

```json
{"level":"12","title":"곡 제목 [6K UE HARD]","md5":"...","sha256":"","artist":"아티스트","name_diff":"차분 제작자","video2":"YouTube 영상 ID","comment":"","state":""}
```

| 필드 | 설명 |
| --- | --- |
| `level` | 레벨. `header.json`의 `level_order`에 있는 값이어야 그 순서대로 정렬됩니다 |
| `title` | 곡 제목. 사이트에서 Qwilight IR 링크로 연결됩니다 |
| `md5` | 차분 MD5. 패턴 보기 / Stella IR / Qwilight IR 링크에 쓰입니다 |
| `artist`, `url` | 아티스트 이름과 링크 |
| `name_diff`, `url_diff` | 차분 제작자 이름과 링크 |
| `video1` / `video2` / `video3` | 니코니코 / YouTube / Vimeo 영상 ID (하나만 표시) |
| `comment` | 비고 |
| `state` | `1`이면 표에서 분홍색으로 강조 |

새 레벨을 추가할 때는 `header.json`의 `level_order`와 `enum_level_order`에도 같이 넣어 주세요.

## 로컬에서 실행하기

[Bun](https://bun.sh)이 필요합니다.

```bash
bun install
```

```bash
bun run dev
```

| 명령 | 하는 일 |
| --- | --- |
| `bun run dev` | 개발 서버 실행 |
| `bun run build` | 정적 사이트 빌드 (결과물: `dist/client`) |
| `bun run typecheck` | 타입 검사 |

## 배포

`main`에 push하면 GitHub Actions([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))가 다음을 순서대로 실행합니다.

1. 빌드
2. GitHub Pages에 배포
3. Qwilight 서버에 난이도표 갱신 알림

## 주의할 점

구동기들이 아래 주소와 태그를 직접 읽기 때문에 바꾸면 안 됩니다.

- `/UE/table.html`, `/UE/header.json`, `/UE/score.json` (4UE, 8UE도 동일)
- 난이도표 페이지의 `<meta name="bmstable" content="header.json">` 태그
