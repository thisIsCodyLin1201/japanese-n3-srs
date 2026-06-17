import { useKeyboard } from '../hooks/useKeyboard'
import { useSession } from '../hooks/useSession'
import { DoneView } from './DoneView'
import { StudyCard } from './StudyCard/StudyCard'

// 練習主畫面：有題目時顯示卡片，否則顯示完成畫面。鍵盤操作在此掛載。
export function SessionView() {
  const { current, currentState, flipped, setFlipped, grade } = useSession()

  useKeyboard({
    enabled: !!current,
    flipped,
    onFlip: () => setFlipped(true),
    onGrade: grade,
  })

  if (!current) return <DoneView />

  return (
    <StudyCard
      item={current}
      isNew={!currentState?.introduced}
      flipped={flipped}
      onFlip={() => setFlipped(true)}
    />
  )
}
