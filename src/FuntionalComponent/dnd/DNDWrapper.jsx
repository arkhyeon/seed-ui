import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

/**
 * @param itemList 순서 변경할 아이템 리스트 state (문자열/객체 무엇이든 가능)
 * @param setItemList 리스트 setState
 * @param seq 순번(인덱스)
 * @param children 드래그 대상 내부 컴포넌트
 * @param isDrag default = true, 드래그 가능 여부
 * @param dropPadding default = 24, 목록 영역 바깥 몇 px까지 드롭을 받을지
 * @returns {JSX.Element}
 */
// 현재 드래그 상태(동시 드래그는 1개).
// 들어갈 자리는 "커서 좌표 ↔ 드래그 시작 시점의 칸 위치"로만 계산한다.
// 미리보기로 항목이 움직여도 판정 기준(칸)은 그대로라 경계에서 왔다갔다 하지 않고,
// 항목 사이 틈·줄 바깥도 가장 가까운 칸으로 처리된다.
// 재정렬(setItemList)은 "놓는 순간(drop)"에만 1회 수행한다 — 드래그 중에는 리스트 상태를 바꾸지 않는다.
let drag = null;
const listeners = new Set();
const subscribe = l => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => drag;
const setDrag = next => {
  drag = next;
  listeners.forEach(l => l());
};

// 마운트된 항목들 (드래그 시작 시 같은 목록의 칸 위치를 재기 위함)
const registry = new Set();

// from 항목을 over 자리로 옮겼을 때 seq 항목이 보이는 위치
const displayIndex = (seq, from, over) => {
  if (seq === from) return over;
  if (from < over && seq > from && seq <= over) return seq - 1;
  if (over < from && seq >= over && seq < from) return seq + 1;
  return seq;
};

// 페이지 기준 좌표 (드래그 중 스크롤돼도 어긋나지 않게)
const pageRect = el => {
  const r = el.getBoundingClientRect();
  return {
    left: r.left + window.scrollX,
    top: r.top + window.scrollY,
    right: r.right + window.scrollX,
    bottom: r.bottom + window.scrollY,
  };
};

const commonAncestor = els => {
  let a = els[0].parentElement;
  while (a && !els.every(el => a.contains(el))) a = a.parentElement;
  return a || document.body;
};

// 칸들을 줄로 묶는다. row: 가로로 흐르다 아래로 감김 / column: 세로로 흐르다 옆으로 감김
const buildLayout = rects => {
  const row =
    rects.length > 1 &&
    Math.abs(rects[1].top - rects[0].top) < (rects[0].bottom - rects[0].top) / 2;
  const lines = [];
  rects.forEach((r, i) => {
    const prev = rects[i - 1];
    const wrapped = !prev || (row ? r.left < prev.left : r.top < prev.top);
    const c0 = row ? r.top : r.left;
    const c1 = row ? r.bottom : r.right;
    if (wrapped) lines.push({ start: i, end: i, c0, c1 });
    else {
      const line = lines[lines.length - 1];
      line.end = i;
      line.c0 = Math.min(line.c0, c0);
      line.c1 = Math.max(line.c1, c1);
    }
  });
  return { row, lines };
};

// 커서 위치 → 들어갈 인덱스
// - 줄 안: 가장 가까운 칸 / 줄 앞·뒤 바깥: 그 줄의 처음·마지막
// - 모든 줄보다 앞(위/왼쪽): 0, 모든 줄보다 뒤(아래/오른쪽): 마지막
const targetOf = (x, y) => {
  const { rects, row, lines } = drag;
  const c = row ? y : x;
  const m = row ? x : y;
  if (c < lines[0].c0) return 0;
  if (c > lines[lines.length - 1].c1) return rects.length - 1;
  const dist = l => Math.max(l.c0 - c, c - l.c1, 0);
  const line = lines.reduce((best, l) => (dist(l) < dist(best) ? l : best));
  let k = line.start;
  let min = Infinity;
  for (let i = line.start; i <= line.end; i += 1) {
    const r = rects[i];
    const center = row ? (r.left + r.right) / 2 : (r.top + r.bottom) / 2;
    if (Math.abs(m - center) < min) {
      min = Math.abs(m - center);
      k = i;
    }
  }
  return k;
};

