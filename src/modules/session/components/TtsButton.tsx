import styled from 'styled-components'

import { speak, ttsSupported } from '~/modules/tts/tts'

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  margin-left: 8px;
  vertical-align: middle;
`

interface Props {
  text: string
}

// 朗讀鈕（阻止冒泡，避免觸發卡片翻面）。
export function TtsButton({ text }: Props) {
  if (!ttsSupported()) return null
  return (
    <Button
      aria-label="朗讀"
      onClick={(e) => {
        e.stopPropagation()
        speak(text)
      }}
    >
      🔊
    </Button>
  )
}
