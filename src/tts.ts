// 用瀏覽器內建 Web Speech API 朗讀日文，免 API key、免費。
// 沒有日文語音時優雅降級（仍嘗試以 ja-JP 朗讀）。
let jaVoice: SpeechSynthesisVoice | null = null

export function ttsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function pickVoice(): void {
  if (!ttsSupported()) return
  const voices = window.speechSynthesis.getVoices()
  jaVoice =
    voices.find((v) => v.lang.toLowerCase().startsWith('ja')) ??
    voices.find((v) => /japan|日本|にほん/i.test(v.name)) ??
    null
}

export function initTTS(): void {
  if (!ttsSupported()) return
  pickVoice()
  // 語音清單常是非同步載入
  window.speechSynthesis.onvoiceschanged = pickVoice
}

export function hasJaVoice(): boolean {
  return !!jaVoice
}

export function speak(text: string): void {
  if (!ttsSupported() || !text) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ja-JP'
  if (jaVoice) u.voice = jaVoice
  u.rate = 0.9
  window.speechSynthesis.speak(u)
}
