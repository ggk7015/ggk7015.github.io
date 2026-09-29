# ggk7015.github.io

`ggk5743` 的個人網站 — Vite + React 19 + TypeScript，部署於 GitHub Pages 與 Vercel。

## 內容分層

| 層級 | 內容 | 來源 |
| --- | --- | --- |
| L1 | 原創作品 | 5 個 GitHub repo，已逐一以 Git 提交紀錄與遠端來源驗證 |
| L2 | 技術實作經驗 | 既有開源專案，頁面上明確標註「非原創專案」與上游作者 |
| L3 | 技能 | 僅從 L1 推導 |

L2 中的第三方專案（RuView、Aoba-Client、DarkClient、PCL 等）**不是本人原創**，
因此頁面只列出接觸過的部分，並標註上游來源。Lunar Client 相關實作僅以
「Electron 桌面應用」與「Tauri 2 + Rust 桌面應用」等技術棧描述，不點名逆向內容。

## 開發

```bash
npm install
npm run dev       # 本機開發
npm run lint      # oxlint
npm run typecheck # tsc -b --force（strict 模式）
npm run build     # tsc -b && vite build -> dist/
npm run preview   # 預覽正式建置結果
```

TypeScript 以 `strict` 編譯，另開 `noImplicitOverride`、`noUncheckedSideEffectImports`、
`noUnusedLocals`、`noUnusedParameters`；任何型別錯誤都會擋下 `build`。

## 部署

- **GitHub Pages** — push 到 `main` 觸發 `.github/workflows/deploy.yml`，
  正式網址 <https://ggk7015.github.io/>
- **Vercel** — 專案 `ggk7015s-projects/ggk7015.github.io`，
  正式網址 <https://ggk7015githubio.vercel.app>

兩個環境使用同一份 Vite 建置結果，`base` 預設 `/` 即可運作。
`index.html` 的 `canonical` 與 `og:url` 固定指向 GitHub Pages，Vercel 視為鏡像站。

`vercel.json` 指定 `npm run build` → `dist`，並為 `/assets/(.*)` 與 `/fonts/(.*)`
設定 `max-age=31536000, immutable`，其餘靜態資源為 7 天。HTML 本身**不**使用
`immutable`，否則使用者會被永久釘在舊版本上。

> **Vercel 自動部署尚未啟用。** Vercel GitHub App 尚未取得 `ggk7015/ggk7015.github.io`
> 的存取權，因此 `vercel git connect` 會失敗。要讓每次 push 自動部署，需在
> Vercel 後台「Settings → Git → Connect GitHub Repository」授權該 repo。
> 在授權之前，Vercel 端以 CLI 發布：
>
> ```bash
> npx vercel --prod
> ```

## QR 碼

頁面內的 QR 碼由 `qr-creator` 產生，編碼當前網域的 origin，因此同一份程式碼
在 Pages 與 Vercel 上都會各自產生對應的 QR 碼。

`public/qr-print.svg` 是預先產生的**向量**印刷檔，編碼 `https://ggk7015.github.io/`，
可直接交給印刷廠而不會失真。

## 品質

- **字型**：DM Sans（可變，自托管）與 Instrument Serif，置於 `public/fonts/`，
  以 `src/fonts.css` 的 `@font-face` 載入，**不發出任何第三方請求**，離線亦可正確渲染。
  字型家族僅 2 個，字級收斂為 1.25 模組化比例（`--fs-*`），正文行寬上限 `--measure: 40em`。
- **配色對比**：`--accent`（淺色 `#2a63d4` / 深色 `#6ea8ff`）與 `--stars`
  （淺色 `#9a6600` / 深色 `#d99b1a`）皆經 WCAG 2.1 AA 驗證，於 `--bg`、`--surface`
  與深色表面上均達 4.5:1。兩色皆以 token 隨主題切換，勿寫死單一色碼。
