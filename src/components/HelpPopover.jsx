import React from 'react';
import Popover from './Popover/Popover';
import HelpIcon from './HelpIcon';

/**
 * HelpPopover — ? 아이콘을 누르면 도움말 창(Popover)이 열림.
 *
 * 언제 뭘 쓰나:
 *  - 짧은 한 줄 힌트 → HelpIcon (message, 마우스 올리면 뜸)
 *  - 길거나 서식(목록·여러 줄·강조)이 있는 도움말 → HelpPopover (눌러서 창으로)
 *
 * Popover를 그대로 재사용하므로 바깥클릭·Esc·위치 로직이 중복되지 않는다.
 *
 * props
 *  - title     : 창 안 상단 제목 (선택)
 *  - children  : 도움말 본문 (ReactNode 또는 ({ close }) => ReactNode)
 *  - symbol    : 아이콘 글자 (기본 '?')
 *  - size      : 아이콘 크기(px)
 *  - placement : 창 위치 ('bottom-start' 등, Popover와 동일)
 *  - width     : 창 너비
 *  - 그 외 Popover props(keepOpen, open, onOpenChange ...)는 그대로 전달
 */
function HelpPopover({
  title,
  children,
  symbol = '?',
  size = 18,
  placement = 'bottom-start',
  width,
  ...popoverProps
}) {
  return (
    <Popover
      title={title}
      placement={placement}
      width={width}
      renderTrigger={({ toggle }) => <HelpIcon symbol={symbol} size={size} onClick={toggle} />}
      {...popoverProps}
    >
      {children}
    </Popover>
  );
}

export default HelpPopover;
