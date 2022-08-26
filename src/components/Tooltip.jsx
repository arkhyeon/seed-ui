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
 * @param {String} props.textSize
 * 툴팁 텍스트의 크기
 * default 값은 '1rem'
 * @param {String} props.fontSize
 * 일반 텍스트의 크기
 * default 값은 '1rem'
 * @returns
 */

function Tooltip({
  text = '텍스트를 넣어주세요.',
  position = 'top-center',
  bgColor = '#808080',
  fontColor = 'white',
  textSize = '1rem',
  fontSize = '1rem',
  children,
}) {
  const wrapperRef = useRef(null);
  const tooltipRef = useRef(null);
  const contentRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setSize({
      // width: wrapperRef.current.offsetWidth,
      // height: wrapperRef.current.offsetHeight,
      width: contentRef.current.offsetWidth,
      height: contentRef.current.offsetHeight,
    });

    setTooltipSize({
      width: tooltipRef.current.offsetWidth,
      height: tooltipRef.current.offsetHeight,
    });
  }, [wrapperRef.current, tooltipRef.current]);

  const handleOver = e => {
    tooltipRef.current.style.visibility = 'visible';
  };

  const handleLeave = e => {
    tooltipRef.current.style.visibility = 'hidden';
  };

  return (
    <>
      <Wrapper onMouseOver={handleOver} onMouseLeave={handleLeave} ref={wrapperRef}>
        <Text ref={contentRef} fontSize={fontSize}>
          {children}
          <TooltipComponent
            position={position}
            ref={tooltipRef}
            size={size}
            tooltipSize={tooltipSize}
            bgColor={bgColor}
            fontColor={fontColor}
            textSize={textSize}
            fontSize={fontSize}
          >
            {text}
          </TooltipComponent>
        </Text>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  position: relative;
  white-space: nowrap;
  display: block;
`;

const TooltipComponent = styled.div`
  position: absolute;
  z-index: 99;
  visibility: hidden;
  white-space: nowrap;
  padding: 4px 8px;
  border-radius: 4px;
  ${({ bgColor, fontColor, textSize }) => {
    return css`
      background: ${bgColor};
      color: ${fontColor};
      font-size: ${textSize};
      line-height: calc(${textSize} + 8px);
    `;
  }};

  ${({ position, size, tooltipSize, fontSize }) => {
    if (position === 'top-start') {
      return css`
        bottom: calc(${fontSize} + 12px);
      `;
    }
    if (position === 'top-center') {
      return css`
        left: ${size.width / 2 - tooltipSize.width / 2}px;
        bottom: calc(${fontSize} + 12px);
      `;
    }
    if (position === 'top-end') {
      return css`
        left: ${size.width}px;
        bottom: calc(${fontSize} + 12px);
      `;
    }
    if (position === 'right-start') {
      return css`
        left: ${size.width + 12}px;
        bottom: calc(${fontSize} + 8px);
      `;
    }
    if (position === 'right-center') {
      return css`
        left: ${size.width + 16}px;
        bottom: calc(${size.height / 2}px - ${tooltipSize.height / 2}px);
      `;
    }
    if (position === 'right-end') {
      return css`
        left: ${size.width + 12}px;
        top: calc(${fontSize} + 8px);
      `;
    }
    if (position === 'bottom-start') {
      return css`
        margin-top: 12px;
      `;
    }
    if (position === 'bottom-center') {
      return css`
        margin-top: 12px;
        left: ${size.width / 2 - tooltipSize.width / 2}px;
      `;
    }
    if (position === 'bottom-end') {
      return css`
        left: ${size.width + 4}px;
        margin-top: 12px;
      `;
    }
    if (position === 'left-start') {
      return css`
        right: ${size.width + 8}px;
        bottom: ${fontSize};
      `;
    }
    if (position === 'left-center') {
      return css`
        right: ${size.width + 16}px;
        bottom: calc(${size.height / 2}px - ${tooltipSize.height / 2}px);
      `;
    }
    if (position === 'left-end') {
      return css`
        right: ${size.width + 12}px;
        top: calc(${fontSize} + 8px);
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
          left: ${tooltipSize.width / 2}px;
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
          transform: rotate(45deg);
          top: ${tooltipSize.height - 4}px;
          left: 0px;
        `;
      }
      if (position === 'right-center') {
        return css`
          transform: rotate(90deg) translate(8px, 12px);
        `;
      }
      if (position === 'right-end') {
        return css`
          bottom: ${tooltipSize.height - 2}px;
          transform: rotate(140deg) translate(5px, 2px);
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
          left: ${tooltipSize.width / 2}px;
          transform: rotate(180deg);
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
          left: ${tooltipSize.width - 3}px;
          transform: rotate(215deg) translate(4px, 7px);
        `;
      }
      return css``;
    }};
  }
`;

const Text = styled.div`
  display: inline-block;
  position: relative;
  font-size: ${({ fontSize }) => fontSize};
  line-height: ${({ fontSize }) => fontSize};
`;

export default Tooltip;
