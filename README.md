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
npm run dev      # 本機開發
npm run lint     # oxlint
npm run build    # tsc -b && vite build -> dist/
npm run preview  # 預覽正式建置結果
```

## 部署

- **GitHub Pages** — push 到 `main` 觸發 `.github/workflows/deploy.yml`，
  正式網址 <https://ggk7015.github.io/>
- **Vercel** — 專案名 `ggk5743`，`vercel.json` 指定 `npm run build` → `dist`

兩個環境使用同一份 Vite 建置結果，`base` 預設 `/` 即可運作。

## QR 碼

頁面內的 QR 碼由 `qr-creator` 產生，編碼當前網域的 origin，因此同一份程式碼
在 Pages 與 Vercel 上都會各自產生對應的 QR 碼。

`public/qr-print.svg` 是預先產生的**向量**印刷檔，編碼 `https://ggk7015.github.io/`，
可直接交給印刷廠而不會失真。

## 授權

尚未指定授權。`LICENSE` 檔案為空缺，由網站擁有者自行決定釋出條件。

頭像與 LittleSkin 個人形象為個人資產，僅供本人使用，不隨原始碼釋出。
