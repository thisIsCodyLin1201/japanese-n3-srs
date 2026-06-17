import styled from 'styled-components'

import { GRADES } from '~/modules/srs/constants'
import { intervalLabel } from '~/modules/srs/srs'
import type { Grade } from '~/modules/srs/types'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`

const GradeButton = styled.button<{ $grade: Grade }>`
  border: none;
  border-radius: ${({ theme }) => theme.radius.button};
  padding: 12px 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  color: #fff;
  font-weight: 700;
  min-height: 64px;
  position: relative;
  background: ${({ theme, $grade }) => theme.colors.grade[$grade]};

  &:active {
    filter: brightness(0.85);
  }
`

const Label = styled.span`
  font-size: 16px;
`

const Interval = styled.span`
  font-size: 11px;
  opacity: 0.9;
  font-weight: 500;
`

const Key = styled.span`
  position: absolute;
  top: 4px;
  right: 7px;
  font-size: 10px;
  opacity: 0.55;
`

interface Props {
  previews: Record<Grade, number>
  onGrade: (g: Grade) => void
}

export function GradeBar({ previews, onGrade }: Props) {
  return (
    <Grid>
      {GRADES.map((b, i) => (
        <GradeButton key={b.g} $grade={b.g} onClick={() => onGrade(b.g)}>
          <Label>{b.label}</Label>
          <Interval>{intervalLabel(previews[b.g])}</Interval>
          <Key>{i + 1}</Key>
        </GradeButton>
      ))}
    </Grid>
  )
}
