import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'styled-components'

import { AppShell } from '~/components/AppShell'
import { GlobalStyle } from '~/styles/GlobalStyle'
import { theme } from '~/styles/theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppShell />
    </ThemeProvider>
  </StrictMode>,
)
