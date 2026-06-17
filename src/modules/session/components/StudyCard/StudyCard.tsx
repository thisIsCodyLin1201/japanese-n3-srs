import styled from 'styled-components'

import type { Card, CardType } from '~/modules/deck/types'

import { CardBack } from './CardBack'
import { CardFront } from './CardFront'
import { CardTag } from './CardTag'

const Surface = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.card};
  padding: 28px 22px;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.card};
`

interface Props {
  item: { card: Card; type: CardType }
  isNew: boolean
  flipped: boolean
  onFlip: () => void
}

export function StudyCard({ item, isNew, flipped, onFlip }: Props) {
  return (
    <Surface role="button" onClick={() => !flipped && onFlip()}>
      <CardTag type={item.type} category={item.card.category} pos={item.card.pos} isNew={isNew} />
      {!flipped ? (
        <CardFront card={item.card} type={item.type} />
      ) : (
        <CardBack card={item.card} type={item.type} />
      )}
    </Surface>
  )
}
