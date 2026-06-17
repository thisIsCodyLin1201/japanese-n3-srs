import { atom } from 'jotai'

import { load, save } from '~/modules/persistence/store'
import type { Store } from '~/modules/persistence/types'
import type { Settings } from '~/modules/settings/types'

// 初始值來自 localStorage（含跨日重置 / 舊資料遷移邏輯，見 persistence/store）。
const baseStoreAtom = atom<Store>(load())

// 對外的 store atom：每次寫入時自動持久化，取代原本散在元件裡的 useEffect(save)。
export const storeAtom = atom(
  (get) => get(baseStoreAtom),
  (get, set, next: Store | ((prev: Store) => Store)) => {
    const value = typeof next === 'function' ? (next as (p: Store) => Store)(get(baseStoreAtom)) : next
    set(baseStoreAtom, value)
    save(value)
  },
)

// 設定的便捷讀寫：寫入只需傳要改的欄位。
export const settingsAtom = atom(
  (get) => get(storeAtom).settings,
  (_get, set, partial: Partial<Settings>) =>
    set(storeAtom, (s) => ({ ...s, settings: { ...s.settings, ...partial } })),
)

// 目前開啟的面板（設定 / 統計 / 無）。屬 UI 狀態，不持久化。
export type Panel = 'settings' | 'stats' | null
export const panelAtom = atom<Panel>(null)
