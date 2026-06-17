import { type ReactNode } from 'react'
import styled from 'styled-components'

import type { Card } from '~/modules/deck/types'

import { TtsButton } from './TtsButton'

const Box = styled.div`
  margin-top: 4px;
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  user-select: text; /* 例句允許選取 */
`

const Ja = styled.span`
  font-size: 20px;
  line-height: 1.5;

  mark {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.onAccent};
    border-radius: 4px;
    padding: 0 3px;
    font-weight: 700;
  }
`

const JaZh = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`

interface Props {
  card: Card
  highlight: boolean
}

// 例句；cloze 翻面時把答案高亮。
export function SentenceView({ card, highlight }: Props) {
  if (!card.sentence) return null
  const ja = card.sentence.ja
  let body: ReactNode = ja
  if (highlight && card.cloze) {
    const ans = card.cloze.answer
    const i = ja.indexOf(ans)
    if (i >= 0) {
      body = (
        <>
          {ja.slice(0, i)}
          <mark>{ans}</mark>
          {ja.slice(i + ans.length)}
        </>
      )
    }
  }
  return (
    <Box>
      <Ja>
        {body}
        <TtsButton text={ja} />
      </Ja>
      {card.sentence.zh && <JaZh>{card.sentence.zh}</JaZh>}
    </Box>
  )
}
