import styled from 'styled-components'

import { useSession } from '../hooks/useSession'
import { GradeBar } from './GradeBar'

const Bar = styled.div`
  flex: 0 0 auto;
  padding-top: 10px;
`

const ShowButton = styled.button`
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

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
  }
`

// 底部操作列：未翻面顯示「顯示答案」，翻面後顯示四顆評分鈕。
export function SessionBottomBar() {
  const { current, flipped, setFlipped, previews, grade } = useSession()
  if (!current) return null

  return (
    <Bar>
      {!flipped ? (
        <ShowButton onClick={() => setFlipped(true)}>顯示答案</ShowButton>
      ) : (
        <GradeBar previews={previews!} onGrade={grade} />
      )}
    </Bar>
  )
}
