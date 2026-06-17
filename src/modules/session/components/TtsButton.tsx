import styled from 'styled-components'

import { IconSpeaker } from '~/components/icons'
import { speak, ttsSupported } from '~/modules/tts/tts'

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  width: 28px;
  height: 28px;
  margin-left: 6px;
  padding: 0;
  border: none;
  background: none;
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.iconBtn};
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.05s ease;

  svg {
    width: 18px;
    height: 18px;
    display: block;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ theme }) => theme.colors.iconBtnHoverBg};
    }
  }

  &:active {
    transform: scale(0.9);
  }
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
      <IconSpeaker />
    </Button>
  )
}
