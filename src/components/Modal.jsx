import React, { Fragment, useCallback, useLayoutEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { GrClose } from 'react-icons/all';
import { BlackButton, WhiteButton } from './Button/Button';
import { useThrottle } from '../assets/CustomHook';

/**
 *
 * @param {String} props.width
 * 모달의 너비
 * default 값은 '600px'
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
 * @param {Component} props.children
 * 모달 내에 들어갈 컴포넌트
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
  const initialPos = useRef({ x: 0, y: 0 }); // 모달 위치 ref
  const [pos, setPos] = useState({ x: 0, y: 0 }); // 모달 상태

  // 랜더링시 브라우저 화면 내(window.innerWidth)에서 중앙 배치하는 함수
  const moveToCenter = () => {
    const centerWidth = window.scrollX + window.innerWidth / 2 - modalRef.current.offsetWidth / 2;

    const centerHeight =
      window.scrollY + window.innerHeight / 2 - modalRef.current.offsetHeight / 2;

    setPos({ x: centerWidth, y: centerHeight < 0 ? 0 : centerHeight });
  };

  // window.innerWidth 또는 window.innerHeight에 값이 달라 졌을때 실행된다.
  //  window.outerWidth나  window.outerHeight가 줄어들때 모달 위치가 -가 되는 것을 방지.
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

  // 모달을 움직이는 경우(드래그) 실행되는 함수.
  const handleMove = useCallback(
    e => {
      const { clientX, clientY } = e;
      const { offsetWidth, offsetHeight } = modalRef.current; // 모달의 너비와 높이
      const { innerWidth, innerHeight } = window; // 창의 너비와 높이
      const { scrollWidth, scrollHeight } = document.documentElement; // 스크롤의 너비와 높이

      let posX = clientX - initialPos.current.x;
      let posY = clientY - initialPos.current.y;

      // 모달의 너비나 높이가 창보다 클경우
      if (offsetWidth > innerWidth || offsetHeight > innerHeight) {
        if (posX + offsetWidth > scrollWidth) {
          posX = scrollWidth - offsetWidth - 1;
        }

        if (posY + offsetHeight > scrollHeight) {
          posY = scrollHeight - offsetHeight - 1;
        }

        return setPos({ x: posX < 0 ? 0 : posX, y: posY < 0 ? 0 : posY });
      }

      // 모달의 가로값이 음수인 경우
      if (posX < 0) {
        posX = 1;
      }

      // 모달이 가로 끝으로 나가지 못하게 함
      if (posX + modalRef.current.offsetWidth > scrollWidth) {
        posX = scrollWidth - modalRef.current.offsetWidth - 1;
      }

      if (posY < 0) {
        posY = 1;
      }

      if (posY + modalRef.current.offsetHeight > scrollHeight) {
        posY = scrollHeight - modalRef.current.offsetHeight - 1;
      }

      setPos({ x: posX, y: posY });
    },
    [modalRef, initialPos, setPos],
  );

  const throttleMove = useThrottle(handleMove, 10);

  // 모달 클릭후 모달에서 마우스를 뗐을때
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

  // 모달 상단 클릭후 드래그하고 뗐을때 수정된 위치 변경 (useRef인 initialPos)
  const handleDown = useCallback(
    e => {
      if (!movable) {
        return;
      }
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

  // 컴포넌트 그리기 전에 이펙트를 수행하는 useLayoutEffect.
  useLayoutEffect(() => {
    moveToCenter();

    const handleResize = entries => {
      if (!modalRef.current) return;
      entries.forEach(entry => {
        console.log(`${entry.contentRect.width}px ; height: ${entry.contentRect.height}px`);
        const centerHeight =
          window.scrollY + window.innerHeight / 2 - modalRef.current.offsetHeight / 2;

        setPos(prevState => ({
          x: prevState.x,
          y: centerHeight < 0 ? 0 : centerHeight,
        }));
      });
    };
    const observer = new ResizeObserver(handleResize);
    observer.observe(modalRef.current);
  }, []);

  useLayoutEffect(() => {
    window.addEventListener('resize', handleCenter);
    return () => {
      window.removeEventListener('resize', handleCenter);
    };
  }, [handleCenter]);

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
  max-height: 100%;
  position: fixed;
  z-index: 999;
  background: white;
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
