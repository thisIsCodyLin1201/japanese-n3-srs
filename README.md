# N3 單字 SRS — 間隔重複記憶

JLPT N3 日語單字的間隔重複（Spaced Repetition, SM-2）記憶卡片，純前端、可部署到 GitHub Pages。

- 正面看中文 → 翻面看假名／漢字／例句
- SM-2 演算法排程複習（忘記／模糊／記得／秒答）
- 進度存瀏覽器 localStorage（支援匯出／匯入 JSON 搬移）
- 例句用瀏覽器內建語音朗讀（Web Speech API，免 API key）
- 可依詞性過濾（動詞／形容詞／副詞／外來語）

單字庫來源：《一考就上！新日檢 N3 全科總整理》，共約 559 字（動詞含例句）。

## 本機開發

```bash
npm install
npm run dev      # http://localhost:5173
```

`npm run dev` / `npm run build` 前會自動執行 `scripts/build-deck.mjs`，
把 `data/n3_vocabulary.md` 解析成 `src/deck.json`。要更新字庫就改 markdown 再重跑。

## 部署到 GitHub Pages

已內建 `.github/workflows/deploy.yml`：push 到 `main` 會自動 build 並部署。

1. 在**個人** GitHub 建一個 public repo 並 push。
2. repo → **Settings → Pages → Build and deployment → Source** 選 **GitHub Actions**。
3. 等 Actions 跑完，網址為 `https://<帳號>.github.io/<repo>/`。

> `vite.config.ts` 用 `base: './'`（相對路徑），所以不論 repo 叫什麼都能直接跑。

## 鍵盤操作

- `空白鍵`：翻面
- `1` `2` `3` `4`：忘記／模糊／記得／秒答

## 限制

- 進度綁單一瀏覽器，換裝置請用設定裡的「匯出／匯入」。
- 日文朗讀語音是否可用視裝置而定（iOS 可能需系統語音）；無語音時不影響主功能。
