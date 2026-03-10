import React, { Fragment, useCallback, useLayoutEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { GrClose } from 'react-icons/gr';
import { createPortal } from 'react-dom';
import { BlackButton, WhiteButton } from './Button/Button';
import { useThrottle } from '../assets/CustomHook';

function Modal({
  width = `600px`,
  children,
  handleClose = null,
  modalTitle = undefined,
  isCloseBtn = true,
  movable = true,
  callback = null,
  buttonList = [
    <WhiteButton onClick={handleClose}>닫기</WhiteButton>,
    <BlackButton onClick={callback}>확인</BlackButton>,
  ],
}) {
  const modalRef = useRef(null);
  const headRef = useRef(null);
  const initialPos = useRef({ x: 0, y: 0 });
  const isCentered = useRef(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const moveToCenter = () => {
    const centerWidth = window.innerWidth / 2 - modalRef.current.offsetWidth / 2;
    const centerHeight = window.innerHeight / 2 - modalRef.current.offsetHeight / 2;
    setPos({ x: centerWidth, y: centerHeight < 0 ? 0 : centerHeight });
  };

  const handleCenter = useCallback(() => {
    const { offsetWidth, offsetHeight } = modalRef.current;
    const isWidthExceeding = offsetWidth > window.innerWidth;
    const isHeightExceeding = offsetHeight > window.innerHeight;

    const newPosition = { ...pos };

    if (isWidthExceeding) {
      newPosition.x = 0;
    } else if (pos.x + offsetWidth > window.innerWidth) {
      newPosition.x = window.innerWidth - offsetWidth;
    }
    if (isHeightExceeding) {
      newPosition.y = 0;
    } else if (pos.y + offsetHeight > window.innerHeight) {
      newPosition.y = window.innerHeight - offsetHeight;
    }
    setPos(newPosition);
  }, [pos]);

  const handleMove = useCallback(
    e => {
      const { clientX, clientY } = e;
      const { offsetWidth, offsetHeight } = modalRef.current;
      const { innerWidth, innerHeight } = window;
      const { scrollWidth, scrollHeight } = document.documentElement;

      let posX = clientX - initialPos.current.x;
      let posY = clientY - initialPos.current.y;

      if (offsetWidth > innerWidth || offsetHeight > innerHeight) {
        if (posX + offsetWidth > scrollWidth) {
          posX = scrollWidth - offsetWidth - 1;
        }
        if (posY + offsetHeight > scrollHeight) {
          posY = scrollHeight - offsetHeight - 1;
        }
        return setPos({ x: posX < 0 ? 0 : posX, y: posY < 0 ? 0 : posY });
      }

      if (posX < 0) posX = 1;
      if (posX + modalRef.current.offsetWidth > scrollWidth) {
        posX = scrollWidth - modalRef.current.offsetWidth - 1;
      }
      if (posY < 0) posY = 1;
      if (posY + modalRef.current.offsetHeight > scrollHeight) {
        posY = scrollHeight - modalRef.current.offsetHeight - 1;
      }

      setPos({ x: posX, y: posY });
    },
    [modalRef, initialPos, setPos],
  );

  const throttleMove = useThrottle(handleMove, 10);

  const removeEvents = useCallback(
    e => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      document.removeEventListener('mousemove', throttleMove);
      document.removeEventListener('mouseup', removeEvents);

      const posX = clientX - initialPos.current.x;
      const posY = clientY - initialPos.current.y;

      if (posX + 50 >= innerWidth) {
        setPos(prevState => ({ x: 1, y: prevState.y }));
        return;
      }
      if (posY + 50 >= innerHeight) {
        setPos(prevState => ({ x: prevState.x, y: 1 }));
      }
    },
    [throttleMove, initialPos],
  );

  const handleDown = useCallback(
    e => {
      if (!movable) return;
      isCentered.current = true;
      const { left, top } = modalRef.current.getBoundingClientRect();
      const setInitialPosition = (clientX, clientY) => {
        initialPos.current.x = clientX - left;
        initialPos.current.y = clientY - top;
      };
      setInitialPosition(e.clientX, e.clientY);
      document.addEventListener('mousemove', throttleMove);
      document.addEventListener('mouseup', removeEvents);
    },
    [modalRef, initialPos, removeEvents, movable, throttleMove],
  );

  useLayoutEffect(() => {
    if (!modalRef.current) return;
    moveToCenter();

    const observer = new ResizeObserver(() => {
      if (!isCentered.current) {
        moveToCenter();
      }
    });
    observer.observe(modalRef.current);

    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    window.addEventListener('resize', handleCenter);
    return () => {
      window.removeEventListener('resize', handleCenter);
    };
  }, [handleCenter]);

  return (
    <>
      {createPortal(
        <>
          <ModalBack onClick={handleClose} className="modal-back" />
          <ModalWrap
            ref={modalRef}
            style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
            width={width}
            className="modal-wrap"
          >
            <ModalHeader ref={headRef} onMouseDown={handleDown} movable={movable}>
              {modalTitle || null}
              {isCloseBtn ? <GrClose onClick={handleClose} /> : null}
            </ModalHeader>
            <ChildrenWrapper
              onMouseDown={e => {
                if (e.target.tagName === 'TEXTAREA') {
                  isCentered.current = true;
                }
              }}
            >
              {children}
            </ChildrenWrapper>
            <ModalFooter>
              {buttonList.map(el => {
                return <Fragment key={el.props.children}>{el}</Fragment>;
              })}
            </ModalFooter>
          </ModalWrap>
        </>,
        document.body,
      )}
    </>
  );
}

const ModalWrap = styled.div`
  width: ${({ width }) => width};
  max-height: 100%;
  position: fixed;
  z-index: 9999;
  background: white;
  border: ${({ theme }) => theme.modalStyle?.modalBorder || 'none'};
  border-radius: 12px;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);

  -ms-user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px 18px;
  font-weight: bold;
  border-radius: 12px 12px 0 0;

  & svg {
    font-size: 18px;
    cursor: pointer;
  }
  ${({ theme }) => {
    return css`
      background: ${theme.modalStyle.headBg};
      color: ${theme.modalStyle.headFc};
      border-bottom: ${theme.modalStyle.headBorder};
    `;
  }}

  cursor: ${({ movable }) => {
    if (movable) {
      return 'move';
    }
    return 'normal';
  }};
`;

const ChildrenWrapper = styled.div`
  padding: 16px 18px;
  &:has(ul[style='display: block;']) {
    overflow: inherit;
  }
  &:has(textarea, .cm-theme) {
    overflow: auto;
  }

  &:has(textarea, .cm-theme):has(input + ul) .cm-theme,
  &:has(textarea, .cm-theme):has(input + ul) textarea {
    resize: none !important;
  }

  max-height: 85vh;
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 11px 18px;
  gap: 15px;
  border-top: ${({ theme }) => theme.modalStyle.headBorder};
`;

const ModalBack = styled.div`
  width: 100%;
  height: 100%;
  background-color: black;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 9999;
  opacity: 0.3;
`;

export default Modal;
