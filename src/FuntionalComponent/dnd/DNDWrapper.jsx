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
          &.grabbing {
            opacity: 0.3;
          }
        `
      : css`
          -webkit-user-drag: none;
          cursor: default;
        `}

  /* 드롭 위치 인디케이터: 항목의 앞/뒤 경계에 빨간 선 */
  ${({ hint, direction }) => {
    if (!hint) return '';
    const vertical = direction !== 'horizontal';
    const line = vertical ? 'left: 0; right: 0; height: 3px;' : 'top: 0; bottom: 0; width: 3px;';
    const place =
      // eslint-disable-next-line no-nested-ternary
      hint === 'before'
        ? vertical
          ? 'top: -3px;'
          : 'left: -3px;'
        : vertical
        ? 'bottom: -3px;'
        : 'right: -3px;';
    return css`
      &::after {
        content: '';
        position: absolute;
        background: #fb5b5b;
        border-radius: 2px;
        z-index: 5;
        ${line}
        ${place}
      }
    `;
  }}
`;

export default DNDWrapper;
