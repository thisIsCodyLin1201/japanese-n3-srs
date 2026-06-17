import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useRef } from 'react'
import styled from 'styled-components'

import { Button } from '~/components/Button'
import { Panel, PanelHint } from '~/components/Panel'
import { useExportProgress } from '~/modules/persistence/mutations/useExportProgress'
import { useImportProgress } from '~/modules/persistence/mutations/useImportProgress'
import { useResetProgress } from '~/modules/persistence/mutations/useResetProgress'
import { restartSessionAtom } from '~/modules/session/atoms'
import { CATEGORIES } from '~/modules/settings/constants'
import type { StudyMode } from '~/modules/settings/types'
import { panelAtom, settingsAtom, storeAtom } from '~/store/atoms'

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
`

const Select = styled.select`
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.control};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 16px; /* ≥16px 避免 iOS 聚焦自動放大 */
  min-height: 48px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

const Range = styled.input`
  width: 100%;
  height: 32px;
  accent-color: ${({ theme }) => theme.colors.accent};
`

const Row = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

export function SettingsPanel() {
  const [settings, setSettings] = useAtom(settingsAtom)
  const store = useAtomValue(storeAtom)
  const restartSession = useSetAtom(restartSessionAtom)
  const setPanel = useSetAtom(panelAtom)
  const exportProgress = useExportProgress()
  const importProgress = useImportProgress()
  const resetProgress = useResetProgress()
  const fileInput = useRef<HTMLInputElement>(null)

  function applyAndRestart() {
    restartSession(store)
    setPanel(null)
  }

  return (
    <Panel>
      <h2>設定</h2>
      <Field>
        題型
        <Select
          value={settings.mode}
          onChange={(e) => setSettings({ mode: e.target.value as StudyMode })}
        >
          <option value="both">兩者皆練（看中文＋填空）</option>
          <option value="reco">只看中文 → 假名／漢字</option>
          <option value="cloze">只填空例句</option>
        </Select>
      </Field>
      <Field>
        練習分類
        <Select value={settings.category} onChange={(e) => setSettings({ category: e.target.value })}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </Field>
      <Field>
        每日新卡上限：<b>{settings.newPerDay}</b>
        <Range
          type="range"
          min={5}
          max={50}
          step={5}
          value={settings.newPerDay}
          onChange={(e) => setSettings({ newPerDay: Number(e.target.value) })}
        />
      </Field>
      <Button intent="primary" block onClick={applyAndRestart}>
        套用並重新開始
      </Button>
      <hr />
      <Row>
        <Button intent="secondary" style={{ flex: 1 }} onClick={exportProgress}>
          匯出進度
        </Button>
        <Button intent="secondary" style={{ flex: 1 }} onClick={() => fileInput.current?.click()}>
          匯入進度
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => e.target.files?.[0] && importProgress(e.target.files[0])}
        />
      </Row>
      <Button intent="danger" block onClick={resetProgress}>
        清空所有進度
      </Button>
      <PanelHint>
        填空題只對「有例句的動詞」出題（共 202 句）。進度存這台瀏覽器，換裝置請用匯出／匯入。
      </PanelHint>
    </Panel>
  )
}
