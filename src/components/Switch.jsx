import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

const colorComb = {
  green: '164, 228, 104',
  red: '255, 64, 64',
  coral: '242, 186, 167',
  blue: '111, 181, 255',
  gray: '189, 190, 189',
};

const colorBg = {
  blue: '#5d94d0',
  green: '#87ba73',
  coral: '#c58998',
  red: '#d13936',
  gray: '#9b9b9b',
};

/**
 * @param {String} param.size
 * 컴포넌트의 사이즈
 * 'middle', 'small' 두 가지 값 유효
 * default 값은 'middle'
 * @param {Boolean} param.value
 * 관리하고자 하는 Boolean 값
 * state로 관리되는 값이여 함 (상태 값)
 * default 값은 true
 * @param {Function} param.setValue
 * Boolean 값을 변화시키는 함수
 * useState로 생성된 함수여야 함 (상태 관리 함수)
 * default 값은 null
 * @param {String} param.color
 * 컴포넌트의 색
 * 'blue', 'green', 'coral', 'red', 'gray' 5가지 값 유효
 * default 값은 blue'
 * @returns {JSX.Element} Component
 */

function Switch({ size = 'middle', value = true, setValue = null, color = 'blue' }) {
  const handleValue = useCallback(() => {
    setValue(!value);
  }, [setValue, value]);

  return (
    <Wrapper size={size} value={value} onClick={handleValue} color={color}>
      <Check size={size} value={value} color={color} />
    </Wrapper>
  );
}

const Wrapper = styled.label`
  position: relative;
  border-radius: 16px;
  cursor: pointer;
  -webkit-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  -webkit-background-clip: padding-box;
  -moz-background-clip: padding-box;
  background-clip: padding-box;
  ${({ size }) => {
    if (size === 'middle') {
      return css`
        width: 36px;
        height: 20px;
      `;
    }
    if (size === 'small') {
      return css`
        width: 32px;
        height: 16px;
      `;
    }
    return null;
  }};
  background: ${({ value, color }) => {
    if (value) {
      return colorBg[color];
    }
    return '#808080';
  }};

  :hover {
    div::after {
      background: ${({ color, value }) => {
        if (value) {
          return `rgba(${colorComb[color]}, 0.4)`;
        }
        return 'rgba(128, 128, 128, 0.4)';
      }}};
    }
  }
`;

const Check = styled.div`
  position: absolute;
  transition: 0.2s;
  border-radius: 50%;
  -webkit-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  -webkit-background-clip: padding-box;
  -moz-background-clip: padding-box;
  background-clip: padding-box;
  ${({ value, size }) => {
    if (value) {
      if (size === 'middle') {
        return css`
          transform: translate(16px, 0);
        `;
      }
      return css`
        transform: translate(16px, 0);
      `;
    }
    if (size === 'middle') {
      return css`
        transform: translate(0, 0);
      `;
    }
    return css`
      transform: translate(0, 0);
    `;
  }}

  background: ${({ value, color }) => {
    if (value) {
      return `rgba(${colorComb[color]}, 1)`;
    }
    return '#eee';
  }};

  ${({ size, value }) => {
    if (size === 'middle') {
      return css`
        width: 20px;
        height: 20px;
      `;
    }
    if (size === 'small') {
      return css`
        width: 16px;
        height: 16px;
      `;
    }
    return null;
  }}

  ::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: transparent;

    ${({ size, value }) => {
      if (size === 'middle') {
        return css`
          width: 28px;
          height: 28px;
          transform: translate(-3.5px, -3.5px);
        `;
      }
      if (size === 'small') {
        return css`
          width: 24px;
          height: 24px;
          transform: translate(-3px, -3.5px);
        `;
      }
      return null;
    }}
  }
`;

export default Switch;
