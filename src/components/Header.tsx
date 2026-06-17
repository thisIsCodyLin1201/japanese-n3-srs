import { useAtom } from 'jotai'
import styled from 'styled-components'

import { panelAtom, type Panel } from '~/store/atoms'

const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
`

const Title = styled.h1`
  font-size: 18px;
  margin: 0;
`

const Actions = styled.div`
  button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 8px;
    min-width: 44px;
    min-height: 44px;
  }
`

export function Header() {
  const [panel, setPanel] = useAtom(panelAtom)
  const toggle = (p: Panel) => setPanel((cur) => (cur === p ? null : p))

  return (
    <Bar>
      <Title>N3 單字 SRS</Title>
      <Actions>
        <button aria-label="統計" onClick={() => toggle('stats')}>
          📊
        </button>
        <button aria-label="設定" onClick={() => toggle('settings')}>
          ⚙️
        </button>
      </Actions>
    </Bar>
  )
}
