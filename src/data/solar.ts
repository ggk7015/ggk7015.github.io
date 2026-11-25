export type SolarSatellite = {
  label: string
  kind: '專案' | '衍生' | '技術' | '研究' | '經驗' | '連結'
  detail: string
  href?: string
}

export type SolarPlanet = {
  id: string
  planet: string
  english: string
  theme: string
  caption: string
  description: string
  color: string
  target: 'work' | 'trajectory' | 'capabilities' | 'signal'
  satellites: readonly SolarSatellite[]
}

// Editorial categories, not literal Git branches. Each public project link is
// taken from the owner's existing portfolio or verified public repository.
export const SOLAR_PLANETS: readonly SolarPlanet[] = [
  {
    id: 'mercury', planet: '水星', english: 'MERCURY', theme: 'Minecraft 模組', caption: '從方塊世界開始', color: '#c49d7e', target: 'work',
    description: '以 Fabric 探索遊戲機制，從物品、合成配方到雙語資源，把構想實際放進 Minecraft。',
    satellites: [
      { label: 'ggk7015-mod', kind: '專案', detail: 'Fabric 主題武器模組', href: 'https://github.com/ggk7015/ggk7015-mod' },
      { label: 'Fabric / Loom', kind: '技術', detail: '模組與建置工具鏈' },
      { label: '雙語與配方', kind: '技術', detail: '繁體中文、英文與遊戲資源' },
    ],
  },
  {
    id: 'venus', planet: '金星', english: 'VENUS', theme: '伺服器與外掛', caption: '讓世界穩定運轉', color: '#dfb975', target: 'work',
    description: '圍繞 Paper 伺服器探索插件最佳化、相容性與部署，讓更多創意能在遊戲世界中運作。',
    satellites: [
      { label: 'slimefun-Plugin', kind: '衍生', detail: '基於 Slimefun/Slimefun4 的非官方建置與精簡', href: 'https://github.com/ggk7015/slimefun-Plugin' },
      { label: 'MCserver', kind: '專案', detail: 'Discord／Minecraft 簽到機器人容器化範例', href: 'https://github.com/ggk7015/MCserver' },
      { label: 'Paper / Purpur', kind: '技術', detail: 'Minecraft 伺服器生態' },
    ],
  },
  {
    id: 'earth', planet: '地球', english: 'EARTH', theme: '互動網頁', caption: '把想法帶到畫面上', color: '#65b7b7', target: 'work',
    description: '從個人作品集到互動 3D 展示，專注在跨裝置介面、可讀性與可操作的體驗。',
    satellites: [
      { label: '個人網站', kind: '專案', detail: 'React 與 TypeScript 作品集', href: 'https://github.com/ggk7015/ggk7015.github.io' },
      { label: '3D 模型展示', kind: '專案', detail: '互動式 360° 模型檢視', href: 'https://github.com/ggk7015/interactive-3d-viewer' },
      { label: 'React / Vite', kind: '技術', detail: '元件化開發與網站建置' },
    ],
  },
  {
    id: 'mars', planet: '火星', english: 'MARS', theme: '社群網站', caption: '為真實需求設計', color: '#d28366', target: 'work',
    description: '把公告、資訊與管理流程整理成網站，讓社群與日常使用更容易。',
    satellites: [
      { label: 'class-website', kind: '專案', detail: '響應式班級資訊網站', href: 'https://github.com/ggk7015/class-website' },
      { label: 'abstract-site', kind: '專案', detail: 'Minecraft 社群網站與後台', href: 'https://github.com/ggk7015/abstract-site' },
      { label: 'Responsive UI', kind: '技術', detail: '桌機、平板與手機介面' },
    ],
  },
  {
    id: 'jupiter', planet: '木星', english: 'JUPITER', theme: '後端與資料', caption: '看不見的系統基礎', color: '#d4ae86', target: 'capabilities',
    description: '從 API、資料儲存到管理介面，探索讓應用程式可靠運轉的後端結構。',
    satellites: [
      { label: 'PostgreSQL', kind: '技術', detail: '資料庫與應用整合' },
      { label: 'REST API', kind: '技術', detail: '服務之間的資料交換' },
      { label: 'abstract-site', kind: '專案', detail: '網站後台與資料管理', href: 'https://github.com/ggk7015/abstract-site' },
    ],
  },
  {
    id: 'saturn', planet: '土星', english: 'SATURN', theme: '部署與自動化', caption: '讓作品順利抵達', color: '#d5c18f', target: 'capabilities',
    description: '運用容器、持續整合與建置工具，讓開發流程更容易重現與維護。',
    satellites: [
      { label: 'Docker', kind: '技術', detail: '容器化執行環境' },
      { label: 'GitHub Actions', kind: '技術', detail: '自動化測試與部署' },
      { label: 'MCserver', kind: '專案', detail: '簽到機器人容器化範例', href: 'https://github.com/ggk7015/MCserver' },
    ],
  },
  {
    id: 'uranus', planet: '天王星', english: 'URANUS', theme: '桌面與裝置', caption: '跨越瀏覽器邊界', color: '#8ed0ca', target: 'trajectory',
    description: '探索桌面應用與裝置端介面，把網頁技術帶往不同的執行環境。',
    satellites: [
      { label: 'LunaCraft', kind: '經驗', detail: '作品集自述的 Tauri 桌面應用實作；公開來源未確認' },
      { label: 'ESP32-S3', kind: '經驗', detail: '作品集自述的裝置設定介面；公開來源未確認' },
      { label: 'Tauri / Rust', kind: '技術', detail: '桌面應用與系統程式' },
    ],
  },
  {
    id: 'neptune', planet: '海王星', english: 'NEPTUNE', theme: '探索與連結', caption: '持續向外探索', color: '#728ec9', target: 'signal',
    description: '開放原始碼、學習紀錄與合作交流，都是通往下一個想法的路徑。',
    satellites: [
      { label: 'GitHub', kind: '連結', detail: '公開程式碼與專案紀錄', href: 'https://github.com/ggk7015' },
      { label: '開源研究', kind: '研究', detail: 'RuView、Aoba-Client 等第三方研究；上游作者於經歷區標示' },
      { label: '聯絡方式', kind: '連結', detail: '透過既有社群平台取得聯繫' },
    ],
  },
] as const