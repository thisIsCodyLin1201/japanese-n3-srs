import 'styled-components'

import type { AppTheme } from './theme'

// 讓 styled-components 的 DefaultTheme 取得我們 theme 的型別，
// 元件內 ${({ theme }) => theme.colors.xxx} 才有自動完成與型別檢查。
declare module 'styled-components' {
  // oxlint-disable-next-line no-empty-interface
  export interface DefaultTheme extends AppTheme {}
}
