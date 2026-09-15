import React, { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

/**
 * @param itemList 순서 변경할 아이템 리스트 state (문자열/객체 무엇이든 가능)
 * @param setItemList 리스트 setState
 * @param seq 순번(인덱스)
 * @param children 드래그 대상 내부 컴포넌트
 * @param isDrag default = true, 드래그 가능 여부
 * @param direction default = 'vertical', 인디케이터/방향 ('vertical' | 'horizontal')
 * @returns {JSX.Element}
 */
// 현재 드래그 중인 항목의 인덱스(동시 드래그는 1개).
// 재정렬은 "놓는 순간(onDrop)"에만 1회 수행한다 — 드래그 중에는 리스트 상태를 바꾸지 않는다.
let dragIndex = null;

function DNDWrapper({
  itemList,
  setItemList,
  seq,
  children,
  isDrag = true,
  direction = 'vertical',
}) {
  // 이 항목 기준으로 드롭 위치를 미리 보여주는 선의 위치: 'before' | 'after' | null
  const [hint, setHint] = useState(null);
  const horizontal = direction === 'horizontal';

  // 커서 위치가 이 항목의 앞쪽인지 뒤쪽인지
  const sideOf = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = horizontal ? e.clientX : e.clientY;
    const mid = horizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
    return pos < mid ? 'before' : 'after';
  };

  const onDragStart = e => {
    dragIndex = seq;
    e.currentTarget.classList.add('grabbing');
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', String(seq));
    } catch {
      /* noop */
    }
  };

  const onDragEnd = e => {
    dragIndex = null;
    setHint(null);
    e.currentTarget.classList.remove('grabbing');
  };

  // drop 허용 + 'move' 커서 유지 + 드롭 위치 인디케이터 갱신
  const onDragOver = e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragIndex === null || dragIndex === seq) {
      if (hint) setHint(null);
      return;
    }
    const side = sideOf(e);
    if (side !== hint) setHint(side); // 위치가 바뀔 때만 리렌더
  };

  const onDragLeave = () => {
    if (hint) setHint(null);
  };

  const onDrop = e => {
    e.preventDefault();
    setHint(null);
    if (dragIndex === null || dragIndex === seq) return;

    // 인디케이터와 동일하게 앞/뒤 삽입 위치를 계산
    let target = sideOf(e) === 'before' ? seq : seq + 1;
    const data = [...itemList];
    const [moved] = data.splice(dragIndex, 1);
    if (dragIndex < target) target -= 1; // 제거로 인한 인덱스 보정
    data.splice(target, 0, moved);
    dragIndex = null;
    setItemList(data);
  };

  return (
    <DndWrapper
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      draggable={isDrag}
      data-position={seq}
      isDrag={isDrag}
      direction={direction}
      hint={hint}
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
          /* 드래그 중인 항목: 반투명 + 점선 테두리로 "떠 있는" 상태 표시 */
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

  /* 드롭 위치 미리보기: 삽입될 경계에 점선 슬롯 표시.
     레이아웃을 밀지 않도록(스크롤/오실레이션 방지) 절대배치 오버레이로만 그린다. */
  ${({ hint, direction }) => {
    if (!hint) return '';
    const vertical = direction !== 'horizontal';
    // 항목 사이 gap(6px) 중앙에 오도록 경계 바깥쪽으로 살짝 배치
    const bar = vertical
      ? `left: 0; right: 0; height: 4px;`
      : `top: 0; bottom: 0; width: 4px;`;
    const place =
      // eslint-disable-next-line no-nested-ternary
      hint === 'before'
        ? vertical
          ? `top: -5px;`
          : `left: -5px;`
        : vertical
        ? `bottom: -5px;`
        : `right: -5px;`;

    return css`
      &::after {
        content: '';
        position: absolute;
        ${bar}
        ${place}
        border: 1px dashed var(--seed-primary);
        background: rgba(251, 91, 91, 0.35);
        border-radius: 3px;
        z-index: 5;
        pointer-events: none;
      }
    `;
  }}
`;

export default DNDWrapper;
