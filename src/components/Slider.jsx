import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { BsPlayFill, BsFillStopFill } from 'react-icons/bs';

/**
 * @param {String} props.width
 * Slider 컴포넌트의 너비
 * default 값은 '800px'
 * @param {String} props.height
 * Slider 컴포넌트의 높이
 * default 값은 '400px'
 * @param {Component[]} props.itemList
 * 보여주고자 하는 컴포넌트들을 담은 배열
 * default 값은 null
 * @param {Boolean} props.autoPlay
 * Slider 자동 재생 여부
 * default 값은 false
 * @param {Number} props.autoTime
 * 자동 재생 시 페이지 넘어가는 시간
 * default 값은 5000
 * @param {String} props.border
 * Slider 컴포넌트의 테두리 스타일
 * default 값은 '1px solid black'
 * @param {String} props.background
 * 각 페이지의 배경색
 * default 값은 'transparent'
 * @returns {JSX.Element} Slider Component
 */

function Slider({
  width = '800px',
  height = '400px',
  itemList = null,
  autoPlay = false,
  autoTime = 5000,
  border = '1px solid black',
  background = 'transparent',
}) {
  const [idx, setIdx] = useState(0);
  const lastIndex = useRef(itemList.length - 1).current;
  const navRef = useRef(null);
  const [navSize, setNavSize] = useState({ width: 0, height: 0 });
  const itemWrapperRef = useRef(null);
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay);
  const playAuto = useRef(null);

  useLayoutEffect(() => {
    setNavSize({
      width: `${navRef.current.offsetWidth}px`,
      height: `${navRef.current.offsetHeight}px`,
    });
  }, [setNavSize]);

  const handleNext = useCallback(() => {
    if (idx === lastIndex) {
      setIdx(0);
    } else {
      setIdx(idx + 1);
    }
  }, [setIdx, idx, lastIndex]);

  const handlePrev = useCallback(() => {
    if (idx === 0) {
      setIdx(lastIndex);
    } else {
      setIdx(idx - 1);
    }
  }, [setIdx, idx, lastIndex]);

  const handleNav = useCallback(
    e => {
      setIdx(parseInt(e.target.dataset.idx, 10));
    },
    [setIdx],
  );

  const handleMove = useCallback(() => {
    itemWrapperRef.current.style.left = `-${idx * parseInt(width, 10)}px`;
  }, [idx, width]);

  const renderItem = useCallback(() => {
    if (itemList === null) {
      return null;
    }

    return (
      <div>
        <ItemWrapper ref={itemWrapperRef}>
          {itemList.map((el, idx) => (
            <Item key={`item-${idx}`} width={width} height={height} background={background}>
              {el}
            </Item>
          ))}
        </ItemWrapper>
      </div>
    );
  }, [itemList, width, height]);

  const renderNavPoint = useCallback(() => {
    if (itemList === null) {
      return null;
    }

    return (
      <Nav
        width={width}
        height={height}
        ref={navRef}
        navWidth={navSize.width}
        navHeight={navSize.height}
      >
        {itemList.map((el, idx) => (
          <NavPoint key={`nav-${idx}`} data-idx={idx} onClick={handleNav} />
        ))}
      </Nav>
    );
  }, [width, height, navSize, itemList]);

  useLayoutEffect(() => {
    if (isAutoPlay) {
      playAuto.current = setInterval(() => {
        if (idx === lastIndex) {
          setIdx(0);
        } else {
          setIdx(idx + 1);
        }
      }, autoTime);
    }
    if (!isAutoPlay) {
      clearInterval(playAuto.current);
    }
    return () => clearInterval(playAuto.current);
  }, [isAutoPlay, setIdx, idx, lastIndex, autoTime]);

  useLayoutEffect(() => {
    handleMove();
  }, [idx, handleMove]);

  return (
    <Wrapper width={width} height={height} border={border} bg={background}>
      {renderNavPoint()}
      {!isAutoPlay ? (
        <Button pos="top" width={width} height={height} onClick={() => setIsAutoPlay(true)}>
          <BsPlayFill />
        </Button>
      ) : (
        <Button pos="top" width={width} height={height} onClick={() => setIsAutoPlay(false)}>
          <BsFillStopFill />
        </Button>
      )}
      <Button pos="left" width={width} height={height} onClick={handlePrev}>
        <AiOutlineLeft />
      </Button>
      <Button pos="right" width={width} height={height} onClick={handleNext}>
        <AiOutlineRight />
      </Button>
      {renderItem()}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  ${({ width, height, border }) => {
    return css`
      width: ${width};
      height: ${height};
      border: ${border};
    `;
  }}

  overflow: hidden;
  position: relative;
`;

const ItemWrapper = styled.div`
  position: absolute;
  display: flex;
  transition: 0.4s;
`;

const Item = styled.div`
  ${({ width, height, background }) => {
    return css`
      width: ${width};
      height: ${height};
      background: ${background};
    `;
  }};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  position: absolute;
  background: rgba(128, 128, 128, 0.2);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 90;
  width: 60px;
  height: 60px;
  border-radius: 4px;

  :hover {
    background: rgba(128, 128, 128, 0.5);
  }

  ${({ pos, width, height }) => {
    if (pos === 'top') {
      return css`
        top: 8px;
        left: calc(${width} / 2 - 30px);
      `;
    }
    if (pos === 'left') {
      return css`
        left: 8px;
        top: calc(${height} / 2 - 25px);
      `;
    }
    if (pos === 'right') {
      return css`
        left: calc(${width} - 68px);
        top: calc(${height} / 2 - 25px);
      `;
    }
    return 0;
  }};

  svg {
    width: 50px;
    height: 50px;
  }
`;

const Nav = styled.ul`
  position: absolute;
  z-index: 90;
  ${({ width, height, navWidth, navHeight }) => {
    return css`
      left: calc(${width} / 2 - ${navWidth} / 2);
      top: calc(${height} - ${navHeight} - 8px);
    `;
  }};

  display: flex;
`;

const NavPoint = styled.li`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: rgba(128, 128, 128, 0.2);
  margin-right: 12px;
  :last-child {
    margin-right: 0;
  }

  &:hover {
    background: rgba(128, 128, 128, 0.5);
  }
  cursor: pointer;
  display: inline-block;
`;

export default Slider;
