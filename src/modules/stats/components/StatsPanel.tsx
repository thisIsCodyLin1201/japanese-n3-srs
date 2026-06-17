import { useAtomValue } from 'jotai'
import styled from 'styled-components'

import { Panel, PanelHint } from '~/components/Panel'
import { deck } from '~/modules/deck/deck'
import { MODE_LABEL } from '~/modules/settings/constants'
import { storeAtom } from '~/store/atoms'

import { selectStats } from '../queries/selectStats'

const Bar = styled.div`
  height: 10px;
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: 6px;
  overflow: hidden;
`

const BarFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.accent};
  transition: width 0.3s;
`

export function StatsPanel() {
  const store = useAtomValue(storeAtom)
  const { total, learned, dueCount } = selectStats(store)

  return (
    <Panel>
      <h2>統計</h2>
      <p>
        範圍：{store.settings.category}．{MODE_LABEL[store.settings.mode]}
      </p>
      <p>題目總數：{total}</p>
      <p>已學過：{learned}</p>
      <p>今天待複習：{dueCount}</p>
      <Bar>
        <BarFill style={{ width: `${total ? (learned / total) * 100 : 0}%` }} />
      </Bar>
      <PanelHint>整副字庫 {deck.length} 字，其中 202 個動詞可出填空題。</PanelHint>
    </Panel>
  )
}
