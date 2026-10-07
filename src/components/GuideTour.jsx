import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { BlackButton, WhiteButton } from './Button/Button';

/**
 * GuideTour
 * 화면을 어둡게 덮고 설명할 요소만 밝게 뚫어서(스포트라이트) 단계별로 사용법을 안내하는 투어.
 *
 * props
 *  - open    : 표시 여부 (boolean)
 *  - steps   : [{ target, title, content, onEnter, onLeave }]
 *              ※ 렌더마다 새 배열을 넘기면 단계가 다시 진입하므로 useMemo 또는 모듈 상수로 고정
 *      target  : () => Element | DOMRect | null
 *                단계가 열릴 때·스크롤·리사이즈 때마다 호출 → 늦게 그려지는 요소도 OK
 *                null이면 강조 없이 화면 가운데에 설명만 표시
 *      title   : 단계 제목
 *      content : 설명 (ReactNode, 그림·코드 등 자유)
 *      onEnter : 단계 진입 시 실행 (예: 모달 숨기기, 탭 전환)
 *      onLeave : 단계 이탈 시 실행 (onEnter 원복)
 *  - onClose : 닫기(×·Esc) / 완료 시 콜백
 *
 * target 지정 방법
 *  1) ref          : target: () => inputRef.current
 *  2) id           : target: () => document.getElementById('save-btn')
 *  3) 범위 안 선택자 : target: () => wrapRef.current?.querySelector('.ag-header-cell[col-id="name"]')
 *                    (ref·id를 못 다는 라이브러리 내부 요소: ag-grid 헤더, Modal 버튼 등)
 *  4) 대체 대상     : target: () => wrap.querySelector('.a') ?? wrap.querySelector('.b')
 *  5) 좌표(DOMRect) : target: () => ({ top, left, width, height })
 *                    (DOM이 없는 캔버스 요소: GoJS 노드, chart 영역 등을 직접 계산)
 *  6) 없음          : target: () => null  → 가운데 설명창 (예시 그림을 content에 넣어 안내)
 *
 * 키보드
 *  - Esc            : 닫기 (EscStack·Modal보다 먼저 받음 → 투어만 닫힘)
 *  - → / Enter / ← : 다음 / 다음 / 이전 (Modal의 Enter→확인으로 새지 않음)
 *  - Tab            : 설명창 버튼 안에서만 순환
 */

const Z = 100000; // ToastNotify(99999)보다 위
const PAD = 6; // 스포트라이트 여백
const GAP = 12; // 스포트라이트와 설명창 사이 간격
const POP_WIDTH = 320;
const MARGIN = 12; // 화면 가장자리 여백

const resolveTarget = step => step?.target?.() ?? null;

const toRect = target => {
  if (!target) return null;
  const r =
    typeof target.getBoundingClientRect === 'function' ? target.getBoundingClientRect() : target;
  if (!r || !(r.width > 0 || r.height > 0)) return null;
  return {
    top: r.top - PAD,
    left: r.left - PAD,
    width: r.width + PAD * 2,
    height: r.height + PAD * 2,
  };
};

const sameRect = (a, b) =>
  a === b ||
  (!!a &&
    !!b &&
    Math.abs(a.top - b.top) < 0.5 &&
    Math.abs(a.left - b.left) < 0.5 &&
    Math.abs(a.width - b.width) < 0.5 &&
    Math.abs(a.height - b.height) < 0.5);

// 아래 우선 → 공간 없으면 위 → 그래도 없으면 화면 안으로 끌어옴
const placePopover = (rect, popHeight) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (!rect) return { top: (vh - popHeight) / 2, left: (vw - POP_WIDTH) / 2 };

  let top = rect.top + rect.height + GAP;
  if (top + popHeight > vh - MARGIN) top = rect.top - GAP - popHeight;
  if (top < MARGIN) top = Math.min(vh - popHeight - MARGIN, Math.max(MARGIN, top));
  const left = Math.min(vw - POP_WIDTH - MARGIN, Math.max(MARGIN, rect.left));
  return { top, left };
};

