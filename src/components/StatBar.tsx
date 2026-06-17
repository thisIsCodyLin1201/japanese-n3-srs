import { useAtomValue } from 'jotai'
import styled from 'styled-components'

import { queueAtom } from '~/modules/session/atoms'
import { MODE_LABEL } from '~/modules/settings/constants'
import { selectStats } from '~/modules/stats/queries/selectStats'
import { storeAtom } from '~/store/atoms'

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 6px 0 10px;
  flex: 0 0 auto;
`

export function StatBar() {
  const store = useAtomValue(storeAtom)
  const queue = useAtomValue(queueAtom)
  const { dueCount } = selectStats(store)

  return (
    <Bar>
      <span>{store.settings.category}</span>
      <span>{MODE_LABEL[store.settings.mode]}</span>
      <span>
        新卡 {store.daily.newCount}/{store.settings.newPerDay}
      </span>
      <span>待複習 {dueCount}</span>
      <span>剩餘 {queue.length}</span>
    </Bar>
  )
}
