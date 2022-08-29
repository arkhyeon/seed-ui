import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

function Toggle({ list = ['아이템 없음'], padding = '12px', value, setValue, style = {} }) {
  const {
    bgColor = '#eee',
    fontColor = 'black',
    fontSize = '1rem',
    hoverColor = '#89b9e7',
    hoverFontColor = 'white',
    clickedColor = '#3498db',
    clickedFontColor = 'white',
  } = style;

  const handleToggle = btnValue => {
    setValue(btnValue);
  };

  const renderBtn = () => {
    return (
      <>
        {list.map((el, idx) => (
          <Button
            key={`toggle-${idx}`}
            btnValue={idx + 1}
            value={value}
            onClick={() => handleToggle(idx + 1)}
            bgColor={bgColor}
            fontColor={fontColor}
            fontSize={fontSize}
            hoverColor={hoverColor}
            hoverFontColor={hoverFontColor}
            clickedColor={clickedColor}
            clickedFontColor={clickedFontColor}
            padding={padding}
          >
            {el}
          </Button>
        ))}
      </>
    );
  };

  return <Wrapper bgColor={bgColor}>{renderBtn()}</Wrapper>;
}

const Wrapper = styled.div`
  display: inline-block;
  border-radius: 4px;
  background: ${({ bgColor }) => bgColor};
`;

const Button = styled.button`
  border: none;
  outline: none;
  cursor: pointer;

  border-radius: 4px;

  ${({ padding, fontSize }) =>
    css`
      padding: ${padding};
      font-size: ${fontSize};
    `};

  font-size: ${({ fontSize }) => fontSize};
  ${({ btnValue, value, bgColor, fontColor, clickedColor, clickedFontColor }) => {
    if (btnValue === value) {
      return css`
        background: ${clickedColor};
        color: ${clickedFontColor};
        -webkit-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
        -moz-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
        box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
        -webkit-background-clip: padding-box;
        -moz-background-clip: padding-box;
        background-clip: padding-box;
      `;
    }
    return css`
      background: ${bgColor};
      color: ${fontColor};
    `;
  }};

  :hover {
    ${({ hoverColor, hoverFontColor }) =>
      css`
        background: ${hoverColor};
        color: ${hoverFontColor};
      `}
  }
`;

export default Toggle;
