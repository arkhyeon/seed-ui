import { useState, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { useFloating, offset, flip, shift, arrow, autoUpdate } from '@floating-ui/react-dom';
import { FLOATING_PROP } from '../common/floating';

/**
 * FloatingBubble — 마우스 올리면(또는 포커스) 트리거 옆에 뜨는 말풍선(화살표 포함).
 *
 * Tooltip·HelpIcon 공통 기반. Floating UI로 body에 포털 → overflow에 안 잘리고,
 * 공간 없으면 flip(반대쪽)·shift(안으로)로 자동 보정, 화살표도 따라 움직인다.
 *
 * props
 *  - children   : 트리거(마우스 올릴 대상)
 *  - content    : 말풍선 내용 (없으면 안 뜸)
 *  - placement  : 'top'|'right'|'bottom'|'left'(+'-start'|'-end'), 기본 'top'
 *  - color      : 말풍선 배경 (기본 어두운 버블)
 *  - textColor  : 말풍선 글자색
 *  - maxWidth   : 최대 너비 px (기본 250)
 *  - gap        : 트리거와 간격 px (기본 8)
 *  - display    : 트리거 래퍼 display (기본 'inline-flex')
 *  - open/onOpenChange : 외부 제어(선택)
 */
const SIDE = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

function FloatingBubble({
  children,
  content,
  placement = 'top',
  color = 'var(--seed-invert-bg)',
  textColor = 'var(--seed-invert-text)',
  maxWidth = 250,
  gap = 8,
  display = 'inline-flex',
  open: openProp,
  onOpenChange,
}) {
  const [openState, setOpenState] = useState(false);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : openState;
  const setOpen = v => {
    if (!controlled) setOpenState(v);
    onOpenChange?.(v);
  };

  const arrowRef = useRef(null);
  const bubbleId = useId();
  const {
    refs,
    floatingStyles,
    middlewareData,
    placement: finalPlacement,
  } = useFloating({
    open,
    placement,
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(gap),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      arrow({ element: arrowRef, padding: 6 }),
    ],
  });

  const side = finalPlacement.split('-')[0];
  const { x: ax, y: ay } = middlewareData.arrow ?? {};
  const arrowStyle = {
    left: ax != null ? `${ax}px` : '',
    top: ay != null ? `${ay}px` : '',
    [SIDE[side]]: '-4px', // 반대편 가장자리에 붙임
    background: color,
  };

  const show = !!content && open;

  return (
    <Wrapper
      ref={refs.setReference}
      style={{ display }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-describedby={show ? bubbleId : undefined}
    >
      {children}
      {show &&
        createPortal(
          <Bubble
            id={bubbleId}
            ref={refs.setFloating}
            {...FLOATING_PROP}
            role="tooltip"
            style={{ ...floatingStyles, maxWidth, background: color, color: textColor }}
          >
            {content}
            <Arrow ref={arrowRef} style={arrowStyle} />
          </Bubble>,
          document.body,
        )}
    </Wrapper>
  );
}

const Wrapper = styled.span`
  align-items: center;
`;

const Bubble = styled.div`
  z-index: 10000;
  width: max-content;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-line; /* content 안의 \\n 을 줄바꿈으로 */
  overflow-wrap: anywhere;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  pointer-events: none;
`;

const Arrow = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
`;

export default FloatingBubble;
