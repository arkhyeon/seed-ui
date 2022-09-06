import React from 'react';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const colorComb = {
  success: ['164, 228, 104'],
  error: ['255, 64, 64'],
  coral: ['242, 186, 167'],
  blue: ['111, 181, 255'],
  gray: ['189, 190, 189'],
  black: ['64, 64, 64'],
};

/**
 * @param {String} props.type
 * 버튼의 형태 결정 (색은 params.color 값에 따라 결정)
 * "fill": 배경색 존재 (default)
 * "border": 배경색 흰색, 테두리만 존재
 * "text": 배경색 투명, 테두리 없이 텍스트만 존재
 * @param {String} props.color
 * 버튼의 색깔 결정
 * "success" : 초록색
 * "error" : 빨강색
 * "coral" : 산호색
 * "blue" : 연한 파랑색
 * "gray" : 회색 (default)
 * "black": 검정색
 * @param {String} props.size
 * 버튼의 크기 결정
 * "small" : 작은 크기
 * "medium" : 중간 크기 (default)
 * "big": 큰 크기
 * @param {Number} props.width
 * 버튼의 너비 설정 (default === auto)
 * 버튼이 특정한 너비를 가져야 할 때 길이 지정 가능
 * @param {String} props.fontSize
 * 버튼 내 텍스트의 크기
 * default 값은 'size' 값에 따라 상이
 * 'small'일 시, '0.8rem'
 * 'medium'일 시, '1.5rem'
 * 'big'일 시, '1.8rem'
 * @param {Boolean} props.disabled
 * 버튼 활성화 여부
 * true : 버튼 활성화 (default)
 * false : 버튼 비활성화
 * @param {Boolean} props.isAnimation
 * 버튼 클릭시 애니메이션 동작 여부 결정
 * true : 애니메이션 동작 (default)
 * false : 애니메이션 미동작
 * @param {Component} props.icon (option)
 * 값의 여부에 따라 아이콘 추가 여부 결정
 * 값이 존재할 시 텍스트 앞에 해당 컴포넌트 추가
 * @returns {JSX.Element} Button Component
 */

function Button({
  type = 'fill',
  color = 'gray',
  children,
  size = 'medium',
  width,
  disabled = false,
  isAnimation = true,
  icon = <></>,
  fontSize = '1rem',
  ...rootDOMAttributes
}) {
  return (
    <Component
      {...rootDOMAttributes}
      disabled={!!disabled}
      type={type}
      color={color}
      size={size}
      isAnimation={isAnimation}
      width={width}
      fontSize={fontSize}
    >
      {icon} {children}
    </Component>
  );
}

const ripple = keyframes`
  0%   { transform: translate(0, 0); }
  80%  { transform: translate(0, 0) scale(50); }
  100% { transform: translate(0, 0) scale(50); opacity: 0; }
`;

const fade = keyframes`
    0%   { opacity: 0.6; }
   100% { opacity: 0; }
`;

const Component = styled.button`
  padding-left: 8px;
  padding-right: 8px;
  outline: none;
  border-radius: 4px;
  display: inline-flex;
  position: relative;
  align-items: center;
  transition: 0.2s;
  overflow: hidden;
  cursor: pointer;
  display: inline-flex;
  align-items: center;

  svg {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ${({ type, color }) => {
    if (type === 'fill') {
      return css`
        background: rgb(${colorComb[color][0]});
        color: white;
        border: none;

        :hover {
          filter: brightness(95%);
        }
      `;
    }
    if (type === 'border') {
      return css`
        background: white;
        border: 1px solid rgb(${colorComb[color][0]});
        color: rgb(${colorComb[color][0]});
        :hover {
          background: rgb(${colorComb[color][0]});
          color: white;
        }
      `;
    }
    if (type === 'text') {
      return css`
        background: white;
        border: none;
        color: rgb(${colorComb[color][0]});
        :hover {
          background: rgba(${colorComb[color][0]}, 0.1);
        }
      `;
    }
    return null;
  }};

  ${({ width }) => {
    if (width) {
      return css`
        width: ${width};
      `;
    }
    return css`
      width: auto;
    `;
  }};

  ${({ size }) => {
    if (size === 'small') {
      return css`
        height: 1.8rem;
        font-size: 0.8rem;
      `;
    }
    if (size === 'medium') {
      return css`
        height: 2.5rem;
        font-size: 1.5rem;
      `;
    }
    if (size === 'big') {
      return css`
        height: 3.2rem;
        font-size: 1.8rem;
      `;
    }
    return null;
  }};

  :before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: transparent;
    opacity: 0.3;
  }

  :focus:not(:active):before {
    background: ${({ type, isAnimation }) => {
      if (!isAnimation) {
        return 'transparent';
      }
      if (type === 'text') {
        return '#d3d3d3';
      }
      return 'white';
    }};

    animation: ${ripple} 1200ms ease-out forwards, ${fade} 1000ms ease-out forwards;
  }

  font-size: ${({ fontSize }) => fontSize};
`;

export default Button;
