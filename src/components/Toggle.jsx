import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

/**
 * @param {String []} param.list
 * 토글에 들어갈 텍스트가 담긴 배열
 * default 값은 ['아이템 없음']
 * @param {String} param.padding
 * 버튼에서 텍스트가 가지는 여백 (버튼의 크기 관련)
 * default 값은 '12px'
 * @param {Number} param.value
 * 선택된 버튼의 값
 * useState로 관리되는 상태값 이여야 함
 * default 값은 1
 * @param {Function} param.setValue
 * 선택된 버튼의 값을 바꾸는 함수
 * useState로 생성된 상태 관리 함수여야 함
 * default 값은 null
 * @param {String} param.style.bgColor
 * 토글 버튼의 기본 색
 * default 값은 '#eee'
 * @param {String} param.style.fontColor
 * 토글 버튼의 텍스트 기본 색
 * default 값은 'black'
 * @param {String} param.style.fontSize
 * 토글 버튼의 텍스트 크기
 * default 값은 '1rem'
 * @param {String} param.style.hoverColor
 * 토글 버튼에 커서 올렸을 때, 버튼의 색
 * default 값은 'white'
 * @param {String} param.style.hoverFontColor
 * 토글 버튼에 커서 올렸을 때, 텍스트의 색
 * default 값은 'white'
 * @param {String} param.style.clickedColor
 * 선택된 버튼의 색
 * default 값은 '#3498db'
 * @param {String} param.style.clickedFontColor
 * 선택된 버튼의 텍스트 색
 * default 값은 'white'
 * @returns {JSX.Element} Toggle Component
 */

function Toggle({
  list = ['아이템 없음'],
  padding = '12px',
  value = 1,
  setValue = null,
  style = {},
}) {
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
