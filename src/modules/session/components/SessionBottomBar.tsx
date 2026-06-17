import styled from 'styled-components'

import { Button } from '~/components/Button'

import { useSession } from '../hooks/useSession'
import { GradeBar } from './GradeBar'

const Bar = styled.div`
  flex: 0 0 auto;
  padding-top: 10px;
`

// 底部操作列：未翻面顯示「顯示答案」，翻面後顯示四顆評分鈕。
export function SessionBottomBar() {
  const { current, flipped, setFlipped, previews, grade } = useSession()
  if (!current) return null

  return (
    <Bar>
      {!flipped ? (
        <Button intent="primary" block onClick={() => setFlipped(true)}>
          顯示答案
        </Button>
      ) : (
        <GradeBar previews={previews!} onGrade={grade} />
      )}
    </Bar>
  )
}
