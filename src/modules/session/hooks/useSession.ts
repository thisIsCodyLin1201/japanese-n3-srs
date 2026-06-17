import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'

import { parseItem } from '~/modules/deck/deck'
import { GRADES } from '~/modules/srs/constants'
import { freshState, schedule } from '~/modules/srs/srs'
import type { Grade } from '~/modules/srs/types'
import { storeAtom } from '~/store/atoms'

import { doneAtom, flippedAtom, practiceAgainAtom, queueAtom, restartSessionAtom } from '../atoms'

// 本回合練習的核心 hook：暴露目前題目、翻面狀態、評分與重整。
// 各元件各自呼叫此 hook，透過共享 atom 自動保持同步（呼應 Dcard 以 atom 串接元件的做法）。
export function useSession() {
  const store = useAtomValue(storeAtom)
  const setStore = useSetAtom(storeAtom)
  const [queue, setQueue] = useAtom(queueAtom)
  const [flipped, setFlipped] = useAtom(flippedAtom)
  const [done, setDone] = useAtom(doneAtom)
  const restartSession = useSetAtom(restartSessionAtom)
  const practiceAgain = useSetAtom(practiceAgainAtom)

  const restart = useCallback(() => restartSession(store), [restartSession, store])

  const grade = useCallback(
    (g: Grade) => {
      const id = queue[0]
      if (!id) return
      const prev = store.states[id] ?? freshState()
      const wasNew = !prev.introduced
      const nextState = schedule(prev, g)
      setStore((s) => ({
        ...s,
        states: { ...s.states, [id]: nextState },
        daily: wasNew ? { ...s.daily, newCount: s.daily.newCount + 1 } : s.daily,
      }))
      setQueue((q) => {
        const [, ...rest] = q
        return g === 'again' ? [...rest, id] : rest // 忘記 → 本回合稍後再出
      })
      setFlipped(false)
      setDone((d) => d + 1)
    },
    [queue, store, setStore, setQueue, setFlipped, setDone],
  )

  const current = queue[0] ? parseItem(queue[0]) : null
  const currentState = queue[0] ? (store.states[queue[0]] ?? freshState()) : null
  // 翻面後評分鈕上顯示的「下次間隔」預覽
  const previews = currentState
    ? (Object.fromEntries(
        GRADES.map((b) => [b.g, schedule(currentState, b.g).interval]),
      ) as Record<Grade, number>)
    : null

  return {
    queue,
    flipped,
    setFlipped,
    done,
    current,
    currentState,
    previews,
    grade,
    restart,
    practiceAgain,
  }
}
