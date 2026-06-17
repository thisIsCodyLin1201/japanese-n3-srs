import type { Store } from '~/modules/persistence/types'
import { selectItems } from '~/modules/session/queue'
import { todayISO } from '~/modules/srs/srs'

export interface Stats {
  total: number // 目前分類 + 模式下的題目總數
  learned: number // 已學過
  dueCount: number // 今天待複習
}

// 依目前分類 + 模式計算統計（StatBar / StatsPanel / DoneView 共用）。
export function selectStats(store: Store): Stats {
  const items = selectItems(store)
  const today = todayISO()
  const learned = items.filter((id) => store.states[id]?.introduced).length
  const dueCount = items.filter((id) => {
    const st = store.states[id]
    return Boolean(st?.introduced && st.due <= today)
  }).length
  return { total: items.length, learned, dueCount }
}
