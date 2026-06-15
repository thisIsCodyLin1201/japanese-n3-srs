// 把 data/n3_vocabulary.md 解析成 src/deck.json
// 處理 4 種表格格式：
//   動詞(五段/一段)  假名 | 漢字 | 中文 | 例句
//   複合動詞          動詞 | 中文 | 例句          (無獨立假名欄)
//   形容詞            假名 | 漢字 | 中文
//   副詞 / 外來語     詞   | 中文
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const md = readFileSync(join(root, 'data', 'n3_vocabulary.md'), 'utf8')

const HEADER_TOKENS = new Set(['假名', '漢字', '中文', '例句', '副詞', '外來語', '動詞'])
const NONE = new Set(['', '－', 'ー', '-', '—'])

// "試合に勝った。（贏得比賽。）" -> { ja, zh }
function splitSentence(raw) {
  if (!raw) return null
  const m = raw.match(/^(.*?)（(.*)）\s*$/)
  if (m) return { ja: m[1].trim(), zh: m[2].trim() }
  return { ja: raw.trim(), zh: '' }
}

function cells(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())
}

const cards = []
let category = '' // 大類：動詞 / 形容詞 / 副詞 / 外來語
let pos = '' // 細分詞性，例：イ形容詞、第一類動詞、複合類動詞
let id = 0

for (const line of md.split('\n')) {
  const h2 = line.match(/^##\s+[一二三四五六七八九十、]+\s*(.+?)\s*$/)
  if (h2) {
    category = h2[1].replace(/[（(].*$/, '').trim()
    pos = ''
    continue
  }
  const h3 = line.match(/^###\s+(.+?)\s*$/)
  if (h3) {
    pos = h3[1].replace(/^[（(][一二三四五六七八九十][)）]\s*/, '').trim()
    continue
  }
  if (!line.trim().startsWith('|')) continue
  if (line.includes('---')) continue // 分隔線
  const c = cells(line)
  if (c.every((x) => HEADER_TOKENS.has(x))) continue // 表頭

  let kana = null
  let kanji = null
  let zh = null
  let sentence = null

  if (category === '動詞') {
    if (c.length >= 4) {
      // 五段 / 一段：假名 | 漢字 | 中文 | 例句
      kana = c[0]
      kanji = NONE.has(c[1]) ? null : c[1]
      zh = c[2]
      sentence = splitSentence(c[3])
    } else if (c.length === 3) {
      // 複合類：動詞(漢字+假名混合) | 中文 | 例句，無獨立讀音
      kanji = c[0]
      zh = c[1]
      sentence = splitSentence(c[2])
    } else continue
  } else if (category === '形容詞') {
    // 假名 | 漢字 | 中文
    if (c.length < 3) continue
    kana = c[0]
    kanji = NONE.has(c[1]) ? null : c[1]
    zh = c[2]
  } else {
    // 副詞 / 外來語：詞 | 中文
    if (c.length < 2) continue
    kana = c[0]
    zh = c[1]
  }

  if (!zh) continue
  const front = kanji || kana
  if (!front) continue

  cards.push({
    id: `c${++id}`,
    category, // 動詞 / 形容詞 / 副詞 / 外來語
    pos, // 細分
    kana, // 假名讀音（複合動詞為 null）
    kanji, // 漢字（無則 null）
    zh, // 中文意思
    sentence, // { ja, zh } 或 null
  })
}

const byCat = cards.reduce((acc, c) => ((acc[c.category] = (acc[c.category] || 0) + 1), acc), {})
const withSentence = cards.filter((c) => c.sentence).length

writeFileSync(join(root, 'src', 'deck.json'), JSON.stringify(cards, null, 0) + '\n')
console.log(`✅ 產生 ${cards.length} 張卡片 -> src/deck.json`)
console.log(`   分類：`, byCat)
console.log(`   含例句：${withSentence}`)
