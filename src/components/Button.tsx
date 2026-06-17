import type { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

// 仿 Dcard 設計系統的 Button：
// - 尺寸 normal(44px/10px) / small(32px/8px)，字重 500
// - intent solid 變體：primary / secondary / danger / warning
// - 互動態：active 縮放 0.97 + 內陰影；hover 僅在可 hover 裝置生效
type Intent = 'primary' | 'secondary' | 'danger' | 'warning'
type Size = 'normal' | 'small'

const intentStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.onAccent};

    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled):not(:active) {
        background: ${({ theme }) => theme.colors.accentHover};
      }
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.btnSecondary};
    color: ${({ theme }) => theme.colors.text};

    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled):not(:active) {
        background: ${({ theme }) => theme.colors.btnSecondaryHover};
      }
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.dangerText};

    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled):not(:active) {
        background: ${({ theme }) => theme.colors.dangerHover};
      }
    }
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.warning};
    color: ${({ theme }) => theme.colors.onAccent};

    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled):not(:active) {
        background: ${({ theme }) => theme.colors.warningHover};
      }
    }
  `,
} as const

const sizeStyles = {
  normal: css`
    height: 44px;
    border-radius: ${({ theme }) => theme.radius.button};
    padding: 0 16px;
    font-size: 16px;
  `,
  small: css`
    height: 32px;
    border-radius: ${({ theme }) => theme.radius.control};
    padding: 0 14px;
    font-size: 14px;
  `,
} as const

const StyledButton = styled.button<{ $intent: Intent; $size: Size; $block: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  font-family: inherit;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  width: ${({ $block }) => ($block ? '100%' : 'auto')};
  transition:
    background-color 0.15s ease,
    transform 0.05s ease;

  ${({ $size }) => sizeStyles[$size]}
  ${({ $intent }) => intentStyles[$intent]}

  &:disabled {
    background: ${({ theme }) => theme.colors.btnDisabled};
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
    box-shadow: inset 0 2px 2px 0 rgba(0, 0, 0, 0.3);
  }
`

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: Intent
  size?: Size
  block?: boolean
}

export function Button({ intent = 'primary', size = 'normal', block = false, ...rest }: Props) {
  return <StyledButton $intent={intent} $size={size} $block={block} {...rest} />
}
