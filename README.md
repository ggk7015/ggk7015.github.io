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

`vercel.json` 指定 `npm run build` → `dist`，並為 `/assets/*` 與 `/fonts/*`
設定 `max-age=31536000, immutable`，其餘靜態資源為 7 天。

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
| 頂部工具列 | sticky；左側為區段導覽，右側為主題切換 |
| 區段導覽 | 以中央視窗帶狀 `rootMargin` 做 scroll-spy，當前區段標 `aria-current="true"` |
| 主題切換 | 原生 radio（`role="radiogroup"`）三選一：跟隨系統／淺色／深色；寫入 `localStorage`，並以 `<html data-theme>` 覆寫系統偏好 |
| 捲動進度 | 2px 定寬條，`transform: scaleX()` 由 rAF 節流更新，`aria-hidden` |
| 回到頂端 | 捲動超過 600px 才渲染，44px 觸控目標，減少動態時改為瞬間跳轉 |
| 卡片 | 進場 `data-reveal` 交錯（`--stagger`），`hover` 時統一上浮並加深陰影 |

錨點目標設有 `scroll-margin-top`，不會被 sticky 工具列遮住。

## 授權

尚未指定授權。`LICENSE` 檔案為空缺，由網站擁有者自行決定釋出條件。

頭像與 LittleSkin 個人形象為個人資產，僅供本人使用，不隨原始碼釋出。
