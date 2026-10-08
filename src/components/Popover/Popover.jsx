import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import EscStack from '../../common/EscStack';

/**
 * Popover — 버튼을 누르면 버튼 옆에 작은 창을 띄움 (바깥 클릭·Esc로 닫힘)
 * 사용법·props: 플레이그라운드 /playground/Popover
 */
function Popover({
  trigger,
  renderTrigger,
  title,
  children,
  placement = 'bottom-start',
  width,
  keepOpen = false,
  open: openProp,
  onOpenChange,
  triggerTitle,
}) {
  const [openState, setOpenState] = useState(false);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : openState;
  const wrapRef = useRef(null);

  const setOpen = useCallback(
    next => {
      const value = typeof next === 'function' ? next(open) : next;
      if (!controlled) setOpenState(value);
      onOpenChange?.(value);
    },
    [controlled, open, onOpenChange],
  );
  const toggle = () => setOpen(v => !v);
  const close = useCallback(() => setOpen(false), [setOpen]);

  // 바깥 클릭으로 닫기 (keepOpen이면 유지 — 가이드 투어 등 창 밖 UI를 쓰는 동안)
  useEffect(() => {
    if (!open || keepOpen) return undefined;
    const onDown = e => {
      if (!wrapRef.current?.contains(e.target)) close();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, keepOpen, close]);

  // Esc로 닫기: EscStack에 등록 → 모달 위에서도 가장 나중에 연 것부터 닫힘
  useLayoutEffect(() => {
    if (!open || keepOpen) return undefined;
    EscStack.push(close);
    return () => EscStack.remove(close);
  }, [open, keepOpen, close]);

  return (
    <Wrap ref={wrapRef}>
      {renderTrigger ? (
        renderTrigger({ open, toggle, close })
      ) : (
        <TriggerButton type="button" title={triggerTitle} data-open={open} onClick={toggle}>
          {trigger}
        </TriggerButton>
      )}
      {open && (
        <Panel data-placement={placement} style={width ? { width } : undefined} role="dialog">
          {title && <PopoverTitle>{title}</PopoverTitle>}
          {typeof children === 'function' ? children({ close }) : children}
        </Panel>
      )}
    </Wrap>
  );
}

// ─── 공통 모양 (MenuButton · 직접 만든 창 안 내용에도 사용) ───

// 창 안 작은 제목 (h6 — 사용처 다크모드 전역 글자색 규칙(div/span 등)에 덮이지 않게)
export const PopoverTitle = styled.h6`
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 400;
  color: var(--x-888) !important;
`;

// 고르는 항목 한 줄 (마우스를 올리면 옅은 배경)
export const PopoverItem = styled.button`
  display: block;
  width: 100%;
  padding: 7px 10px;
  border: none;
  border-radius: 5px;
  background: none;
  color: var(--seed-text);
  font: inherit;
  font-size: 13px;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: var(--x-f0f0f0);
    outline: none;
  }
`;

const Wrap = styled.div`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
`;

// 기본 버튼: TextInput과 같은 높이·테두리 (아이콘 + 글자)
const TriggerButton = styled.button`
  height: 32px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  border: 1px solid var(--seed-border);
  border-radius: 5px;
  background: var(--seed-surface);
  color: var(--seed-text);
  font: inherit;
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;

  & > svg {
    width: 14px;
    height: 14px;
  }

  &:hover,
  &[data-open='true'] {
    border-color: var(--seed-text);
  }
`;

const Panel = styled.div`
  position: absolute;
  z-index: 10;
  min-width: 160px;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid var(--seed-border);
  border-radius: 8px;
  background: var(--seed-surface);
  color: var(--seed-text);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);

  &[data-placement^='bottom'] {
    top: calc(100% + 6px);
  }
  &[data-placement^='top'] {
    bottom: calc(100% + 6px);
  }
  &[data-placement$='start'] {
    left: 0;
  }
  &[data-placement$='end'] {
    right: 0;
  }
`;

export default Popover;
