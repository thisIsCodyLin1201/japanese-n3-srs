import type { CardState } from '~/modules/srs/types'
import type { Settings } from '~/modules/settings/types'

export interface Store {
  version: number
  states: Record<string, CardState>
  settings: Settings
  daily: {
    date: string
    newCount: number
  }
}
