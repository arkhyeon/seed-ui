import React, { useRef, useEffect, useState, useCallback } from 'react';
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
 * @param {String} props.color
 * 툴팁의 배경색
 * default 값은 '#d2d2d2'
 * @returns {JSX.element} Tooltip Component
 */

function Tooltip({
  text = '텍스트를 넣어주세요.',
  position = 'top-center',
  color = '#d2d2d2',
  children,
}) {
  const wrapperRef = useRef(null);
  const tooltipRef = useRef(null);
  const contentRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setSize({
      width: contentRef.current.offsetWidth,
      height: contentRef.current.offsetHeight,
    });

    setTooltipSize({
      width: tooltipRef.current.offsetWidth,
      height: tooltipRef.current.offsetHeight,
    });
  }, []);

  const handleOver = useCallback(() => {
    tooltipRef.current.style.visibility = 'visible';
  }, []);

  const handleLeave = useCallback(() => {
    tooltipRef.current.style.visibility = 'hidden';
  }, []);

  return (
    <>
      <Wrapper onMouseOver={handleOver} onMouseLeave={handleLeave} ref={wrapperRef}>
        <Text ref={contentRef} className="tooltip-text">
          {children}
          <TooltipComponent
            position={position}
            ref={tooltipRef}
            size={size}
            tooltipSize={tooltipSize}
            color={color}
            className="tooltip"
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
  ${({ color }) => {
    return css`
      background: ${color};
    `;
  }};

  ${({ position, size, tooltipSize }) => {
    if (position === 'top-start') {
      return css`
        bottom: ${size.height + 14}px;
      `;
    }
    if (position === 'top-center') {
      return css`
        left: ${size.width / 2 - tooltipSize.width / 2}px;
        bottom: ${size.height + 14}px;
      `;
    }
    if (position === 'top-end') {
      return css`
        left: ${size.width - 8}px;
        bottom: ${size.height + 14}px;
      `;
    }
    if (position === 'right-start') {
      return css`
        left: ${size.width + 3}px;
        bottom: ${size.height}px;
      `;
    }
    if (position === 'right-center') {
      return css`
        left: ${size.width + 16}px;
        top: ${size.height / 2 - tooltipSize.height / 2}px;
      `;
    }
    if (position === 'right-end') {
      return css`
        left: ${size.width + 3}px;
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
        bottom: ${size.height}px;
      `;
    }
    if (position === 'left-center') {
      return css`
        right: ${size.width + 16}px;
        top: ${size.height / 2 - tooltipSize.height / 2}px;
      `;
    }
    if (position === 'left-end') {
      return css`
        right: ${size.width + 8}px;
      `;
    }
    return css``;
  }};

  :before {
    ${({ color }) => {
      return css`
        border-top: 14px solid ${color};
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
          left: 1px;
        `;
      }
      if (position === 'right-center') {
        return css`
          transform: rotate(90deg) translate(${tooltipSize.height / 2 - 4}px, 12px);
          top: 0;
        `;
      }
      if (position === 'right-end') {
        return css`
          bottom: ${tooltipSize.height - 2}px;
          transform: rotate(135deg) translate(5px, 2px);
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
          bottom: ${tooltipSize.height - 2}px;
          transform: rotate(135deg) translate(5px, 2px);
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
          top: 0;
          transform: rotate(270deg)
            translate(-${tooltipSize.height / 2 - 4}px, ${tooltipSize.width - 2}px);
        `;
      }
      if (position === 'left-end') {
        return css`
          left: ${tooltipSize.width - 3}px;
          transform: rotate(225deg) translate(2px, 4px);
        `;
      }
      return css``;
    }};
  }
`;

const Text = styled.div`
  display: inline-block;
  position: relative;
  line-height: 1;
`;

export default Tooltip;
