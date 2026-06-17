import { useEffect } from 'react'

import { hasJaVoice, initTTS, speak, ttsSupported } from '../tts'

// 在 mount 時初始化語音清單，並回傳目前的朗讀能力與 speak 方法。
export function useTts() {
  useEffect(() => initTTS(), [])

  return {
    supported: ttsSupported(),
    hasJaVoice: hasJaVoice(),
    speak,
  }
}
