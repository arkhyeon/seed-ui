import styled from '@emotion/styled';
import FloatingBubble from './FloatingBubble';

/**
 * HelpIcon — ? / ! 동그란 아이콘.
 *  - message 있으면 마우스 올릴 때 말풍선(FloatingBubble, 화면 밖이면 자동 flip)
 *  - onClick 있으면 button으로 렌더 (보통 GuideTour 열기)
 *
 * props
 *  - message : 말풍선 내용 (없으면 말풍선 없음)
 *  - size    : 아이콘 크기(px)
 *  - symbol  : 아이콘 글자 (기본 '!', 사용법 안내용은 '?')
 *  - onClick : 클릭 시 실행. 있으면 button으로 렌더
 */
function HelpIcon({ message = '', size = 20, symbol = '!', onClick }) {
  const icon = onClick ? (
    <IconBtn
      type="button"
      $size={size}
      onClick={onClick}
      aria-label={typeof message === 'string' && message ? message : '도움말'}
    >
      {symbol}
    </IconBtn>
  ) : (
    <IconSpan $size={size}>{symbol}</IconSpan>
  );

  if (!message) return icon;

  return (
    <FloatingBubble
      content={message}
      placement="right"
      color="var(--seed-help-popup)"
      textColor="#fff"
    >
      {icon}
    </FloatingBubble>
  );
}

const iconCss = $size => `
  width: ${$size}px;
  height: ${$size}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1.5px solid var(--seed-help-border);
  color: var(--x-6c757d);
  font-size: ${$size * 0.65}px;
  font-weight: 700;
  line-height: 1;
  background-color: transparent;
  transition: background-color 0.2s;
  cursor: pointer;
  margin-left: 5px;
  vertical-align: middle;
  &:hover {
    background-color: var(--x-f8f9fa);
  }
`;

const IconSpan = styled.span`
  ${({ $size }) => iconCss($size)}
`;

const IconBtn = styled.button`
  padding: 0;
  font: inherit;
  ${({ $size }) => iconCss($size)}
`;

export default HelpIcon;
