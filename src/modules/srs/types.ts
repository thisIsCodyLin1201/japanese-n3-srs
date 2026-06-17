// SM-2 的 4 顆評分鈕對應的等級。
export type Grade = 'again' | 'hard' | 'good' | 'easy'

export interface CardState {
  ef: number // ease factor
  reps: number // 連續答對次數
  interval: number // 間隔天數
  due: string // 下次到期日 ISO yyyy-mm-dd
  introduced: boolean // 是否已學過
  lapses: number // 忘記次數
}
