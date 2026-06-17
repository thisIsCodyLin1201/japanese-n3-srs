import { clozeId, deck } from '~/modules/deck/deck'
import type { Store } from '~/modules/persistence/types'
import { todayISO } from '~/modules/srs/srs'

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 依分類 + 模式，列出所有應納入練習的 item id
export function selectItems(store: Store): string[] {
  const { category, mode } = store.settings
  const pool = deck.filter((c) => category === '全部' || c.category === category)
  const ids: string[] = []
  for (const c of pool) {
    if (mode !== 'cloze') ids.push(c.id) // 看中文
    if (mode !== 'reco' && c.cloze) ids.push(clozeId(c.id)) // 填空（僅有 cloze 的卡）
  }
  return ids
}

// 再複習一輪：不論到期日，重新練習目前範圍內「已學過」的項目（洗牌）。
// 用於完成畫面——當日 SRS 佇列已清空時仍能立即再練一輪。
// 若範圍內尚無已學項目，則退回一般佇列（含新卡）。
export function buildPracticeQueue(store: Store): string[] {
  const introduced = selectItems(store).filter((id) => store.states[id]?.introduced)
  if (introduced.length === 0) return buildQueue(store)
  return shuffle(introduced)
}

// 今日佇列：到期複習 item + 當日剩餘額度的新 item，洗牌
export function buildQueue(store: Store): string[] {
  const today = todayISO()
  const reviews: string[] = []
  const fresh: string[] = []
  for (const id of selectItems(store)) {
    const st = store.states[id]
    if (st && st.introduced) {
      if (st.due <= today) reviews.push(id)
    } else {
      fresh.push(id)
    }
  }
  const remainingNew = Math.max(0, store.settings.newPerDay - store.daily.newCount)
  return shuffle([...reviews, ...shuffle(fresh).slice(0, remainingNew)])
}
