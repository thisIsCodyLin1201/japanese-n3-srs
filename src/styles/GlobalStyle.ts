import { createGlobalStyle } from 'styled-components'

// 全域重置與 body 樣式，等同原本 styles.css 的 :root / * / html / body 區塊。
// 顏色改由 theme 提供；safe-area 仍用 CSS env() 變數（iOS 瀏海／底部）。
export const GlobalStyle = createGlobalStyle`
  :root {
    --safe-top: env(safe-area-inset-top, 0px);
    --safe-bottom: env(safe-area-inset-bottom, 0px);
    color-scheme: dark;
  }

  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent; /* iOS 點按不要灰底 */
  }

  html {
    -webkit-text-size-adjust: 100%; /* iOS 橫置不放大字 */
  }

  html,
  body,
  #root {
    height: 100%;
    margin: 0;
  }

  body {
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'PingFang TC',
      'Noto Sans TC', 'Microsoft JhengHei', sans-serif;
    overscroll-behavior: none; /* 關閉 iOS 整頁彈跳 */
    -webkit-user-select: none;
    user-select: none;
  }
`
