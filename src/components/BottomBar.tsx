import { useAtom } from 'jotai'
import styled from 'styled-components'

import { SessionBottomBar } from '~/modules/session/components/SessionBottomBar'
import { panelAtom } from '~/store/atoms'

import { Button } from './Button'

const Bar = styled.div`
  flex: 0 0 auto;
  padding-top: 10px;
`

// 面板開啟時顯示「返回練習」；否則交給練習的底部操作列。
export function BottomBar() {
  const [panel, setPanel] = useAtom(panelAtom)

  if (panel) {
    return (
      <Bar>
        <Button intent="secondary" block onClick={() => setPanel(null)}>
          返回練習
        </Button>
      </Bar>
    )
  }

  return <SessionBottomBar />
}
