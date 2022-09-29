import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  createElement,
} from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { AiOutlineClose } from 'react-icons/ai';

/**
 *
 * @param {String} props.width
 * 모달의 너비
 * @param {String} props.height
 * 모달의 높이
 * @param {String} props.position
 * 모달의 위치
 * "left-start": 왼쪽 상단
 * "left-center" 왼쪽 중단
 * "left-end": 왼쪽 하단
 * "center-start": 중앙 상단
 * "center": 정중앙 (default)
 * "center-end": 중앙 하단
 * "right-start": 오른쪽 상단
 * "right-center": 오른쪽 중단
 * "right-end": 오른쪽 하단
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
 * @param {Object} props.style
 * 모달창 세부 스타일 지정
 * @param {Component} props.style.closeBtn
 * 모달창 상단의 닫기 버튼에 들어갈 컴포넌트
 * default 값은 react-icons의 <AiOutlineClose />
 * @param {Boolean} props.style.isShadow
 * 모달창의 그림자 여부
 * default 값은 true
 * @returns {JSX.Element} Button Component
 */
function Modal({
  width = `600px`,
  height = '600px',
  position = 'center',
  children,
  modalState = false,
  handleClose = null,
  modalTitle = undefined,
  isCloseBtn = true,
  resizable = true,
  movable = true,
  style = {},
  callback = null,
  buttonList = [
    <button size="small" color="blue" onClick={callback}>
      확인
    </button>,
    <button size="small" onClick={handleClose}>
      닫기
    </button>,
  ],
}) {
  const modalRef = useRef(null);
  const headRef = useRef(null);
  const initialPos = useRef({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const topRef = useRef(null);
  const rightRef = useRef(null);
  const bottomRef = useRef(null);
  const leftRef = useRef(null);
  const leftTopRef = useRef(null);
  const rightTopRef = useRef(null);
  const leftBottomRef = useRef(null);
  const rightBottomRef = useRef(null);
  const directs = useRef(null);
  const { closeBtn = <AiOutlineClose />, isShadow = true } = style;

  const handleModal = useCallback(() => {
    if (!handleClose) {
      return;
    }
    handleClose();
  }, [handleClose]);

  const clickOutSide = () => {
    handleClose();
  };

  useEffect(() => {
    const backgroundDiv = document.createElement('div');
    backgroundDiv.style.background = '#808080';
    backgroundDiv.style.position = 'absolute';
    backgroundDiv.style.width = '100%';
    backgroundDiv.style.height = '100%';
    backgroundDiv.style.top = 0;
    backgroundDiv.style.left = 0;
    backgroundDiv.style.zIndex = 90;
    backgroundDiv.style.opacity = 0.3;
    backgroundDiv.className = 'background';

    backgroundDiv.addEventListener('click', clickOutSide);

    if (modalState) {
      document.body.appendChild(backgroundDiv);
    }

    return () => {
      const backgroundDivs = document.querySelectorAll('.background');
      for (let i = 0; i < backgroundDivs.length; i++) {
        document.body.removeChild(backgroundDivs[i]);
      }
    };
  }, [modalState]);

  useLayoutEffect(() => {
    if (position === 'left-start') {
      setPos({ x: 1, y: 1 });
    }
    if (position === 'left-center') {
      setPos({ x: 1, y: window.innerHeight / 2 - height.slice(0, -2) / 2 });
    }
    if (position === 'left-end') {
      setPos({ x: 1, y: window.innerHeight - height.slice(0, -2) - 5 });
    }
    if (position === 'center-start') {
      setPos({ x: window.innerWidth / 2 - width.slice(0, -2) / 2, y: 1 });
    }
    if (position === 'center') {
      setPos({
        x: window.innerWidth / 2 - width.slice(0, -2) / 2,
        y: window.innerHeight / 2 - height.slice(0, -2) / 2,
      });
    }
    if (position === 'center-end') {
      setPos({
        x: window.innerWidth / 2 - width.slice(0, -2) / 2,
        y: window.innerHeight - height.slice(0, -2) - 5,
      });
    }
    if (position === 'right-start') {
      setPos({ x: window.innerWidth - width.slice(0, -2) - 5, y: 1 });
    }
    if (position === 'right-center') {
      setPos({
        x: window.innerWidth - width.slice(0, -2) - 5,
        y: window.innerHeight / 2 - height.slice(0, -2) / 2,
      });
    }
    if (position === 'right-end') {
      setPos({
        x: window.innerWidth - width.slice(0, -2) - 5,
        y: window.innerHeight - height.slice(0, -2) - 5,
      });
    }
  }, [height, width, position]);

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

      setPos({
        x: posX,
        y: posY,
      });
    },
    [modalRef, initialPos, setPos],
  );

  const removeEvents = useCallback(() => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', removeEvents);
  }, [handleMove]);

  const handleDown = useCallback(
    e => {
      const { left, top } = modalRef.current.getBoundingClientRect();
      initialPos.current.x = e.clientX - left;
      initialPos.current.y = e.clientY - top;
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', removeEvents);
    },
    [modalRef, initialPos, handleMove, removeEvents],
  );

  const handleTopSize = useCallback(
    e => {
      let posX = e.clientX;
      let posY = e.clientY;

      if (posX < 0) {
        posX = 1;
      }

      if (posX > window.innerWidth - 5) {
        posX = window.innerWidth - 5;
      }

      if (posY < 0) {
        posY = 1;
      }

      if (posY > window.innerHeight - 5) {
        posY = window.innerHeight - 5;
      }

      const newHeight = directs.current.bottom - posY;
      if (newHeight < height) {
        return;
      }

      modalRef.current.style.top = `${posY}px`;

      modalRef.current.style.height = newHeight < height ? `${height}px` : `${newHeight}px`;
    },
    [height, directs],
  );

  const handleRightSize = useCallback(
    e => {
      let posX = e.clientX;
      let posY = e.clientY;

      if (posX < 0) {
        posX = 1;
      }

      if (posX > window.innerWidth - 5) {
        posX = window.innerWidth - 5;
      }

      if (posY < 0) {
        posY = 1;
      }

      if (posY > window.innerHeight - 5) {
        posY = window.innerHeight - 5;
      }

      const newWidth = posX - modalRef.current.getBoundingClientRect().left;

      modalRef.current.style.width = newWidth < width ? `${width}px` : `${newWidth}px`;
    },
    [width, modalRef],
  );

  const handleBottomSize = useCallback(
    e => {
      let posX = e.clientX;
      let posY = e.clientY;

      if (posX < 0) {
        posX = 1;
      }

      if (posX > window.innerWidth - 5) {
        posX = window.innerWidth - 5;
      }

      if (posY < 0) {
        posY = 1;
      }

      if (posY > window.innerHeight - 5) {
        posY = window.innerHeight - 5;
      }
      const newHeight = posY - modalRef.current.getBoundingClientRect().top;

      modalRef.current.style.height = newHeight < height ? `${height}px` : `${newHeight}px`;
    },
    [height, modalRef],
  );

  const handleLeftSize = useCallback(
    e => {
      let posX = e.clientX;
      let posY = e.clientY;

      if (posX < 0) {
        posX = 1;
      }

      if (posX > window.innerWidth - 5) {
        posX = window.innerWidth - 5;
      }

      if (posY < 0) {
        posY = 1;
      }

      if (posY > window.innerHeight - 5) {
        posY = window.innerHeight - 5;
      }

      const newWidth = directs.current.right - posX;

      if (newWidth < width) {
        return;
      }
      modalRef.current.style.left = `${posX}px`;

      modalRef.current.style.width = newWidth < width ? `${width}px` : `${newWidth}px`;
    },
    [directs, width],
  );

  const handleLeftTopSize = useCallback(
    e => {
      let posX = e.clientX;
      let posY = e.clientY;

      if (posX < 0) {
        posX = 1;
      }

      if (posX > window.innerWidth - 5) {
        posX = window.innerWidth - 5;
      }

      if (posY < 0) {
        posY = 1;
      }

      if (posY > window.innerHeight - 5) {
        posY = window.innerHeight - 5;
      }

      const newWidth = directs.current.right - posX;

      const newHeight = directs.current.bottom - posY;
      if (newHeight > height) {
        modalRef.current.style.top = `${posY}px`;
      } else if (newHeight <= height) {
        modalRef.current.style.top = `${directs.current.top}px`;
      }
      if (newWidth > width) {
        modalRef.current.style.left = `${posX}px`;
      } else if (newWidth <= width) {
        modalRef.current.style.left = `${directs.current.left}px`;
      }

      modalRef.current.style.height = newHeight < height ? `${height}px` : `${newHeight}px`;

      modalRef.current.style.width = newWidth < width ? `${width}px` : `${newWidth}px`;
    },
    [height, width, directs, modalRef],
  );

  const handleRightTopSize = useCallback(
    e => {
      let posX = e.clientX;
      let posY = e.clientY;

      if (posX < 0) {
        posX = 1;
      }

      if (posX > window.innerWidth - 5) {
        posX = window.innerWidth - 5;
      }

      if (posY < 0) {
        posY = 1;
      }

      if (posY > window.innerHeight - 5) {
        posY = window.innerHeight - 5;
      }

      const newHeight = directs.current.bottom - posY;

      modalRef.current.style.height = newHeight < height ? `${height}px` : `${newHeight}px`;

      const newWidth = posX - modalRef.current.getBoundingClientRect().left;

      modalRef.current.style.width = newWidth < width ? `${width}px` : `${newWidth}px`;

      if (newHeight > height) {
        modalRef.current.style.top = `${posY}px`;
      } else if (newHeight <= height) {
        modalRef.current.style.top = `${directs.current.top}px`;
      }
    },
    [width, height, directs, modalRef],
  );

  const handleLeftBottomSize = useCallback(
    e => {
      let posX = e.clientX;
      let posY = e.clientY;

      if (posX < 0) {
        posX = 1;
      }

      if (posX > window.innerWidth - 5) {
        posX = window.innerWidth - 5;
      }

      if (posY < 0) {
        posY = 1;
      }

      if (posY > window.innerHeight - 5) {
        posY = window.innerHeight - 5;
      }

      const newWidth = directs.current.right - posX;

      const newHeight = posY - modalRef.current.getBoundingClientRect().top;

      modalRef.current.style.height = newHeight < height ? `${height}px` : `${newHeight}px`;

      if (newWidth > width) {
        modalRef.current.style.left = `${posX}px`;
      } else if (newWidth <= width) {
        modalRef.current.style.left = `${directs.current.left}px`;
      }

      modalRef.current.style.width = newWidth < width ? `${width}px` : `${newWidth}px`;
    },
    [directs, modalRef, height, width],
  );

  const handleRightBottomSize = useCallback(
    e => {
      let posX = e.clientX;
      let posY = e.clientY;

      if (posX < 0) {
        posX = 1;
      }

      if (posX > window.innerWidth - 5) {
        posX = window.innerWidth - 5;
      }

      if (posY < 0) {
        posY = 1;
      }

      if (posY > window.innerHeight - 5) {
        posY = window.innerHeight - 5;
      }

      const newWidth = posX - modalRef.current.getBoundingClientRect().left;

      const newHeight = posY - modalRef.current.getBoundingClientRect().top;

      modalRef.current.style.width = newWidth < width ? `${width}px` : `${newWidth}px`;

      modalRef.current.style.height = newHeight < height ? `${height}px` : `${newHeight}px`;
    },
    [width, height, modalRef],
  );

  const removeSizeEvents = useCallback(() => {
    document.removeEventListener('mousemove', handleLeftSize);
    document.removeEventListener('mousemove', handleRightSize);
    document.removeEventListener('mousemove', handleBottomSize);
    document.removeEventListener('mousemove', handleTopSize);
    document.removeEventListener('mousemove', handleLeftTopSize);
    document.removeEventListener('mousemove', handleRightTopSize);
    document.removeEventListener('mousemove', handleLeftBottomSize);
    document.removeEventListener('mousemove', handleRightBottomSize);
    document.removeEventListener('mouseup', removeSizeEvents);
  }, [
    handleLeftSize,
    handleRightSize,
    handleBottomSize,
    handleTopSize,
    handleLeftTopSize,
    handleRightTopSize,
    handleLeftBottomSize,
    handleRightBottomSize,
  ]);

  const startHandleSize = useCallback(
    e => {
      const { left, top, right, bottom } = modalRef.current.getBoundingClientRect();
      directs.current = { top, bottom, left, right };

      const modalPos = e.target.dataset.pos;

      if (modalPos === 'top') {
        document.addEventListener('mousemove', handleTopSize);
      }
      if (modalPos === 'left') {
        document.addEventListener('mousemove', handleLeftSize);
      }
      if (modalPos === 'bottom') {
        document.addEventListener('mousemove', handleBottomSize);
      }
      if (modalPos === 'right') {
        document.addEventListener('mousemove', handleRightSize);
      }
      if (modalPos === 'leftTop') {
        document.addEventListener('mousemove', handleLeftTopSize);
      }
      if (modalPos === 'rightTop') {
        document.addEventListener('mousemove', handleRightTopSize);
      }
      if (modalPos === 'leftBottom') {
        document.addEventListener('mousemove', handleLeftBottomSize);
      }
      if (modalPos === 'rightBottom') {
        document.addEventListener('mousemove', handleRightBottomSize);
      }

      document.addEventListener('mouseup', removeSizeEvents);
    },
    [
      modalRef,
      directs,
      handleTopSize,
      handleLeftSize,
      handleRightSize,
      handleBottomSize,
      handleLeftBottomSize,
      handleLeftTopSize,
      handleRightBottomSize,
      handleRightTopSize,
      removeSizeEvents,
    ],
  );

  useLayoutEffect(() => {
    if (movable) {
      headRef.current?.addEventListener('mousedown', handleDown);
    }

    topRef.current?.addEventListener('mousedown', startHandleSize);
    rightRef.current?.addEventListener('mousedown', startHandleSize);
    leftRef.current?.addEventListener('mousedown', startHandleSize);
    bottomRef.current?.addEventListener('mousedown', startHandleSize);
    leftTopRef.current?.addEventListener('mousedown', startHandleSize);
    rightTopRef.current?.addEventListener('mousedown', startHandleSize);
    leftBottomRef.current?.addEventListener('mousedown', startHandleSize);
    rightBottomRef.current?.addEventListener('mousedown', startHandleSize);

    return () => {
      if (movable) {
        headRef.current?.removeEventListener('mousedown', handleDown);
      }

      topRef.current?.removeEventListener('mousedown', startHandleSize);
      rightRef.current?.removeEventListener('mousedown', startHandleSize);
      leftRef.current?.removeEventListener('mousedown', startHandleSize);
      bottomRef.current?.removeEventListener('mousedown', startHandleSize);
      leftTopRef.current?.removeEventListener('mousedown', startHandleSize);
      rightTopRef.current?.removeEventListener('mousedown', startHandleSize);
      leftBottomRef.current?.removeEventListener('mousedown', startHandleSize);
      rightBottomRef.current?.removeEventListener('mousedown', startHandleSize);
    };
  });

  return modalState ? (
    <>
      <Wrapper
        ref={modalRef}
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
        width={width}
        height={height}
        position={position}
        isShadow={isShadow}
      >
        {resizable ? (
          <>
            <Border pos="top" ref={topRef} data-pos="top" />
            <Border pos="right" ref={rightRef} data-pos="right" />
            <Border pos="bottom" ref={bottomRef} data-pos="bottom" />
            <Border pos="left" ref={leftRef} data-pos="left" />
            <Border pos="leftTop" ref={leftTopRef} data-pos="leftTop" />
            <Border pos="rightTop" ref={rightTopRef} data-pos="rightTop" />
            <Border pos="leftBottom" ref={leftBottomRef} data-pos="leftBottom" />
            <Border pos="rightBottom" ref={rightBottomRef} data-pos="rightBottom" />
          </>
        ) : null}

        <Head ref={headRef} movable={movable}>
          {modalTitle || null}
          {isCloseBtn ? <CloseBtn onClick={handleModal}>{closeBtn}</CloseBtn> : null}
        </Head>
        <ChildrenWrapper height={height}> {children}</ChildrenWrapper>
        <Bottom height={height}>
          {buttonList.map((el, idx) => {
            return (
              <div style={{ display: 'inline-block' }} key={`button-${idx}`}>
                {el}
              </div>
            );
          })}
        </Bottom>
      </Wrapper>
    </>
  ) : null;
}

