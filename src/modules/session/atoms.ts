import { atom } from 'jotai'

import type { Store } from '~/modules/persistence/types'
import { storeAtom } from '~/store/atoms'

import { buildPracticeQueue, buildQueue } from './queue'

// 本回合的暫存狀態（不持久化）：今日佇列、是否翻面、本回合已完成題數。
export const queueAtom = atom<string[]>([])
export const flippedAtom = atom(false)
export const doneAtom = atom(0)

// 以某個 store 重建本回合佇列（套用設定 / 匯入 / 重設 / 進場共用）。
export const restartSessionAtom = atom(null, (_get, set, store: Store) => {
  set(queueAtom, buildQueue(store))
  set(flippedAtom, false)
  set(doneAtom, 0)
})

// 再複習一輪：以目前 store 的範圍重新練習已學過的項目（完成畫面用）。
export const practiceAgainAtom = atom(null, (get, set) => {
  set(queueAtom, buildPracticeQueue(get(storeAtom)))
  set(flippedAtom, false)
  set(doneAtom, 0)
})
