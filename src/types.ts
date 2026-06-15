export interface Sentence {
  ja: string
  zh: string
}

export interface Card {
  id: string
  category: string // 動詞 / 形容詞 / 副詞 / 外來語
  pos: string // 細分詞性
  kana: string | null // 假名讀音（複合動詞為 null）
  kanji: string | null // 漢字（無則 null）
  zh: string // 中文意思
  sentence: Sentence | null
}

export interface CardState {
  ef: number // ease factor
  reps: number // 連續答對次數
  interval: number // 間隔天數
  due: string // 下次到期日 ISO yyyy-mm-dd
  introduced: boolean // 是否已學過
  lapses: number // 忘記次數
}

export interface Store {
  version: number
  states: Record<string, CardState>
  settings: {
    newPerDay: number
    category: string // 全部 / 動詞 / 形容詞 / 副詞 / 外來語
  }
  daily: {
    date: string
    newCount: number
  }
}
