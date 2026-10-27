import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  isValidElement,
  cloneElement,
  Fragment,
} from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import EscStack from '../../common/EscStack';
import useSeedFloating from '../../common/useSeedFloating';
import { FLOATING_PROP, clickedInsideFloating } from '../../common/floating';

// 팝오버 겉틀(surface) — Popover의 Panel 전용 내부 스타일(비공개).
// 과거엔 export해 외부(CLM)에서 직접 썼으나, 그런 곳들이 전부 Popover 컴포넌트로 바뀌어 비공개화.
const popoverSurface = css`
  box-sizing: border-box;
  border: 1px solid var(--seed-border);
  border-radius: 8px;
  background: var(--seed-surface);
  color: var(--seed-text);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
`;

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
  hideWhenDetached = false,
  open: openProp,
  onOpenChange,
  triggerTitle,
}) {
  const [openState, setOpenState] = useState(false);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : openState;

  // Floating UI: 트리거(reference)·떠있는 패널(floating) 위치 계산 + flip/shift/size + autoUpdate
  const { refs, floatingStyles, middlewareData } = useSeedFloating(open, {
    placement,
    gap: 6,
    hideWhenDetached,
  });
  // 스크롤 컨테이너 밖으로 잘렸거나(hide) 다른 요소에 덮였으면(occlusion) 숨김
  const detached =
    hideWhenDetached &&
    (middlewareData.hide?.referenceHidden || middlewareData.occlusion?.occluded);

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

  // trigger 가 "클릭을 받을 수 있는 요소"(HelpIcon·버튼 등)면 그대로 쓰고 onClick만 자동 연결.
  // 문자열·숫자·Fragment면 기존 기본 네모 버튼(TriggerButton)으로 감싼다.
  const triggerIsElement = isValidElement(trigger) && trigger.type !== Fragment;
  const renderTriggerNode = () => {
    if (renderTrigger) return renderTrigger({ open, toggle, close });
    if (triggerIsElement) {
      return cloneElement(trigger, {
        'data-open': open,
        onClick: e => {
          trigger.props.onClick?.(e);
          toggle();
        },
      });
    }
    return (
      <TriggerButton type="button" title={triggerTitle} data-open={open} onClick={toggle}>
        {trigger}
      </TriggerButton>
    );
  };

  // 바깥 클릭으로 닫기 (keepOpen이면 유지 — 가이드 투어 등 창 밖 UI를 쓰는 동안)
  // 패널이 body로 포털되므로 트리거(reference)·패널(floating) 둘 다 안쪽이면 유지.
  useEffect(() => {
    if (!open || keepOpen) return undefined;
    const onDown = e => {
      const r = refs.reference.current;
      const f = refs.floating.current;
      // 자기 트리거/패널 안이거나, (중첩) 다른 떠있는 요소 안이면 유지
      if (r?.contains?.(e.target) || f?.contains(e.target) || clickedInsideFloating(e.target))
        return;
      close();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, keepOpen, close, refs]);

  // Esc로 닫기: EscStack에 등록 → 모달 위에서도 가장 나중에 연 것부터 닫힘
  useLayoutEffect(() => {
    if (!open || keepOpen) return undefined;
    EscStack.push(close);
    return () => EscStack.remove(close);
  }, [open, keepOpen, close]);

  return (
    <Wrap ref={refs.setReference}>
      {renderTriggerNode()}
      {open &&
        createPortal(
          <Panel
            ref={refs.setFloating}
            {...FLOATING_PROP}
            style={{
              ...floatingStyles,
              ...(width ? { width } : null),
              ...(detached ? { visibility: 'hidden', pointerEvents: 'none' } : null),
            }}
            role="dialog"
          >
            {title && <PopoverTitle>{title}</PopoverTitle>}
            {typeof children === 'function' ? children({ close }) : children}
          </Panel>,
          document.body,
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

// 위치(top/left/position)는 Floating UI의 floatingStyles(인라인)가 지정한다.
// body로 포털되므로 z-index는 Modal(9999) 위. 패널 안 HelpIcon 말풍선(10000)은 더 위로 뜸.
const Panel = styled.div`
  z-index: 10000;
  min-width: 160px;
  max-width: calc(100vw - 16px);
  padding: 12px;
  overflow-y: auto; /* size 미들웨어가 공간에 맞춰 max-height 걸면 내부 스크롤 */
  ${popoverSurface}
`;

export default Popover;
