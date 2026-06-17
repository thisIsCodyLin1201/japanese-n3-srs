import styled from 'styled-components'

const Bar = styled.footer`
  flex: 0 0 auto;
  text-align: center;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
  padding-top: 8px;
`

interface Props {
  supported: boolean
  hasJaVoice: boolean
}

export function Footer({ supported, hasJaVoice }: Props) {
  return (
    <Bar>
      {!supported
        ? '此瀏覽器不支援語音朗讀'
        : hasJaVoice
          ? '日文朗讀已就緒'
          : '未偵測到日文語音，將以預設語音朗讀'}
    </Bar>
  )
}
