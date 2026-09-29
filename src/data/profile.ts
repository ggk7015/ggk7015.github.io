export type LinkKind = 'github' | 'gitlab' | 'instagram' | 'facebook'

export interface LinkItem {
  kind: LinkKind
  label: string
  handle: string
  href: string
  note?: string
  shareHref?: string
}

export interface Project {
  name: string
  summary: string
  highlights: string[]
  stack: string[]
  href?: string
  live?: string
  stars?: number
}

export interface ExperienceItem {
  area: string
  upstream: string
  upstreamAuthor: string
  detail: string
}

export interface SkillGroup {
  category: string
  items: string[]
}

export const profile = {
  name: 'ggk5743',
  tagline: '全端開發者 ・ Minecraft 生態 / 桌面應用 / 基礎設施',
  bio: [
    '從 Fabric 模組到 Next.js 後台、從 Paper 外掛最佳化到 Tauri 桌面應用。',
    '熱愛把臃腫的東西改小、把壞掉的東西修好，並且把過程寫成可重現的腳本。',
  ],
  avatar: '/avatar.png',
  skin: '/skin.webp',
  joined: '2024-11-05',
  location: undefined as string | undefined,
} as const

export const stats = [
  { label: '公開 Repos', value: '8' },
  { label: '原創 Commit', value: '76' },
  { label: 'Stars', value: '1' },
] as const

export const links: LinkItem[] = [
  {
    kind: 'github',
    label: 'GitHub',
    handle: 'ggk7015',
    href: 'https://github.com/ggk7015',
  },
  {
    kind: 'gitlab',
    label: 'GitLab',
    handle: 'ylerk7015',
    href: 'https://gitlab.com/ylerk7015',
    note: '日後會對該平台積極跟進',
  },
  {
    kind: 'instagram',
    label: 'Instagram',
    handle: 'raisa.scp',
    href: 'https://www.instagram.com/raisa.scp',
    shareHref: 'https://www.instagram.com/raisa.scp?stkn=MXI4cWM4ZnhmdTM4Mw==',
  },
  {
    kind: 'facebook',
    label: 'Facebook',
    handle: 'ggk7015',
    href: 'https://www.facebook.com/ggk7015',
    shareHref: 'https://www.facebook.com/share/1FASuqLzNQ/',
  },
]

export const projects: Project[] = [
  {
    name: 'abstract-site',
    summary:
      'Minecraft 生存伺服器「抽象」官網，內建完整 CMS 後台與分析儀表板。',
    highlights: [
      '自建 scrypt 密碼雜湊 + httpOnly session（14 天）+ timingSafeEqual 定時比較',
      '零依賴手寫 SVG 圖表：趨勢折線、熱力圖、排行長條',
      '自寫 Minecraft Server List Ping 協定，取即時在線人數',
      'Discord REST API v10 整合：invite with_counts + bot token 鏡像頻道',
      'src/lib/redact.ts 統一遮罩、guard.ts 統一錯誤出口、npm run audit:secrets 擋憑證外洩',
    ],
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS v4',
      'PostgreSQL',
      'Vercel',
      'Discord API v10',
    ],
    href: 'https://github.com/ggk7015/abstract-site',
    live: 'https://abstract-site-sable.vercel.app',
  },
  {
    name: 'class-website',
    summary:
      '資訊班級資訊網站。同一個 repo 內並存四種後端實作，驗證同一份前端在不同技術棧下的行為。',
    highlights: [
      'Vanilla JS ES Modules SPA：Anime.js v4 scroll observer + Motion animate',
      'CSS Custom Properties 作為 design token',
      '同一 repo 四種後端：Node / ASP.NET Core / 純 JDK HttpServer / Actix-web',
      'OpenWrt .ipk 打包、Cloudflare DNS 自動設定文件、GitHub Actions CI',
    ],
    stack: [
      'JavaScript',
      'ASP.NET Core',
      'Java',
      'Rust (Actix-web)',
      'C#',
      'OpenWrt',
      'GitHub Actions',
    ],
    href: 'https://github.com/ggk7015/class-website',
  },
  {
    name: 'ggk7015-mod',
    summary:
      'SCP 設定向的 GOC 主題武器模組，含自訂狀態效果、合成配方與雙語系資源。',
    highlights: [
      '自訂狀態效果 anomaly_suppression，套用後給予持續的攻擊與移動懲罰',
      'zh_tw / en_us 語系檔 + 物品模型 + 合成配方',
      'tools/upload_modrinth.ps1 自動上架腳本，含 API 錯誤與 429 backoff 處理',
    ],
    stack: ['Java 25', 'Fabric', 'Fabric Loom', 'Minecraft 26.2', 'PowerShell'],
    href: 'https://github.com/ggk7015/ggk7015-mod',
  },
  {
    name: 'slimefun-Plugin',
    summary:
      'Slimefun v4.9 的精簡版本，目標是讓它在低記憶體的 Paper 伺服器上跑得起來。',
    highlights: [
      'Maven shade 最小化：2.09 MB → 1.70 MB',
      'PaperLib 以最小 stub 取代，砍掉整條相依鏈',
      '修正新版 Minecraft 的版本偵測邏輯',
      'JVM flags 調校，記憶體壓在 1.5 GB 以內',
    ],
    stack: ['Java', 'Maven Shade', 'Paper', 'Purpur', 'JVM 調校'],
    href: 'https://github.com/ggk7015/slimefun-Plugin',
    stars: 1,
  },
  {
    name: 'MCserver',
    summary: 'Minecraft 伺服器部署專案，以容器化方式管理執行環境。',
    highlights: ['Dockerfile 建置流程'],
    stack: ['Python', 'Docker'],
    href: 'https://github.com/ggk7015/MCserver',
  },
]

