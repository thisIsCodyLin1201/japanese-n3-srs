import { useAtomValue } from 'jotai'

import { todayISO } from '~/modules/srs/srs'
import { storeAtom } from '~/store/atoms'

// 把目前進度匯出成 JSON 檔下載（換裝置備份用）。
export function useExportProgress() {
  const store = useAtomValue(storeAtom)

  return () => {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `n3-srs-backup-${todayISO()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
}