- **無障礙**：以 axe-core 於淺色／深色模式掃描皆為 0 違規，另涵蓋跳至主內容連結、
  單一 `h1`、標題階層、里程碑地標、鍵盤焦點環、200% 文字縮放與列印樣式。
- **動效**：所有動畫皆為漸進增強，**不引入任何動畫函式庫**，僅用 CSS 與
  `IntersectionObserver`。
  - `<head>` 的 inline script 在繪製前決定兩件事：還原儲存的主題，以及在
    `IntersectionObserver` 可用且未要求減少動態時加上 `js-motion` class。
  - `[data-reveal]` 元素只有在 `js-motion` 存在時才會先隱藏，因此**沒有 JavaScript
    或使用者要求減少動態時，內容一律直接可見**。
  - `useReveal` 為保險起見另掛 scroll 監聽：按 End 鍵、跳至 `#hash` 或還原捲動位置
    都可能一次越過整段內容，僅靠 `IntersectionObserver` 會讓被略過的元素停在
    `opacity: 0`。
  - inline script 另設 4 秒 fallback，React 若未掛載就移除 `js-motion`；`useReveal`
    掛載後會取消該計時器。
  - 統計數字採 count-up，遞增中的數字 `aria-hidden`，真實數值以 `.sr-only` 並列，
    避免螢幕閱讀器逐格朗讀。
  - 動效時長收斂為 `--dur-1..4`（120/200/320/480ms），曲線只用
    `cubic-bezier(0.16, 1, 0.3, 1)` 與 `cubic-bezier(0.4, 0, 0.2, 1)`，不使用任何
    回彈（bounce／elastic）曲線。`prefers-reduced-motion: reduce` 下停用整個動效引擎
    且強制 `[data-reveal]` 可見。

## 互動

| 元件 | 行為 |
| --- | --- |
| 頂部工具列 | sticky；左側為品牌 wordmark（回首頁），中央為區段導覽，右側為主題切換 |
| 品牌 wordmark | `ggk5743` 與角色以 1px 分隔線區隔，min-height 對齊控制列，觸控目標 ≥24px |
| 區段導覽 | 以中央視窗帶狀 `rootMargin` 做 scroll-spy，當前區段標 `aria-current="true"` |
| 主題切換 | 原生 radio（`role="radiogroup"`）三選一：跟隨系統／淺色／深色；寫入 `localStorage`，並以 `<html data-theme>` 覆寫系統偏好 |
| 捲動進度 | 2px 定寬條，`transform: scaleX()` 由 rAF 節流更新，`aria-hidden` |
| 回到頂端 | 捲動超過 600px 才渲染，44px 觸控目標，減少動態時改為瞬間跳轉 |
| 卡片 | 進場 `data-reveal` 交錯（`--stagger`），`hover` 時統一上浮並加深陰影 |

錨點目標設有 `scroll-margin-top`，不會被 sticky 工具列遮住。

## 視覺系統

### 三層 token

原始色（primitive）→ 語意（semantic）→ 元件（component）。元件一律引用**語意**層，
因此換膚只需改動 `:root` 與深色區塊。命名規則：若換成別的顏色後名稱就會失效，
那它就是原始色而非語意色（`--accent` 撐得住換品牌，`--blue-500` 不能）。

深色模式**不是反相**：elevation 改以「較亮表面」表達、邊框承擔更多結構、
飽和度下降約 15–20%（`#2a63d4` 配 `#6ea8ff`，而非反相結果）。

### 互動狀態層

hover／selected 不改色，而是疊一層半透明遮罩，因此同一組 token 在兩個主題都成立：

| token | 淺色 | 深色 |
| --- | --- | --- |
| `--state-hover` | `rgb(22 24 29 / 7%)` | `rgb(232 234 240 / 9%)` |
| `--state-focus` | `rgb(42 99 212 / 16%)` | `rgb(110 168 255 / 22%)` |

### 主題切換的三個決定

