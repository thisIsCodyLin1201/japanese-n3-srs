import styled from 'styled-components'

import type { Card, CardType } from '~/modules/deck/types'

const Face = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
`

const ZhBig = styled.div`
  font-size: 38px;
  font-weight: 700;
  line-height: 1.25;
`

const ClozeSentence = styled.div`
  font-size: 26px;
  font-weight: 600;
  line-height: 1.5;
`

const ClozeHint = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.muted};

  b {
    color: ${({ theme }) => theme.colors.text};
  }
`

const Hint = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`

interface Props {
  card: Card
  type: CardType
}

// 卡片正面：cloze 顯示挖空例句，reco 顯示中文意思。
export function CardFront({ card, type }: Props) {
  if (type === 'cloze') {
    return (
      <Face>
        <ClozeSentence>{card.cloze!.text}</ClozeSentence>
        <ClozeHint>
          動詞．意思：<b>{card.zh}</b>
        </ClozeHint>
        <Hint>想想空格的動詞，點一下看答案</Hint>
      </Face>
    )
  }
  return (
    <Face>
      <ZhBig>{card.zh}</ZhBig>
      <Hint>想假名／漢字，點一下看答案</Hint>
    </Face>
  )
}