export const experiences: ExperienceItem[] = [
  {
    area: 'Rust / JNI / 動態庫注入',
    upstream: 'RuView、DarkClient',
    upstreamAuthor: 'rUv、TheDarkSword',
    detail: '大型 Rust workspace 的編譯、除錯與執行環境建置。',
  },
  {
    area: 'Fabric 客戶端 / Mixin / Access Widener',
    upstream: 'Aoba-Client',
    upstreamAuthor: 'Colton Kennedy 等',
    detail: '客戶端模組開發與 bytecode 混織研究。',
  },
  {
    area: 'Electron 桌面應用',
    upstream: 'Plain Craft Launcher 2',
    upstreamAuthor: 'PCL 開發團隊',
    detail: '遊戲啟動流程與版本管理的實作理解。',
  },
  {
    area: 'Tauri 2 + Rust 桌面應用',
    upstream: 'LunaCraft',
    upstreamAuthor: '自建',
    detail:
      'Tauri 2 / React 19 / Rust；Microsoft、LittleSkin 與離線帳號認證、版本管理、Mods 管理、自動更新。',
  },
  {
    area: 'ESP32-S3 韌體',
    upstream: 'esp32s3-ap-web',
    upstreamAuthor: '自建',
    detail: 'WiFi AP + 內建 Web 設定介面；ArduinoJson / SD / SPI。',
  },
]

export const skills: SkillGroup[] = [
  {
    category: '語言',
    items: ['TypeScript', 'Java', 'JavaScript', 'Python', 'Rust', 'C#', 'PowerShell', 'SQL'],
  },
  {
    category: '前端',
    items: [
      'Next.js 16 (App Router / RSC)',
      'React 19',
      'Tailwind CSS v4',
      'Vite',
      'Anime.js',
      'CSS Custom Properties',
    ],
  },
  {
    category: '後端',
    items: ['PostgreSQL', 'ASP.NET Core', 'Actix-web', 'JDK HttpServer', 'REST API'],
  },
  {
    category: '桌面 / 行動',
    items: ['Tauri 2', 'Electron 31', 'React Native (Expo)'],
  },
  {
    category: 'Minecraft',
    items: [
      'Fabric / Fabric Loom',
      'Mixin',
      'Access Widener',
      'Paper / Purpur',
      'Modrinth API',
      '資料包 / 資源包',
      'Server List Ping 協定',
    ],
  },
  {
    category: '基礎設施',
    items: [
      'Vercel',
      'Docker',
      'GitHub Actions',
      'Gradle',
      'Maven Shade',
      'Tailscale',
      'Windows Service',
    ],
  },
  {
    category: '資安',
    items: [
      'scrypt 密碼雜湊',
      '定時安全比較',
      'httpOnly session',
      'secret 遮罩',
      'CI 憑證掃描',
    ],
  },
]
