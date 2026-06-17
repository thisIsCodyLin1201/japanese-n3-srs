import { useAtomValue, useSetAtom } from 'jotai'

import { restartSessionAtom } from '~/modules/session/atoms'
import { panelAtom, storeAtom } from '~/store/atoms'

import { defaultStore } from '../store'

// 清空所有複習進度（保留目前設定），並重建本回合佇列。
export function useResetProgress() {
  const settings = useAtomValue(storeAtom).settings
  const setStore = useSetAtom(storeAtom)
  const restartSession = useSetAtom(restartSessionAtom)
  const setPanel = useSetAtom(panelAtom)

  return () => {
    if (!confirm('確定清空所有複習進度？此動作無法復原。')) return
    const fresh = defaultStore()
    fresh.settings = settings
    setStore(fresh)
    restartSession(fresh)
    setPanel(null)
  }
}
