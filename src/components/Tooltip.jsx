import React, { useRef, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

/**
 *
 * @param {String} props.text
 * 툴팁에 들어갈 텍스트
 * default 값은 '텍스트를 넣어주세요.'
 * @param {String} props.position
 * 툴팁의 위치
 * 'top-start',
 * 'top-center', (default)
 * 'top-end',
 * 'right-start',
 * 'right-center',
 * 'right-end',
 * 'bottom-start',
 * 'bottom-center',
 * 'bottom-end',
 * 'left-start',
 * 'left-center',
 * 'left-end'
 * @param {String} props.bgColor
 * 툴팁의 배경색
 * default 값은 '#808080'
 * @param {String} props.fontColor
 * 툴팁 텍스트의 색
 * default 값은 'white'
 * @param {String} props.fontSize
 * 툴팁 텍스트의 크기
 * default 값은 '1rem'
 * @returns
 */

function Tooltip({
  text = '텍스트를 넣어주세요.',
  position = 'top-center',
  bgColor = '#808080',
  fontColor = 'white',
  fontSize = '1rem',
  children,
}) {
  const wrapperRef = useRef(null);
  const tooltipRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setSize({
      width: wrapperRef.current.offsetWidth,
      height: wrapperRef.current.offsetHeight,
    });

    setTooltipSize({
      width: tooltipRef.current.offsetWidth,
      height: tooltipRef.current.offsetHeight,
    });
  }, [wrapperRef.current, tooltipRef.current]);

  const handleOver = e => {
    tooltipRef.current.style.display = 'block';
  };

  const handleLeave = e => {
    tooltipRef.current.style.display = 'none';
  };

  return (
    <>
      <Wrapper onMouseOver={handleOver} onMouseLeave={handleLeave} ref={wrapperRef}>
        {children}
        <TooltipComponent
          position={position}
          ref={tooltipRef}
          size={size}
          tooltipSize={tooltipSize}
          bgColor={bgColor}
          fontColor={fontColor}
          fontSize={fontSize}
        >
          {text}
        </TooltipComponent>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  position: absolute;
  white-space: nowrap;
`;

const TooltipComponent = styled.div`
  position: absolute;
  z-index: 99;
  white-space: nowrap;
  padding: 4px 8px;
  border-radius: 4px;
  ${({ bgColor, fontColor, fontSize }) => {
    return css`
      background: ${bgColor};
      color: ${fontColor};
      font-size: ${fontSize};
    `;
  }};

  ${({ position, size, tooltipSize }) => {
    if (position === 'top-start') {
      return css`
        bottom: ${size.height + 8}px;
      `;
    }
    if (position === 'top-center') {
      return css`
        left: ${size.width / 2}px;
        bottom: ${size.height + 8}px;
      `;
    }
    if (position === 'top-end') {
      return css`
        left: ${size.width}px;
        bottom: ${size.height + 8}px;
      `;
    }
    if (position === 'right-start') {
      return css`
        left: ${size.width}px;
        bottom: ${size.height + 8}px;
      `;
    }
    if (position === 'right-center') {
      return css`
        left: ${size.width + 12}px;
        bottom: ${size.height / 2 - tooltipSize.height / 2}px;
      `;
    }
    if (position === 'right-end') {
      return css`
        left: ${size.width}px;
        top: ${size.height + 8}px;
      `;
    }
    if (position === 'bottom-start') {
      return css`
        top: ${size.height + 12}px;
      `;
    }
    if (position === 'bottom-center') {
      return css`
        left: ${size.width / 2}px;
        top: ${size.height + 12}px;
      `;
    }
    if (position === 'bottom-end') {
      return css`
        left: ${size.width}px;
        top: ${size.height + 12}px;
      `;
    }
    if (position === 'left-start') {
      return css`
        right: ${size.width + 8}px;
        bottom: ${size.height + 8}px;
      `;
    }
    if (position === 'left-center') {
      return css`
        right: ${size.width + 16}px;
        bottom: ${size.height / 2 - tooltipSize.height / 2}px;
      `;
    }
    if (position === 'left-end') {
      return css`
        right: ${size.width + 12}px;
        top: ${size.height + 8}px;
      `;
    }
    return css``;
  }};

  :before {
    ${({ bgColor }) => {
      return css`
        border-top: 14px solid ${bgColor};
      `;
    }};

    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 0px solid transparent;
    content: '';
    position: absolute;
    margin: -4px -8px;
    z-index: 98;

    ${({ position, tooltipSize }) => {
      if (position === 'top-start') {
        return css`
          top: ${tooltipSize.height}px;
        `;
      }
      if (position === 'top-center') {
        return css`
          top: ${tooltipSize.height}px;
          transform: rotate(15deg);
        `;
      }
      if (position === 'top-end') {
        return css`
          transform: rotate(25deg);
          top: ${tooltipSize.height}px;
        `;
      }
      if (position === 'right-start') {
        return css`
          transform: rotate(25deg);
          top: ${tooltipSize.height}px;
        `;
      }
      if (position === 'right-center') {
        return css`
          transform: rotate(90deg) translate(${tooltipSize.height / 2 - 4}px, 12px);
        `;
      }
      if (position === 'right-end') {
        return css`
          bottom: ${tooltipSize.height - 2}px;
          transform: rotate(140deg);
        `;
      }
      if (position === 'bottom-start') {
        return css`
          bottom: ${tooltipSize.height}px;
          transform: rotate(180deg);
        `;
      }
      if (position === 'bottom-center') {
        return css`
          bottom: ${tooltipSize.height}px;
          transform: rotate(165deg);
        `;
      }
      if (position === 'bottom-end') {
        return css`
          bottom: ${tooltipSize.height - 4}px;
          left: ${4}px;
          transform: rotate(150deg);
        `;
      }
      if (position === 'left-start') {
        return css`
          left: ${tooltipSize.width - 2}px;
          top: ${tooltipSize.height - 4}px;
          transform: rotate(315deg);
        `;
      }
      if (position === 'left-center') {
        return css`
          transform: rotate(270deg) translate(-8px, ${tooltipSize.width - 4}px);
        `;
      }
      if (position === 'left-end') {
        return css`
          left: ${tooltipSize.width - 4}px;
          transform: rotate(215deg) translate(6px, 6px);
        `;
      }
      return css``;
    }};
  }
`;

export default Tooltip;