function GuideTour({ open, steps = [], onClose }) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const [popPos, setPopPos] = useState({ top: -9999, left: -9999 });
  const popRef = useRef(null);
  const step = steps[index];
  const isLast = index === steps.length - 1;

  // 열릴 때마다 처음부터
  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  // 단계 진입/이탈 훅
  useLayoutEffect(() => {
    if (!open || !step) return undefined;
    step.onEnter?.();
    return () => step.onLeave?.();
  }, [open, step]);

  // 대상 위치 추적: 단계 변경·리사이즈·스크롤·대상 크기 변화 때만 다시 계산
  useEffect(() => {
    if (!open || !step) return undefined;

    const measure = () => {
      const next = toRect(resolveTarget(step));
      setRect(prev => (sameRect(prev, next) ? prev : next));
    };

    const el = resolveTarget(step);
    const isElement = el && typeof el.getBoundingClientRect === 'function';
    // 화면 밖이면 보이게 스크롤
    if (isElement) el.scrollIntoView({ block: 'nearest', inline: 'nearest' });

    // 바로 한 번 + onEnter에서 바뀐 레이아웃이 반영된 다음 프레임에 한 번 더
    measure();
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    if (isElement) ro.observe(el);
    ro.observe(document.documentElement);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [open, step]);

  useLayoutEffect(() => {
    if (!open || !popRef.current) return;
    setPopPos(placePopover(rect, popRef.current.offsetHeight));
  }, [open, rect, index]);

  // 단계마다 주 버튼(다음/완료)에 포커스
  useEffect(() => {
    if (!open) return;
    popRef.current?.querySelector('[data-guide-primary]')?.focus();
  }, [open, index]);

  const next = useCallback(() => (isLast ? onClose?.() : setIndex(i => i + 1)), [isLast, onClose]);
  const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), []);

  // window 캡처 단계 = document 캡처(EscStack)·Modal 리스너보다 먼저 받음
  useEffect(() => {
    if (!open) return undefined;
    const onKey = e => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          e.stopImmediatePropagation();
          onClose?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          e.stopPropagation();
          next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          e.stopPropagation();
          prev();
          break;
        case 'Enter':
          // 버튼 기본 클릭까지 막아야 두 번 넘어가지 않음 + Modal의 Enter→확인으로 새지 않게
          e.preventDefault();
          e.stopPropagation();
          next();
          break;
        case 'Tab': {
          // 설명창 안 버튼끼리만 순환
          const focusables = [...(popRef.current?.querySelectorAll('button') ?? [])];
          if (focusables.length === 0) return;
          e.preventDefault();
          e.stopPropagation();
          const cur = focusables.indexOf(document.activeElement);
          const dir = e.shiftKey ? -1 : 1;
          focusables[(cur + dir + focusables.length) % focusables.length].focus();
          break;
        }
        default:
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, next, prev, onClose]);

  if (!open || !step) return null;

  return createPortal(
    <>
      {/* 투어 중 뒤 화면 클릭 차단 */}
      <Blocker />
      {rect ? (
        <Spotlight
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
        />
      ) : (
        <Dim />
      )}
      <Popover
        ref={popRef}
        style={{ top: popPos.top, left: popPos.left }}
        role="dialog"
        aria-modal="true"
        aria-label={step.title}
      >
        <PopHeader>
          <span>
            {index + 1} / {steps.length}
          </span>
          <CloseButton type="button" onClick={onClose} aria-label="안내 닫기">
            ×
          </CloseButton>
        </PopHeader>
        {step.title && <PopTitle>{step.title}</PopTitle>}
        <PopBody>{step.content}</PopBody>
        <PopFooter>
          <Dots>
            {steps.map((s, i) => (
              <Dot key={s.title ?? i} $active={i === index} />
            ))}
          </Dots>
          <div>
            {index > 0 && <WhiteButton onClick={prev}>이전</WhiteButton>}
            <BlackButton data-guide-primary onClick={next}>
              {isLast ? '완료' : '다음'}
            </BlackButton>
          </div>
        </PopFooter>
      </Popover>
    </>,
    document.body,
  );
}

const Blocker = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${Z};
`;

const Dim = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${Z + 1};
  background: rgba(0, 0, 0, 0.55);
  pointer-events: none;
`;

// 큰 그림자로 나머지 화면을 어둡게 → 가운데만 뚫린 효과
const Spotlight = styled.div`
  position: fixed;
  z-index: ${Z + 1};
  border-radius: 8px;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9), 0 0 0 9999px rgba(0, 0, 0, 0.55);
  pointer-events: none;
  transition: top 0.25s ease, left 0.25s ease, width 0.25s ease, height 0.25s ease;
`;

const Popover = styled.div`
  position: fixed;
  z-index: ${Z + 2};
  width: ${POP_WIDTH}px;
  box-sizing: border-box;
  padding: 14px 16px 12px;
  border-radius: 10px;
  background-color: var(--seed-surface, #fff);
  color: var(--x-333);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
`;

const PopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: var(--x-999);
`;

const CloseButton = styled.button`
  border: none;
  background: none;
  padding: 0 2px;
  font-size: 18px;
  line-height: 1;
  color: var(--x-999);
  cursor: pointer;

  &:hover {
    color: var(--x-333);
  }
`;

const PopTitle = styled.div`
  margin-top: 4px;
  font-size: 14px;
  font-weight: 700;
`;

const PopBody = styled.div`
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--x-555);

  & code {
    padding: 0 4px;
    border-radius: 3px;
    background-color: var(--x-eee);
    font-family: inherit;
    color: var(--x-333);
  }
`;

const PopFooter = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > div:last-of-type {
    display: flex;
    gap: 6px;
  }
`;

const Dots = styled.div`
  display: flex;
  gap: 4px;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ $active }) => ($active ? 'var(--x-333)' : 'var(--x-ccc)')};
`;

export default GuideTour;
