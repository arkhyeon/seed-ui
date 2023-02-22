import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

/**
 * @param itemList
 * 순서 변경할 아이템 리스트 state
 * @param setItemList
 * 순서 변경할 아이템 리스트 setState
 * @param seq
 * 순번
 * @param children
 * 드래그 컴포넌트 내부에 작성할 컴포넌트 Children
 * @param isDrag default = true
 * 드래그 가능 여부
 * @returns {JSX.Element}
 * @constructor
 */
function DNDWrapper({ itemList, setItemList, seq, children, isDrag = true }) {
  const onDragStart = e => {
    e.currentTarget.classList.add('grabbing');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget);
    // const img = new Image();
    // img.src = '';
    // e.dataTransfer.setDragImage(img, 0, 0);
  };

  const onDragOver = e => {
    e.preventDefault();
  };

  const onDragEnd = e => {
    e.currentTarget.classList.remove('grabbing');
    e.dataTransfer.dropEffect = 'move';
  };

  const onDragEnter = (e, idx) => {
    const grabPosition = Number(document.querySelector('.grabbing')?.dataset.position);

    if (Number.isNaN(grabPosition)) return;

    const targetPosition = idx;

    const data = [...itemList];
    if (targetPosition < grabPosition) {
      for (let i = targetPosition; i < grabPosition; i++) {
        data[i + 1] = itemList[i];
      }
    }

    if (targetPosition > grabPosition) {
      for (let i = grabPosition; i < targetPosition; i++) {
        data[i] = itemList[i + 1];
      }
    }
    data[targetPosition] = itemList[grabPosition];

    setItemList([...data]);
  };

  return (
    <DndWrapper
      onDragStart={onDragStart}
      onDragEnter={e => onDragEnter(e, seq)}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      draggable
      data-position={seq}
      isDrag={isDrag}
    >
      {children}
    </DndWrapper>
  );
}

const DndWrapper = styled.div`
  ${({ isDrag }) => {
    return isDrag
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
        `;
  }}
`;

export default DNDWrapper;
