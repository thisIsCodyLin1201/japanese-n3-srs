import styled from 'styled-components'

import type { Card, CardType } from '~/modules/deck/types'

import { SentenceView } from '../SentenceView'
import { TtsButton } from '../TtsButton'

const Face = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
`

const Reading = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`

const Kanji = styled.span`
  font-size: 42px;
  font-weight: 700;
`

const Kana = styled.span`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.accent};
`

const ZhSmall = styled.div`
  font-size: 17px;
  color: ${({ theme }) => theme.colors.muted};
`

interface Props {
  card: Card
  type: CardType
}

// 卡片背面：讀音（漢字／假名）＋ 中文 ＋ 例句。
export function CardBack({ card, type }: Props) {
  return (
    <Face>
      <Reading>
        {card.kanji && <Kanji>{card.kanji}</Kanji>}
        {card.kana && <Kana>{card.kana}</Kana>}
        <TtsButton text={card.kanji ?? card.kana ?? ''} />
      </Reading>
      <ZhSmall>{card.zh}</ZhSmall>
      <SentenceView card={card} highlight={type === 'cloze'} />
    </Face>
  )
}
