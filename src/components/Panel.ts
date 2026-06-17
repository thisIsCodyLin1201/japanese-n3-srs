import styled from 'styled-components'

// 設定 / 統計共用的卡片式面板容器（等同原本 .panel）。
export const Panel = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.panel};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  h2 {
    margin: 0;
    font-size: 18px;
  }

  hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.surface2};
    margin: 4px 0;
    width: 100%;
  }
`

export const PanelHint = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`
