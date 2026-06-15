import { useEffect, useRef, useState, type ReactNode } from 'react'
import deckRaw from './deck.json'
import type { Card, CardType, Store } from './types'
import { freshState, intervalLabel, schedule, todayISO, type Grade } from './srs'
import { defaultStore, load, save } from './storage'
import { hasJaVoice, initTTS, speak, ttsSupported } from './tts'

const deck = deckRaw as Card[]
const CATEGORIES = ['全部', '動詞', '形容詞', '副詞', '外來語']
const cardMap = new Map(deck.map((c) => [c.id, c]))

// SRS item id：看中文 = 卡片 id；填空 = 卡片 id + ':cloze'
function clozeId(id: string): string {
  return id + ':cloze'
}
function parseItem(itemId: string): { card: Card; type: CardType } {
  const isCloze = itemId.endsWith(':cloze')
  const cardId = isCloze ? itemId.slice(0, -':cloze'.length) : itemId
  return { card: cardMap.get(cardId)!, type: isCloze ? 'cloze' : 'reco' }
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 依分類 + 模式，列出所有應納入練習的 item id
function itemsForSettings(store: Store): string[] {
  const cat = store.settings.category
  const mode = store.settings.mode
  const pool = deck.filter((c) => cat === '全部' || c.category === cat)
  const ids: string[] = []
  for (const c of pool) {
    if (mode !== 'cloze') ids.push(c.id) // 看中文
    if (mode !== 'reco' && c.cloze) ids.push(clozeId(c.id)) // 填空（僅有 cloze 的卡）
  }
  return ids
}

// 今日佇列：到期複習 item + 當日剩餘額度的新 item，洗牌
function buildQueue(store: Store): string[] {
  const today = todayISO()
  const reviews: string[] = []
  const fresh: string[] = []
  for (const id of itemsForSettings(store)) {
    const st = store.states[id]
    if (st && st.introduced) {
      if (st.due <= today) reviews.push(id)
    } else {
      fresh.push(id)
    }
  }
  const remainingNew = Math.max(0, store.settings.newPerDay - store.daily.newCount)
  return shuffle([...reviews, ...shuffle(fresh).slice(0, remainingNew)])
}

const GRADES: { g: Grade; label: string; cls: string }[] = [
  { g: 'again', label: '忘記', cls: 'again' },
  { g: 'hard', label: '模糊', cls: 'hard' },
  { g: 'good', label: '記得', cls: 'good' },
  { g: 'easy', label: '秒答', cls: 'easy' },
]

const MODE_LABEL: Record<Store['settings']['mode'], string> = {
  reco: '看中文',
  cloze: '填空例句',
  both: '兩者皆練',
}

// 朗讀鈕（阻止冒泡，避免觸發翻面）
function TtsButton({ text }: { text: string }) {
  if (!ttsSupported()) return null
  return (
    <button
      className="tts"
      aria-label="朗讀"
      onClick={(e) => {
        e.stopPropagation()
        speak(text)
      }}
    >
      🔊
    </button>
  )
}

// 例句；cloze 翻面時把答案高亮
function SentenceView({ card, highlight }: { card: Card; highlight: boolean }) {
  if (!card.sentence) return null
  const ja = card.sentence.ja
  let body: ReactNode = ja
  if (highlight && card.cloze) {
    const ans = card.cloze.answer
    const i = ja.indexOf(ans)
    if (i >= 0) {
      body = (
        <>
          {ja.slice(0, i)}
          <mark>{ans}</mark>
          {ja.slice(i + ans.length)}
        </>
      )
    }
  }
  return (
    <div className="sentence">
      <span className="ja">
        {body}
        <TtsButton text={ja} />
      </span>
      {card.sentence.zh && <span className="ja-zh">{card.sentence.zh}</span>}
    </div>
  )
}

export default function App() {
  const [store, setStore] = useState<Store>(() => load())
  const [queue, setQueue] = useState<string[]>([])
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(0)
  const [panel, setPanel] = useState<null | 'settings' | 'stats'>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => initTTS(), [])
  useEffect(() => save(store), [store])
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
    setQueue((q) => {
      const [, ...rest] = q
      return g === 'again' ? [...rest, id] : rest // 忘記 → 本回合稍後再出
    })
    setFlipped(false)
    setDone((d) => d + 1)
  }

  // 鍵盤（桌機）：空白翻面，1~4 評分
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (panel) return
      if (e.code === 'Space') {
        e.preventDefault()
        setFlipped(true)
      } else if (flipped && ['1', '2', '3', '4'].includes(e.key)) {
        grade(GRADES[Number(e.key) - 1].g)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const cur = queue[0] ? parseItem(queue[0]) : null
  const prevState = cur ? store.states[queue[0]] ?? freshState() : null
  const previews = prevState
    ? (Object.fromEntries(
        GRADES.map((b) => [b.g, schedule(prevState, b.g).interval]),
      ) as Record<Grade, number>)
    : null

  // 統計（依目前分類 + 模式）
  const items = itemsForSettings(store)
  const learned = items.filter((id) => store.states[id]?.introduced).length
  const dueCount = items.filter((id) => {
    const st = store.states[id]
    return st?.introduced && st.due <= todayISO()
  }).length

  function setSetting<K extends keyof Store['settings']>(k: K, v: Store['settings'][K]) {
    setStore((s) => ({ ...s, settings: { ...s.settings, [k]: v } }))
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
          <button aria-label="統計" onClick={() => setPanel(panel === 'stats' ? null : 'stats')}>
            📊
          </button>
          <button aria-label="設定" onClick={() => setPanel(panel === 'settings' ? null : 'settings')}>
            ⚙️
          </button>
        </div>
      </header>

      <div className="statbar">
        <span>{store.settings.category}</span>
        <span>{MODE_LABEL[store.settings.mode]}</span>
        <span>
          新卡 {store.daily.newCount}/{store.settings.newPerDay}
        </span>
        <span>待複習 {dueCount}</span>
        <span>剩 {queue.length}</span>
      </div>

      <div className="content">
        {panel === 'settings' && (
          <section className="panel">
            <h2>設定</h2>
            <label>
              題型
              <select
                value={store.settings.mode}
                onChange={(e) => setSetting('mode', e.target.value as Store['settings']['mode'])}
              >
                <option value="both">兩者皆練（看中文＋填空）</option>
                <option value="reco">只看中文 → 假名／漢字</option>
                <option value="cloze">只填空例句</option>
              </select>
            </label>
            <label>
              練習分類
              <select
                value={store.settings.category}
                onChange={(e) => setSetting('category', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
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
            <button
              className="primary big"
              onClick={() => {
                restartSession()
                setPanel(null)
              }}
            >
              套用並重新開始
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
            <p className="hint">填空題只對「有例句的動詞」出題（共 202 句）。進度存這台瀏覽器，換裝置請用匯出／匯入。</p>
          </section>
        )}

        {panel === 'stats' && (
          <section className="panel">
            <h2>統計</h2>
            <p>
              範圍：{store.settings.category}．{MODE_LABEL[store.settings.mode]}
            </p>
            <p>題目總數：{items.length}</p>
            <p>已學過：{learned}</p>
            <p>今天待複習：{dueCount}</p>
            <div className="bar">
              <div
                className="bar-fill"
                style={{ width: `${items.length ? (learned / items.length) * 100 : 0}%` }}
              />
            </div>
            <p className="hint">整副字庫 {deck.length} 字，其中 202 個動詞可出填空題。</p>
          </section>
        )}

        {!panel &&
          (!cur ? (
            <div className="done">
              <div className="done-emoji">🎉</div>
              <p>本回合完成！今天已複習 {done} 題。</p>
              <p className="hint">
                {dueCount === 0 && store.daily.newCount >= store.settings.newPerDay
                  ? '今日新卡也學完了，明天再來吧～'
                  : '可在設定調高每日新卡上限，或明天再來。'}
              </p>
              <button className="primary big" onClick={() => restartSession()}>
                重新整理佇列
              </button>
            </div>
          ) : (
            <div
              className={`card ${cur.type}`}
              onClick={() => !flipped && setFlipped(true)}
              role="button"
            >
              <div className="card-tag">
                <span className={`type-badge ${cur.type}`}>
                  {cur.type === 'cloze' ? '填空' : '看中文'}
                </span>
                {cur.card.category}
                {cur.card.pos ? ` · ${cur.card.pos}` : ''}
                {!prevState?.introduced && <span className="new-badge">NEW</span>}
              </div>

              {!flipped ? (
                cur.type === 'cloze' ? (
                  <div className="front">
                    <div className="cloze-sentence">{cur.card.cloze!.text}</div>
                    <div className="cloze-hint">
                      動詞．意思：<b>{cur.card.zh}</b>
                    </div>
                    <div className="hint">想想空格的動詞，點一下看答案</div>
                  </div>
                ) : (
                  <div className="front">
                    <div className="zh-big">{cur.card.zh}</div>
                    <div className="hint">想假名／漢字，點一下看答案</div>
                  </div>
                )
              ) : (
                <div className="back">
                  <div className="reading">
                    {cur.card.kanji && <span className="kanji">{cur.card.kanji}</span>}
                    {cur.card.kana && <span className="kana">{cur.card.kana}</span>}
                    <TtsButton text={cur.card.kanji ?? cur.card.kana ?? ''} />
                  </div>
                  <div className="zh-small">{cur.card.zh}</div>
                  <SentenceView card={cur.card} highlight={cur.type === 'cloze'} />
                </div>
              )}
            </div>
          ))}
      </div>

      {!panel && cur && (
        <div className="bottombar">
          {!flipped ? (
            <button className="show-btn" onClick={() => setFlipped(true)}>
              顯示答案
            </button>
          ) : (
            <div className="grades">
              {GRADES.map((b, i) => (
                <button key={b.g} className={`grade ${b.cls}`} onClick={() => grade(b.g)}>
                  <span className="g-label">{b.label}</span>
                  <span className="g-interval">{intervalLabel(previews![b.g])}</span>
                  <span className="g-key">{i + 1}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {panel && (
        <div className="bottombar">
          <button className="show-btn ghost" onClick={() => setPanel(null)}>
            返回練習
          </button>
        </div>
      )}

      <footer>
        {!ttsSupported()
          ? '此瀏覽器不支援語音朗讀'
          : hasJaVoice()
            ? '🔊 日文朗讀可用'
            : '🔇 未偵測到日文語音，朗讀用預設語音'}
      </footer>
    </div>
  )
}
