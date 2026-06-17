import { useAtom } from 'jotai'
import styled from 'styled-components'

import { SessionBottomBar } from '~/modules/session/components/SessionBottomBar'
import { panelAtom } from '~/store/atoms'

const Bar = styled.div`
  flex: 0 0 auto;
  padding-top: 10px;
`

const GhostButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface2};
  color: ${({ theme }) => theme.colors.text};
  border: none;
  border-radius: ${({ theme }) => theme.radius.button};
  padding: 18px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  min-height: 56px;
`

// 面板開啟時顯示「返回練習」；否則交給練習的底部操作列。
export function BottomBar() {
  const [panel, setPanel] = useAtom(panelAtom)

  if (panel) {
    return (
      <Bar>
        <GhostButton onClick={() => setPanel(null)}>返回練習</GhostButton>
      </Bar>
    )
  }

  return <SessionBottomBar />
}
