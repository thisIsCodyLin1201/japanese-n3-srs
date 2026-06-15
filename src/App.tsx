import { useEffect, useMemo, useRef, useState } from 'react'
import deckRaw from './deck.json'
import type { Card, Store } from './types'
import { freshState, intervalLabel, schedule, todayISO, type Grade } from './srs'
import { defaultStore, load, save } from './storage'
import { hasJaVoice, initTTS, speak, ttsSupported } from './tts'

const deck = deckRaw as Card[]
const CATEGORIES = ['全部', '動詞', '形容詞', '副詞', '外來語']

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 建立今日佇列：到期複習卡 + 當日剩餘額度的新卡，洗牌
function buildQueue(store: Store): string[] {
  const today = todayISO()
  const cat = store.settings.category
  const pool = deck.filter((c) => cat === '全部' || c.category === cat)
  const reviews: string[] = []
  const fresh: string[] = []
  for (const c of pool) {
    const st = store.states[c.id]
    if (st && st.introduced) {
      if (st.due <= today) reviews.push(c.id)
    } else {
      fresh.push(c.id)
    }
  }
  const remainingNew = Math.max(0, store.settings.newPerDay - store.daily.newCount)
  const newSlice = shuffle(fresh).slice(0, remainingNew)
  return shuffle([...reviews, ...newSlice])
}

const GRADES: { g: Grade; label: string; cls: string }[] = [
  { g: 'again', label: '忘記', cls: 'again' },
  { g: 'hard', label: '模糊', cls: 'hard' },
  { g: 'good', label: '記得', cls: 'good' },
  { g: 'easy', label: '秒答', cls: 'easy' },
]

