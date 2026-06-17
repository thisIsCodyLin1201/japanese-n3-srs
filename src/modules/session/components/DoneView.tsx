import { useAtomValue } from 'jotai'
import styled from 'styled-components'

import { selectStats } from '~/modules/stats/queries/selectStats'
import { storeAtom } from '~/store/atoms'

import { useSession } from '../hooks/useSession'

const Wrap = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`

const Emoji = styled.div`
  font-size: 64px;
`

const Hint = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`

const PrimaryButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onAccent};
  border: none;
  border-radius: ${({ theme }) => theme.radius.button};
  padding: 18px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  min-height: 56px;
`

// 佇列清空後的完成畫面。
export function DoneView() {
  const store = useAtomValue(storeAtom)
  const { done, restart } = useSession()
  const { dueCount } = selectStats(store)
  const allNewDone = dueCount === 0 && store.daily.newCount >= store.settings.newPerDay

  return (
    <Wrap>
      <Emoji>🎉</Emoji>
      <p>本回合完成！今天已複習 {done} 題。</p>
      <Hint>
        {allNewDone ? '今日新卡也學完了，明天再來吧～' : '可在設定調高每日新卡上限，或明天再來。'}
      </Hint>
      <PrimaryButton onClick={() => restart()}>重新整理佇列</PrimaryButton>
    </Wrap>
  )
}