1. **分段文字控制**，非圖示切換。早期版本只有三個小圖示，語意不明；
   現在桌機顯示「自動／淺色／深色」，`<700px` 只顯示當選段文字（每段維持兩個中文字，
   因此桌面三段等寬）。
2. **`OPTIONS` 順序固定為 system → light → dark**，因為自動化稽核會依 DOM 順序切換主題；
   改順序會讓以索引為基準的測試失效。
3. **區分 `colorMode` 與 `resolvedColorMode`**。`system` 選項的 `aria-label`
   會讀出「跟隨系統，目前為淺色／深色」，否則螢幕閱讀器使用者無從判斷會得到哪種配色。
   `useResolvedScheme` 訂閱變化，OS 在傍晚切換時頁面會跟著變。

### 頂部工具列

- 未捲動時背景維持不透明 `rgb(246 247 249)`（舊版半透明會讓文字貼到內容量表上）。
- 捲動後 `min-height` 收合（3.25rem → 3.05rem），並以 `background` + `box-shadow` +
  `backdrop-filter` 三通道表現深度。
- `padding-top: env(safe-area-inset-top, 0px)`，避免瀏海機／圓角螢幕截掉工具列。

### 進場動效

避免「每個元素都滑 24px」的制式感，採三點：

1. **衰減距離而非累積延遲** — 後面的元素位移更小（`--reveal-shift: 10px` 起算逐項衰減），
   讀起來是編排而不是延遲。
2. **以段落分組** — 每個 section 一組（`--stagger: 52ms`），不是整頁一組。
3. **變化屬性** — 標題用短距離 beat（`--beat: 90ms`、`4px`）、
   次要內容只淡入不位移，只有主視覺真的位移。

### 平台偏好

| 偏好 | 作法 | 支援度 |
| --- | --- | --- |
| `prefers-color-scheme` | 預設值而非偏好，與使用者選擇分開儲存 | 全部 |
| `prefers-reduced-motion` | **閘控整個引擎**（不加 `js-motion`），而非執行後不動作 | 全部 |
| `prefers-reduced-transparency` | 每個半透明表面都有不透明底，模糊取消後仍以邊框＋陰影維持結構 | Chrome/Edge 118+、Firefox（旗標） |
| `prefers-contrast: more` | 僅覆寫語意 token，並移除陰影、把結構交給邊框 | Chrome、Firefox、Safari 16.4+ |
| `forced-colors: active` | 以 `CanvasText` / `Highlight` / `HighlightText` 取代；**不做第二套設計** | Chromium、Firefox |

`forced-colors` 下僅以顏色表達的意義（錯誤紅、成功綠）會消失，因此這些狀態一律附
圖示或文字。

## 品質

- **字型**：DM Sans（可變，自托管）與 Instrument Serif，置於 `public/fonts/`，
  以 `src/fonts.css` 的 `@font-face` 載入，**不發出任何第三方請求**，離線亦可正確渲染。
  字型家族僅 2 個，字級收斂為 1.25 模組化比例（`--fs-*`），正文行寬上限 `--measure: 40em`。
- **配色對比**：`--accent`（淺色 `#2a63d4` / 深色 `#6ea8ff`）與 `--stars`
  （淺色 `#9a6600` / 深色 `#d99b1a`）皆經 WCAG 2.1 AA 驗證，於 `--bg`、`--surface`
  與深色表面上均達 4.5:1。兩色皆以 token 隨主題切換，勿寫死單一色碼。
- **無障礙**：以 axe-core 於淺色／深色模式掃描皆為 0 違規，另涵蓋跳至主內容連結、
  單一 `h1`、標題階層、里程碑地標、鍵盤焦點環、200% 文字縮放與列印樣式。