const pointOf = e => {
  const x = e.clientX + window.scrollX;
  const y = e.clientY + window.scrollY;
  const { zone } = drag;
  const inside = x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom;
  return { x, y, inside };
};

// 목록 영역(+dropPadding) 안이면 어디서든 드롭 허용 — 항목 위가 아니어도 됨
const onWindowDragOver = e => {
  if (!drag) return;
  const { x, y, inside } = pointOf(e);
  // 영역 밖: 원래 순서로 되돌려 보여주고 드롭 불가
  const over = inside ? targetOf(x, y) : drag.from;
  if (inside) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }
  if (over !== drag.over) setDrag({ ...drag, over });
};

const onWindowDrop = e => {
  if (!drag) return;
  const { x, y, inside } = pointOf(e);
  if (!inside) return;
  e.preventDefault();
  const { list, from, setItemList } = drag;
  const over = targetOf(x, y);
  setDrag(null);
  if (from === over) return;
  const data = [...list];
  const [moved] = data.splice(from, 1);
  data.splice(over, 0, moved);
  setItemList(data);
};

function DNDWrapper({
  itemList,
  setItemList,
  seq,
  children,
  isDrag = true,
  dropPadding = 24,
}) {
  const ref = useRef(null);
  const entry = useRef({ ref });
  entry.current.list = itemList;
  entry.current.seq = seq;

  useEffect(() => {
    const e = entry.current;
    registry.add(e);
    return () => registry.delete(e);
  }, []);

  const state = useSyncExternalStore(subscribe, getSnapshot);
  const active = state && state.list === itemList;

  const onDragStart = e => {
    const els = [];
    registry.forEach(en => {
      if (en.list === itemList && en.ref.current) els[en.seq] = en.ref.current;
    });
    const rects = els.map(pageRect);
    const box = pageRect(commonAncestor(els.filter(Boolean)));
    // 목록 컨테이너와 칸들을 모두 덮는 영역 + 여유
    const zone = {
      left: Math.min(box.left, ...rects.map(r => r.left)) - dropPadding,
      top: Math.min(box.top, ...rects.map(r => r.top)) - dropPadding,
      right: Math.max(box.right, ...rects.map(r => r.right)) + dropPadding,
      bottom: Math.max(box.bottom, ...rects.map(r => r.bottom)) + dropPadding,
    };
    setDrag({
      list: itemList,
      setItemList,
      from: seq,
      over: seq,
      rects,
      zone,
      ...buildLayout(rects),
    });
    window.addEventListener('dragover', onWindowDragOver);
    window.addEventListener('drop', onWindowDrop);
    e.currentTarget.classList.add('grabbing');
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', String(seq));
    } catch {
      /* noop */
    }
  };

  // 드롭 성공/실패 모두 여기서 정리. 놓지 않고 끝남(영역 밖, ESC) → 원래 순서로 복귀
  const onDragEnd = e => {
    window.removeEventListener('dragover', onWindowDragOver);
    window.removeEventListener('drop', onWindowDrop);
    e.currentTarget.classList.remove('grabbing');
    if (drag) setDrag(null);
  };

  // 미리보기 위치로 이동할 거리 (원래 칸 → 보이는 칸)
  let style;
  if (active) {
    const { rects, from, over } = state;
    const to = rects[displayIndex(seq, from, over)];
    const at = rects[seq];
    const dx = to && at ? to.left - at.left : 0;
    const dy = to && at ? to.top - at.top : 0;
    style = {
      transform: dx || dy ? `translate(${dx}px, ${dy}px)` : undefined,
      transition: 'transform 150ms ease',
    };
  }

  return (
    <DndWrapper
      ref={ref}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      draggable={isDrag}
      data-position={seq}
      isDrag={isDrag}
      style={style}
    >
      {children}
    </DndWrapper>
  );
}

const DndWrapper = styled.div`
  position: relative;

  ${({ isDrag }) =>
    isDrag
      ? css`
          user-select: none;
          cursor: move;
          /* 드래그 중인 항목: 반투명 + 점선 테두리로 들어갈 자리를 표시 */
          &.grabbing {
            opacity: 0.35;
            outline: 2px dashed var(--seed-primary);
            outline-offset: -2px;
            border-radius: 8px;
          }
        `
      : css`
          -webkit-user-drag: none;
          cursor: default;
        `}
`;

export default DNDWrapper;