const Wrapper = styled.div`
  position: absolute;
  z-index: 999;
  background: white;
  overflow: hidden;
  border: ${({ theme }) => theme.modalStyle.modalBorder};

  ${({ width, height }) => {
    return css`
      width: ${width};
      height: ${height};
      min-width: ${width};
      min-height: ${height};
    `;
  }}

  border: ${({ modalBorder }) => {
    return `${modalBorder}`;
  }};

  border-radius: 4px;

  ${({ isShadow }) => {
    if (isShadow) {
      return css`
        -webkit-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
        -moz-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
        box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
        -webkit-background-clip: padding-box;
        -moz-background-clip: padding-box;
        background-clip: padding-box;
      `;
    }
    return css`
      box-shadow: none;
    `;
  }}

  -webkit-touch-callout: none;
  user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
`;

const Head = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  padding-left: 12px;
  font-weight: bolder;
  ${({ theme }) => {
    return css`
      background: ${theme.modalStyle.headBg};
      color: ${theme.modalStyle.headFc};
      border-bottom: ${theme.modalStyle.headBorder};
    `;
  }}

  ${props => {
    return css`
      color: ${props.headFc};
      border-bottom: ${props.headBorder};
    `;
  }}

  cursor: ${({ movable }) => {
    if (movable) {
      return 'move';
    }
    return 'normal';
  }};