- **動效**：所有動畫皆為漸進增強，**不引入任何動畫函式庫**，僅用 CSS 與
  `IntersectionObserver`。
  - `<head>` 的 inline script 在繪製前決定兩件事：還原儲存的主題，以及在
    `IntersectionObserver` 可用且未要求減少動態時加上 `js-motion` class。
  - `[data-reveal]` 元素只有在 `js-motion` 存在時才會先隱藏，因此**沒有 JavaScript
    或使用者要求減少動態時，內容一律直接可見**。
  - `useReveal` 為保險起見另掛 scroll 監聽：按 End 鍵、跳至 `#hash` 或還原捲動位置
    都可能一次越過整段內容，僅靠 `IntersectionObserver` 會讓被略過的元素停在
    `opacity: 0`。
  - inline script 另設 4 秒 fallback，React 若未掛載就移除 `js-motion`；`useReveal`
    掛載後會取消該計時器。
  - 統計數字採 count-up，遞增中的數字 `aria-hidden`，真實數值以 `.sr-only` 並列，
    避免螢幕閱讀器逐格朗讀。
  - 動效時長收斂為 `--dur-1..4`（120/200/320/480ms），曲線只用
    `cubic-bezier(0.16, 1, 0.3, 1)` 與 `cubic-bezier(0.4, 0, 0.2, 1)`，不使用任何
    回彈（bounce／elastic）曲線。`prefers-reduced-motion: reduce` 下停用整個動效引擎
    且強制 `[data-reveal]` 可見。

### 自動化稽核

五套 Playwright 稽核（使用本機 Brave 執行檔）涵蓋版面、字體、動效、深淺主題與
平台偏好，目前 **185 項全數通過**：

| 稽核 | 項數 | 涵蓋 |
| --- | --- | --- |
| `verify.mjs` | 43 | 內容契約、語意結構、375px 無水平溢出 |
| `a11y-audit.mjs` | 27 | axe（淺／深）、鍵盤、列印、200% 縮放 |
| `type-audit.mjs` | 14 | 字型載入、字級模組、截斷 |
| `motion-audit.mjs` | 28 | reveal 引擎、count-up、scroll-spy、主題持久化 |
| `chrome-audit.mjs` | 52 | topbar 收合、觸控目標、遮擋、responsive 標籤 |
| `platform-audit.mjs` | 21 | 五種平台偏好、200%、無 JS |

稽核腳本目前存於 `%LOCALAPPDATA%\Temp\opencode\siteverify\`，**尚未納入版控**。
其中數項斷言刻意避開以下陷阱（皆有實測紀錄，詳見 SKILL
`enterprise-visual-system/references/08-known-unknowns.md`）：

- `prefers-reduced-transparency` 在 headless Chromium **預設為 reduce**，
  因此斷言「不透明底」而非「有沒有模糊」。
- `Highlight`／`HighlightText` 等系統色**不可寫死關鍵字**；本機 `HighlightText`
  就是白色。斷言時先向瀏覽器探測系統色再比對。
- `rgb()` 沒有 alpha 插槽，須先判斷元數量再取第 4 個值。
- `display: none` 量測得 `0×0` 而非 `null`，響應式斷言須區分「隱藏」與「不存在」。
- `aria-current` 在未捲動到任何區段時不存在，量測前必須先捲動。
- `rgb()` 沒有 alpha 插槽，須先判斷元數量再取第 4 個值。
- axe 會把**計算後的 opacity** 算進對比檢查，因此在淡入尚未結束時取樣會誤報
  `color-contrast`。稽核前必須先讓所有 reveal 收斂，並連跑兩次確認不是競態。
- 無 JS 時 `<div id="root">` 本來就是空的（純 SPA）；斷言必須排除 `script`／`style`
  的文字，否則會把 inline script 的原始碼算成「頁面內容」而假通過。已補上
  `<noscript>` 區塊提供純文字版本，並直接斷言其存在。

## 授權

尚未指定授權。`LICENSE` 檔案為空缺，由網站擁有者自行決定釋出條件。

頭像與 LittleSkin 個人形象為個人資產，僅供本人使用，不隨原始碼釋出。
