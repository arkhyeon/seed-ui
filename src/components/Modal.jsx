import React, { Fragment, useCallback, useLayoutEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { GrClose } from 'react-icons/all';
import { BlackButton, WhiteButton } from './Button/Button';

/**
 *
 * @param {String} props.width
 * 모달의 너비
 * @param {Component} props.children
 * 모달 내에 들어갈 컴포넌트
 * @param {Boolean} props.modalState
 * 모달 On, Off 여부
 * 상위 컴포넌트에서 useState 값 내려 받음
 * default 값은 false
 * @param {Function} props.handleClose
 * 모달을 닫는(상태를 변경 하는) 함수
 * 상위 컴포넌트에서 상태변경 기능이 포함된 함수를 내려 받음
 * default 값은 null
 * @param {String} props.modalTitle
 * 모달의 제목
 * default 값은 'undefined'로 ""로 표시됨.
 * @param {Boolean} props.isCloseBtn
 * 모달창 오른쪽 상단에 닫기 버튼 존재 여부
 * default 값은 true
 * @param {Boolean} props.resizable
 * 모달창 크기 조절 가능 여부
 * default 값은 false
 * @param {Boolean} props.movable
 * 모달창 상단을 드래그 하여 이동 가능한 지 여부
 * default 값은 true
 * @param {Component[]} props.buttonList
 * 모달창 하단에 표시될 버튼 목록
 * default 값은 [
 * <Button size="small" color="blue" onClick={callback}> 확인 </Button>,
   <Button size="small" onClick={handleClose}>닫기</Button>
   ]
 * @param {Function} props.callback
 * 모달창 확인 버튼을 눌렀을 시, 실행되는 함수
 * default 값은 null
 * @returns {JSX.Element} Button Component
 */
function Modal({
  width = `600px`,
  children,
  modalState = false,
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
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const centerWidth = window.innerWidth / 2 - modalRef.current.offsetWidth / 2;
    const centerHeight = window.innerHeight / 2 - modalRef.current.offsetHeight / 2;
    setPos({ x: centerWidth, y: centerHeight });
    document.querySelector('body').style.overflow = 'hidden';
    return () => {
      document.querySelector('body').style.overflow = '';
    };
  }, []);

  // (window.innerHeight - modalDialog[modalDialog.length - 1].offsetHeight) / 2 - 28;
  const handleMove = useCallback(
    e => {
      let posX = e.clientX - initialPos.current.x;
      let posY = e.clientY - initialPos.current.y;

      if (posX < 0) {
        posX = 1;
      }

      if (posX + modalRef.current.offsetWidth > window.innerWidth) {
        posX = window.innerWidth - modalRef.current.offsetWidth - 1;
      }

      if (posY < 0) {
        posY = 1;
      }

      if (posY + modalRef.current.offsetHeight > window.innerHeight) {
        posY = window.innerHeight - modalRef.current.offsetHeight - 1;
      }

      setPos({ x: posX, y: posY });
    },
    [modalRef, initialPos, setPos],
  );

  const removeEvents = useCallback(() => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', removeEvents);
  }, [handleMove]);

  const handleDown = useCallback(
    e => {
      if (!movable) {
        return;
      }
      const { left, top } = modalRef.current.getBoundingClientRect();
      initialPos.current.x = e.clientX - left;
      initialPos.current.y = e.clientY - top;
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', removeEvents);
    },
    [modalRef, initialPos, handleMove, removeEvents],
  );

  return (
    modalState && (
      <>
        <ModalBack onClick={handleClose} />
        <ModalWrap ref={modalRef} style={{ left: `${pos.x}px`, top: `${pos.y}px` }} width={width}>
          <ModalHeader ref={headRef} onMouseDown={handleDown} movable={movable}>
            {modalTitle || null}
            {isCloseBtn ? <GrClose onClick={handleClose} /> : null}
          </ModalHeader>
          <ChildrenWrapper> {children}</ChildrenWrapper>
          <ModalFooter>
            {buttonList.map(el => {
              return <Fragment key={el.props.children}>{el}</Fragment>;
            })}
          </ModalFooter>
        </ModalWrap>
      </>
    )
  );
}

const ModalWrap = styled.div`
  width: ${({ width }) => width};
  position: absolute;
  z-index: 999;
  background: white;
  overflow: hidden;
  border: ${({ theme }) => theme.modalStyle.modalBorder};
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
  padding: 15.5px 18px;
  font-weight: bold;

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
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 14px 18px;
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
  z-index: 999;
  opacity: 0.3;
`;

export default Modal;
