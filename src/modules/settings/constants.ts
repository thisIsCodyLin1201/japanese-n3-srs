import type { StudyMode } from './types'

export const CATEGORIES = ['全部', '動詞', '形容詞', '副詞', '外來語']

export const MODE_LABEL: Record<StudyMode, string> = {
  reco: '看中文',
  cloze: '填空例句',
  both: '兩者皆練',
}