`;

const Border = styled.div`
  position: absolute;

  ${({ pos }) => {
    if (pos === 'top') {
      return css`
        width: 100%;
        height: 12px;
        cursor: n-resize;
      `;
    }
    if (pos === 'right') {
      return css`
        width: 12px;
        height: 100%;
        right: 0;

        cursor: e-resize;
      `;
    }
    if (pos === 'bottom') {
      return css`
        width: 100%;
        height: 12px;
        bottom: 0;
        cursor: s-resize;
      `;
    }
    if (pos === 'left') {
      return css`
        width: 12px;
        height: 100%;
        cursor: w-resize;
      `;
    }
    if (pos === 'leftTop') {
      return css`
        width: 12px;
        height: 12px;
        margin-left: auto;
        cursor: nw-resize;
      `;
    }
    if (pos === 'rightTop') {
      return css`
        width: 12px;
        height: 12px;
        right: 0;
        cursor: ne-resize;
      `;
    }
    if (pos === 'rightBottom') {
      return css`
        width: 12px;
        height: 12px;
        bottom: 0;
        right: 0;
        cursor: se-resize;
      `;
    }
    if (pos === 'leftBottom') {
      return css`
        width: 12px;
        height: 12px;
        bottom: 0;
        cursor: sw-resize;
      `;
    }

    return css``;
  }};
`;

const CloseBtn = styled.div`
  margin-left: auto;
  padding-right: 12px;
  svg {
    width: 20px;
    height: 20px;
  }

  cursor: pointer;
`;

const Bottom = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: ${({ theme }) => theme.modalStyle.headBorder};

  button {
    margin-right: 12px;
  }
`;

const ChildrenWrapper = styled.div`
  height: calc(${props => props.height} - 96px);
`;

export default Modal;
