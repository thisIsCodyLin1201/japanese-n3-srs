import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import styled from 'styled-components'

import { restartSessionAtom } from '~/modules/session/atoms'
import { SessionView } from '~/modules/session/components/SessionView'
import { SettingsPanel } from '~/modules/settings/components/SettingsPanel'
import { StatsPanel } from '~/modules/stats/components/StatsPanel'
import { useTts } from '~/modules/tts/hooks/useTts'
import { panelAtom, storeAtom } from '~/store/atoms'

import { BottomBar } from './BottomBar'
import { Footer } from './Footer'
import { Header } from './Header'
import { StatBar } from './StatBar'

// 用 dvh 對應 iOS 動態網址列高度
const Container = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: calc(8px + var(--safe-top)) 16px calc(8px + var(--safe-bottom));
`

// 中段可捲動，評分列固定在底
const Content = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  gap: 16px;
`

export function AppShell() {
  const panel = useAtomValue(panelAtom)
  const store = useAtomValue(storeAtom)
  const restartSession = useSetAtom(restartSessionAtom)
  const tts = useTts()

  // 進場時建立今日佇列（取代原本 App 內的 mount useEffect）。
  useEffect(() => {
    restartSession(store)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container>
      <Header />
      <StatBar />
      <Content>
        {panel === 'settings' && <SettingsPanel />}
        {panel === 'stats' && <StatsPanel />}
        {!panel && <SessionView />}
      </Content>
      <BottomBar />
      <Footer supported={tts.supported} hasJaVoice={tts.hasJaVoice} />
    </Container>
  )
}
