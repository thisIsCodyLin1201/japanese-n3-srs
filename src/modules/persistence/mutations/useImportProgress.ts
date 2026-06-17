import { useSetAtom } from 'jotai'

import { restartSessionAtom } from '~/modules/session/atoms'
import { panelAtom, storeAtom } from '~/store/atoms'

import type { Store } from '../types'

// 從 JSON 檔匯入進度，覆蓋目前 store 並重建本回合佇列。
export function useImportProgress() {
  const setStore = useSetAtom(storeAtom)
  const restartSession = useSetAtom(restartSessionAtom)
  const setPanel = useSetAtom(panelAtom)

  return (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const obj = JSON.parse(String(reader.result)) as Store
        if (!obj.states || !obj.settings) throw new Error('bad')
        if (!obj.settings.mode) obj.settings.mode = 'both'
        setStore(obj)
        restartSession(obj)
        setPanel(null)
        alert('已匯入進度 ✅')
      } catch {
        alert('檔案格式錯誤，匯入失敗')
      }
    }
    reader.readAsText(file)
  }
}
