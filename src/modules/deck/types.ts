export interface Sentence {
  ja: string
  zh: string
}

export interface Cloze {
  text: string // 挖空後的例句，空格為 ＿＿＿
  answer: string // 被挖掉的活用形
}

export interface Card {
  id: string
  category: string // 動詞 / 形容詞 / 副詞 / 外來語
  pos: string // 細分詞性
  kana: string | null // 假名讀音（複合動詞為 null）
  kanji: string | null // 漢字（無則 null）
  zh: string // 中文意思
  sentence: Sentence | null
  cloze: Cloze | null // Mode 2 填空例句（僅有例句+漢字的動詞）
}

// SRS 排程的最小單位。一張有例句的動詞卡會拆成 reco + cloze 兩個 item，各自獨立排程。
export type CardType = 'reco' | 'cloze'
