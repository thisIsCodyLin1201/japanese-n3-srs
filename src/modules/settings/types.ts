// 看中文 / 填空例句 / 兩者皆練
export type StudyMode = 'reco' | 'cloze' | 'both'

export interface Settings {
  newPerDay: number
  category: string // 全部 / 動詞 / 形容詞 / 副詞 / 外來語
  mode: StudyMode
}
