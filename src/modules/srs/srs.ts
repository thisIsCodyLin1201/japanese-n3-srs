import type { CardState, Grade } from './types'

// SM-2 間隔重複演算法（SuperMemo 2），4 顆評分鈕對應 quality 值
const QUALITY: Record<Grade, number> = {
  again: 1, // 忘記
  hard: 3, // 模糊
  good: 4, // 記得
  easy: 5, // 秒答
}

export function todayISO(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + days)
  return todayISO(dt)
}

export function freshState(): CardState {
  return { ef: 2.5, reps: 0, interval: 0, due: todayISO(), introduced: false, lapses: 0 }
}

// 依評分回傳更新後的卡片狀態（不可變）
export function schedule(state: CardState, grade: Grade, today = todayISO()): CardState {
  const q = QUALITY[grade]
  let { ef, reps, interval, lapses } = state

  if (q < 3) {
    // 忘記 → 歸零、隔天再來
    reps = 0
    interval = 1
    lapses += 1
  } else {
    reps += 1
    if (reps === 1) interval = 1
    else if (reps === 2) interval = 6
    else interval = Math.round(interval * ef)
  }

  // 更新 ease factor（下限 1.3）
  ef = Math.max(1.3, ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))
  ef = Math.round(ef * 100) / 100

  return { ef, reps, interval, lapses, introduced: true, due: addDays(today, interval) }
}

export function intervalLabel(days: number): string {
  if (days <= 0) return '稍後'
  if (days === 1) return '1 天'
  if (days < 30) return `${days} 天`
  if (days < 365) return `${Math.round(days / 30)} 個月`
  return `${(days / 365).toFixed(1)} 年`
}
