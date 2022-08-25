import React from 'react';
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

function Switch({ size = 'middle', value = true, setValue = null, color = 'green' }) {
  const handleValue = () => {
    setValue(!value);
  };

  return (
    <Wrapper size={size} value={value} onClick={handleValue} color={color}>
      <Check size={size} value={value} color={color}></Check>
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
    } else {
      return '#808080';
    }
  }};

  :hover {
    div::after {
      background: ${({ color, value }) => {
        if (value) {
          return `rgba(${colorComb[color]}, 0.4)`;
        } else {
          return 'rgba(128, 128, 128, 0.4)';
        }
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
      } else {
        return css`
          transform: translate(16px, 0);
        `;
      }
    } else {
      if (size === 'middle') {
        return css`
          transform: translate(0, 0);
        `;
      } else {
        return css`
          transform: translate(0, 0);
        `;
      }
    }
  }}

  background: ${({ value, color }) => {
    if (value) {
      return `rgba(${colorComb[color]}, 1)`;
    } else {
      return '#eee';
    }
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
