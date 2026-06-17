import deckRaw from '~/deck.json'

import type { Card, CardType } from './types'

// 由 scripts/build-deck.mjs 從 data/n3_vocabulary.md 產生的整副字庫。
export const deck = deckRaw as Card[]

const cardMap = new Map(deck.map((c) => [c.id, c]))

// SRS item id：看中文 = 卡片 id；填空 = 卡片 id + ':cloze'
export function clozeId(id: string): string {
  return id + ':cloze'
}

export function parseItem(itemId: string): { card: Card; type: CardType } {
  const isCloze = itemId.endsWith(':cloze')
  const cardId = isCloze ? itemId.slice(0, -':cloze'.length) : itemId
  return { card: cardMap.get(cardId)!, type: isCloze ? 'cloze' : 'reco' }
}
