// 設計 token，對應原本 styles.css 的 :root CSS 變數。
// styled-components 透過 ThemeProvider 注入，元件以 ${({ theme }) => ...} 取用，
// 取代散落各處的色碼字面值（呼應 Dcard Web 以 theme 為單一來源的做法）。
export const theme = {
  colors: {
    bg: '#0f172a',
    surface: '#1e293b',
    surface2: '#334155',
    text: '#e2e8f0',
    muted: '#94a3b8',
    accent: '#38bdf8',
    onAccent: '#042f3f',
    recoBadgeBg: '#1e3a5f',
    recoBadgeText: '#93c5fd',
    clozeBadgeBg: '#3b2f5f',
    clozeBadgeText: '#c4b5fd',
    danger: '#7f1d1d',
    dangerText: '#fecaca',
    grade: {
      again: '#ef4444',
      hard: '#f59e0b',
      good: '#22c55e',
      easy: '#3b82f6',
    },
  },
  radius: {
    card: '20px',
    panel: '18px',
    button: '16px',
    control: '12px',
  },
  layout: {
    maxWidth: '560px',
  },
} as const

export type AppTheme = typeof theme
