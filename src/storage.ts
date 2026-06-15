import type { Store } from './types'
import { todayISO } from './srs'

const KEY = 'n3-srs-v1'

export function defaultStore(): Store {
  return {
    version: 1,
    states: {},
    settings: { newPerDay: 15, category: '全部' },
    daily: { date: todayISO(), newCount: 0 },
  }
}

export function load(): Store {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultStore()
    const s = JSON.parse(raw) as Store
    const today = todayISO()
    // 跨日 → 重置每日新卡計數
    if (!s.daily || s.daily.date !== today) {
      s.daily = { date: today, newCount: 0 }
    }
    if (!s.settings) s.settings = defaultStore().settings
    if (!s.states) s.states = {}
    return s
  } catch {
    return defaultStore()
  }
}

export function save(s: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* localStorage 滿了或被禁用，忽略 */
  }
}