export default function App() {
  const [store, setStore] = useState<Store>(() => load())
  const [queue, setQueue] = useState<string[]>([])
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(0)
  const [panel, setPanel] = useState<null | 'settings' | 'stats'>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const cardMap = useMemo(() => new Map(deck.map((c) => [c.id, c])), [])

  useEffect(() => initTTS(), [])
  useEffect(() => save(store), [store])

  // 首次載入建立佇列
  useEffect(() => {
    setQueue(buildQueue(store))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function restartSession(next = store) {
    setQueue(buildQueue(next))
    setFlipped(false)
    setDone(0)
  }

  function grade(g: Grade) {
    const id = queue[0]
    if (!id) return
    const prev = store.states[id] ?? freshState()
    const wasNew = !prev.introduced
    const nextState = schedule(prev, g)
    setStore((s) => ({
      ...s,
      states: { ...s.states, [id]: nextState },
      daily: wasNew ? { ...s.daily, newCount: s.daily.newCount + 1 } : s.daily,
    }))
    // 「忘記」→ 本回合稍後再出一次
    setQueue((q) => {
      const [, ...rest] = q
      return g === 'again' ? [...rest, id] : rest
    })
    setFlipped(false)
    setDone((d) => d + 1)
  }

  // 鍵盤：空白翻面，1~4 評分
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (panel) return
      if (e.code === 'Space') {
        e.preventDefault()
        if (!flipped) setFlipped(true)
        return
      }
      if (flipped && ['1', '2', '3', '4'].includes(e.key)) {
        grade(GRADES[Number(e.key) - 1].g)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const cur = queue[0] ? cardMap.get(queue[0]) ?? null : null
  const prevState = cur ? store.states[cur.id] ?? freshState() : null
  const previews = prevState
    ? {
        again: schedule(prevState, 'again').interval,
        hard: schedule(prevState, 'hard').interval,
        good: schedule(prevState, 'good').interval,
        easy: schedule(prevState, 'easy').interval,
      }
    : null

  // 統計
  const filtered = deck.filter(
    (c) => store.settings.category === '全部' || c.category === store.settings.category,
  )
  const learned = filtered.filter((c) => store.states[c.id]?.introduced).length
  const dueCount = filtered.filter((c) => {
    const st = store.states[c.id]
    return st?.introduced && st.due <= todayISO()
  }).length

  function setSetting<K extends keyof Store['settings']>(k: K, v: Store['settings'][K]) {
    setStore((s) => {
      const next = { ...s, settings: { ...s.settings, [k]: v } }
      return next
    })
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `n3-srs-backup-${todayISO()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importJSON(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const obj = JSON.parse(String(reader.result)) as Store
        if (!obj.states || !obj.settings) throw new Error('bad')
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

  function resetProgress() {
    if (!confirm('確定清空所有複習進度？此動作無法復原。')) return
    const fresh = defaultStore()
    fresh.settings = store.settings
    setStore(fresh)
    restartSession(fresh)
    setPanel(null)
  }

  return (
    <div className="app">
      <header>
        <h1>N3 單字 SRS</h1>
        <div className="head-actions">
          <button onClick={() => setPanel(panel === 'stats' ? null : 'stats')}>📊</button>
          <button onClick={() => setPanel(panel === 'settings' ? null : 'settings')}>⚙️</button>
        </div>
      </header>

      <div className="statbar">
        <span>分類：{store.settings.category}</span>
        <span>
          今日新卡 {store.daily.newCount}/{store.settings.newPerDay}
        </span>
        <span>待複習 {dueCount}</span>
        <span>本回合剩 {queue.length}</span>
      </div>

      {panel === 'settings' && (
        <section className="panel">
          <h2>設定</h2>
          <label>
            每日新卡上限：<b>{store.settings.newPerDay}</b>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={store.settings.newPerDay}
              onChange={(e) => setSetting('newPerDay', Number(e.target.value))}
            />
          </label>
          <label>
            練習分類：
            <select
              value={store.settings.category}
              onChange={(e) => {
                setSetting('category', e.target.value)
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <button className="primary" onClick={() => { restartSession(); setPanel(null) }}>
            套用並重新開始本回合
          </button>
          <hr />
          <div className="row">
            <button onClick={exportJSON}>⬇️ 匯出進度</button>
            <button onClick={() => fileInput.current?.click()}>⬆️ 匯入進度</button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => e.target.files?.[0] && importJSON(e.target.files[0])}
            />
          </div>
          <button className="danger" onClick={resetProgress}>
            🗑️ 清空所有進度
          </button>
          <p className="hint">
            進度存在這台瀏覽器（localStorage），換裝置請用「匯出／匯入」搬移。
          </p>
        </section>
      )}

      {panel === 'stats' && (
        <section className="panel">
          <h2>統計（{store.settings.category}）</h2>
          <p>單字總數：{filtered.length}</p>
          <p>已學過：{learned}</p>
          <p>今天待複習：{dueCount}</p>
          <p>整副字庫共 {deck.length} 字</p>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${(learned / filtered.length) * 100}%` }} />
          </div>
        </section>
      )}

      {!panel && (
        <main>
          {!cur ? (
            <div className="done">
              <div className="done-emoji">🎉</div>
              <p>本回合完成！今天已複習 {done} 張。</p>
              <p className="hint">
                {dueCount === 0 && store.daily.newCount >= store.settings.newPerDay
                  ? '今日新卡也學完了，明天再來吧～'
                  : '可在設定調高每日新卡上限，或明天再來。'}
              </p>
              <button className="primary" onClick={() => restartSession()}>
                重新整理佇列
              </button>
            </div>
          ) : (
            <>
              <div
                className={`card ${flipped ? 'flipped' : ''}`}
                onClick={() => !flipped && setFlipped(true)}
              >
                <div className="card-tag">
                  {cur.category}
                  {cur.pos ? ` · ${cur.pos}` : ''}
                  {!prevState?.introduced && <span className="new-badge">NEW</span>}
                </div>

                {!flipped ? (
                  <div className="front">
                    <div className="zh-big">{cur.zh}</div>
                    <div className="hint">想一下假名／漢字，點擊或按空白鍵看答案</div>
                  </div>
                ) : (
                  <div className="back">
                    <div className="reading">
                      {cur.kanji && <span className="kanji">{cur.kanji}</span>}
                      {cur.kana && <span className="kana">{cur.kana}</span>}
                      {ttsSupported() && (
                        <button
                          className="tts"
                          title="朗讀"
                          onClick={(e) => {
                            e.stopPropagation()
                            speak(cur.kanji ?? cur.kana ?? '')
                          }}
                        >
                          🔊
                        </button>
                      )}
                    </div>
                    <div className="zh-small">{cur.zh}</div>
                    {cur.sentence && (
                      <div className="sentence">
                        <span className="ja">
                          {cur.sentence.ja}
                          {ttsSupported() && (
                            <button
                              className="tts"
                              title="朗讀例句"
                              onClick={(e) => {
                                e.stopPropagation()
                                speak(cur.sentence!.ja)
                              }}
                            >
                              🔊
                            </button>
                          )}
                        </span>
                        {cur.sentence.zh && <span className="ja-zh">{cur.sentence.zh}</span>}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!flipped ? (
                <button className="show-btn" onClick={() => setFlipped(true)}>
                  顯示答案（空白鍵）
                </button>
              ) : (
                <div className="grades">
                  {GRADES.map((b, i) => (
                    <button key={b.g} className={`grade ${b.cls}`} onClick={() => grade(b.g)}>
                      <span className="g-label">
                        {i + 1}. {b.label}
                      </span>
                      <span className="g-interval">{intervalLabel(previews![b.g])}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      )}

      <footer>
        {ttsSupported() ? (
          hasJaVoice() ? (
            <span>🔊 日文朗讀可用</span>
          ) : (
            <span>🔇 此裝置未偵測到日文語音，朗讀可能用預設語音</span>
          )
        ) : (
          <span>此瀏覽器不支援語音朗讀</span>
        )}
      </footer>
    </div>
  )
}
