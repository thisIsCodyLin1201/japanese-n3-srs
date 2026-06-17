// 設計 token 取自公司設計系統（淺色產品介面）。
// 基準：白卡片、淺灰頁面底、海洋藍主色、細邊框 + 柔和層次陰影。
export const theme = {
  colors: {
    // 頁面與表面
    bg: '#f2f2f2', // 頁面底（neutral200）
    surface: '#ffffff', // 白卡片 / 面板
    surface2: '#f2f2f2', // 卡片內的淺灰區塊（例句框、輸入、進度軌道）
    border: '#e0e0e0', // 表面細邊框（neutral300）

    // 文字
    text: 'rgba(0, 0, 0, 0.85)', // textPrimary
    muted: 'rgba(0, 0, 0, 0.5)', // textSecondary

    // 主色（海洋藍）
    accent: '#3397cf', // dcardPrimary (blue500)
    accentHover: '#5ab0db', // hover (blue400)
    onAccent: '#ffffff', // 主色上的文字

    // 次要 / 停用 / 圖示按鈕
    btnSecondary: 'rgba(0, 0, 0, 0.05)', // bgContainer
    btnSecondaryHover: 'rgba(0, 0, 0, 0.03)', // bgGreyBtnHover
    btnDisabled: '#e0e0e0', // bgBtnDisabled
    textDisabled: 'rgba(0, 0, 0, 0.25)', // alphaBlack400
    iconBtn: 'rgba(0, 0, 0, 0.7)', // iconButton (alphaBlack800)
    iconBtnHoverBg: 'rgba(0, 0, 0, 0.04)',

    // 卡片類型徽章
    recoBadgeBg: '#e7f3f9', // blue100
    recoBadgeText: '#006aa6', // blue600
    clozeBadgeBg: '#f3ecfc', // 淺紫
    clozeBadgeText: '#996fc9', // purple600

    // 狀態色（清空進度等）
    danger: '#ea5c5c', // stateDanger (red500)
    dangerHover: '#f78c88', // stateDangerHover (red400)
    dangerText: '#ffffff',
    warning: '#f0a955', // stateReminder (yellow500)
    warningHover: '#f0b941', // stateReminderHover (yellow400)

    // 評分鈕：對應狀態色 + 主色
    grade: {
      again: '#ea5c5c', // stateDanger
      hard: '#f0a955', // stateReminder (yellow500)
      good: '#49bd69', // stateSuccess (green500)
      easy: '#3397cf', // dcardPrimary
    },
    gradeHover: {
      again: '#f78c88', // red400
      hard: '#f0b941', // yellow400
      good: '#6fc985', // green400
      easy: '#5ab0db', // blue400
    },
  },
  radius: {
    card: '12px',
    panel: '12px',
    button: '10px', // 大型按鈕
    control: '8px', // 中型控制項
  },
  shadow: {
    card: '0px 2px 8px -1px rgba(0, 0, 0, 0.2)', // level2
    panel: '0px 1px 6px -2px rgba(0, 0, 0, 0.32)', // level1
  },
  layout: {
    maxWidth: '560px',
  },
} as const

export type AppTheme = typeof theme
