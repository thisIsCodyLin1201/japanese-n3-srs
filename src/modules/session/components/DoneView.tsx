import { useAtomValue } from 'jotai'
import styled from 'styled-components'

import { Button } from '~/components/Button'
import { selectStats } from '~/modules/stats/queries/selectStats'
import { storeAtom } from '~/store/atoms'

import { useSession } from '../hooks/useSession'

const Wrap = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`

const Title = styled.h2`
  font-size: 24px;
  font-weight: 500;
  margin: 0;
`

const Summary = styled.p`
  font-size: 16px;
  margin: 0;
`

const Hint = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 0 8px;
`

// 佇列清空後的完成畫面。
export function DoneView() {
  const store = useAtomValue(storeAtom)
  const { done, restart } = useSession()
  const { dueCount } = selectStats(store)
  const allNewDone = dueCount === 0 && store.daily.newCount >= store.settings.newPerDay

  return (
    <Wrap>
      <Title>本回合結束</Title>
      <Summary>今天已複習 {done} 題</Summary>
      <Hint>
        {allNewDone ? '今日進度已完成，明天再繼續。' : '可在設定調高每日新卡上限，或明天再繼續。'}
      </Hint>
      <Button intent="primary" block onClick={() => restart()}>
        再複習一輪
      </Button>
    </Wrap>
  )
}
