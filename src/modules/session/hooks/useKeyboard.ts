import { useEffect } from 'react'

import { GRADES } from '~/modules/srs/constants'
import type { Grade } from '~/modules/srs/types'

interface Options {
  enabled: boolean
  flipped: boolean
  onFlip: () => void
  onGrade: (g: Grade) => void
}

// 桌機鍵盤：空白翻面，1~4 評分。
export function useKeyboard({ enabled, flipped, onFlip, onGrade }: Options) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!enabled) return
      if (e.code === 'Space') {
        e.preventDefault()
        onFlip()
      } else if (flipped && ['1', '2', '3', '4'].includes(e.key)) {
        onGrade(GRADES[Number(e.key) - 1].g)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
}
