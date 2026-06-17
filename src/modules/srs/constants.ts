import type { Grade } from './types'

// 4 顆評分鈕的順序與文字；按鈕顏色由 theme.colors.grade[g] 決定。
export const GRADES: { g: Grade; label: string }[] = [
  { g: 'again', label: '忘記' },
  { g: 'hard', label: '模糊' },
  { g: 'good', label: '記得' },
  { g: 'easy', label: '秒答' },
]
