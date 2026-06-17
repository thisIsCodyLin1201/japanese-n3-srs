import { useAtom } from 'jotai'
import styled from 'styled-components'

import { panelAtom, type Panel } from '~/store/atoms'

import { IconButton } from './IconButton'
import { IconChart, IconGear } from './icons'

const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
`

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`

const Actions = styled.div`
  display: flex;
  gap: 4px;
`

export function Header() {
  const [panel, setPanel] = useAtom(panelAtom)
  const toggle = (p: Panel) => setPanel((cur) => (cur === p ? null : p))

  return (
    <Bar>
      <Title>N3 單字複習</Title>
      <Actions>
        <IconButton aria-label="統計" aria-pressed={panel === 'stats'} onClick={() => toggle('stats')}>
          <IconChart />
        </IconButton>
        <IconButton
          aria-label="設定"
          aria-pressed={panel === 'settings'}
          onClick={() => toggle('settings')}
        >
          <IconGear />
        </IconButton>
      </Actions>
    </Bar>
  )
}
