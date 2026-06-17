import styled from 'styled-components'

import type { CardType } from '~/modules/deck/types'

const Tag = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

const TypeBadge = styled.span<{ $type: CardType }>`
  border-radius: 6px;
  padding: 2px 7px;
  font-size: 11px;
  font-weight: 700;
  background: ${({ theme, $type }) =>
    $type === 'cloze' ? theme.colors.clozeBadgeBg : theme.colors.recoBadgeBg};
  color: ${({ theme, $type }) =>
    $type === 'cloze' ? theme.colors.clozeBadgeText : theme.colors.recoBadgeText};
`

const NewBadge = styled.span`
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onAccent};
  font-weight: 700;
  border-radius: 6px;
  padding: 1px 6px;
  font-size: 10px;
`

interface Props {
  type: CardType
  category: string
  pos: string
  isNew: boolean
}

export function CardTag({ type, category, pos, isNew }: Props) {
  return (
    <Tag>
      <TypeBadge $type={type}>{type === 'cloze' ? '填空' : '看中文'}</TypeBadge>
      {category}
      {pos ? ` · ${pos}` : ''}
      {isNew && <NewBadge>NEW</NewBadge>}
    </Tag>
  )
}
