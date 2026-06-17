import styled from 'styled-components'

// 仿 Dcard 的圖示按鈕：44px 點擊區、可 hover 裝置才有底色、active 微縮放。
// aria-pressed=true 時以主色表示啟用中（例如開啟中的面板）。
export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding: 8px;
  border: none;
  background: none;
  border-radius: ${({ theme }) => theme.radius.control};
  color: ${({ theme }) => theme.colors.iconBtn};
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.05s ease,
    color 0.15s ease;

  svg {
    width: 24px;
    height: 24px;
    display: block;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ theme }) => theme.colors.iconBtnHoverBg};
    }
  }

  &:active {
    transform: scale(0.92);
  }

  &[aria-pressed='true'] {
    color: ${({ theme }) => theme.colors.accent};
  }
`
