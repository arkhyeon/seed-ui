import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

/**
 * @param {Number} param.value
 * 선택하고자 하는 값
 * 숫자 타입으로 인덱스 값으로 대상 분류한다고 가정
 * state로 관리하는 값이여야 함 (상태값)
 * default 값은 0
 * @param {Function} param.setValue
 * 선택 값을 바꾸는 함수
 * useState로 생성한 상태 관리 함수여야 함
 * default 값은 null
 * @param {String | Number [Array]} param.list
 * 선택할 수 있는 값들로 이루어진 배열
 * index를 통해 값이 선택 되므로 정해진 순서를 고려해 넣어야 함
 * default 값은 ['항목 없음']
 * @param {String} param.text
 * 선택에 대한 제목
 * default 값은 '텍스트를 입력해주세요.'
 * @param {String} param.CheckColor
 * 체크 단락의 색
 * default 값은 'rgb(144, 202, 249)'
 * @param {String} param.hoverColor
 * 체크 단락에 마우스를 올렸을 때 생기는 원의 색
 * default 값은 '#eee'
 * @param {String} param.labelInSpacing
 * 한 라벨 내에서 체크 단락과 글씨와의 간격
 * default 값은 '4px'
 * @param {String} param.labelOutSpacing
 * 라벨 간의 간격
 * default 값은 '8px'
 * @param {String} param.type
 * Radio 컴포넌트의 형태 지정
 * 'fill' 체크 할 시, 동그라미로 표시(default)
 * 'border' 체크 할 시, 테두리가 굵어짐
 * @returns {JSX.Component} Radio Component
 */

function Radio({
  value = 0,
  setValue = null,
  list = ['항목 없음'],
  text = '텍스트를 입력해주세요',
  checkColor = 'rgb(144, 202, 249)',
  hoverColor = '#eee',
  labelInSpacing = '4px',
  labelOutSpacing = '8px',
  type = 'fill',
}) {
  const handleValue = idx => {
    setValue(idx);
  };
  const renderOption = () => {
    return (
      <OptionWrapper>
        {list.map((el, idx) => (
          <Label
            key={`label-${el}`}
            onClick={() => handleValue(idx)}
            labelOutSpacing={labelOutSpacing}
          >
            <CheckWrapper
              checkColor={checkColor}
              labelInSpacing={labelInSpacing}
              hoverColor={hoverColor}
              type={type}
              value={value}
              idx={idx}
            >
              <Check value={value} idx={idx} checkColor={checkColor} type={type} />
            </CheckWrapper>
            <div>{el}</div>
          </Label>
        ))}
      </OptionWrapper>
    );
  };
  return (
    <Wrapper>
      <Title>{text}</Title>
      {renderOption()}
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const OptionWrapper = styled.div`
  display: flex;
`;

const CheckWrapper = styled.div`
  position: relative;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  background: transparent;
  margin-right: ${({ labelInSpacing }) => labelInSpacing};
  display: flex;
  align-items: center;

  :hover {
    background: ${({ hoverColor }) => hoverColor};
  }

  ::before {
    content: '';
    position: absolute;
    border: ${({ checkColor }) => `2px solid ${checkColor}`};
    background: white;
    width: 16px;
    height: 16px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    ${({ type, value, idx, checkColor }) => {
      if (type === 'border' && value === idx) {
        return css`
          border: 2px solid ${checkColor};
          background: ${checkColor};
        `;
      }

      if (type === 'border') {
        return css`
          border: 2px solid #d2d2d2;
        `;
      }
    }};
  }
`;

const Check = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;

  background: ${({ value, idx, checkColor, type }) => {
    if (value === idx && type === 'border') {
      return 'white';
    }

    if (value === idx) {
      return checkColor;
    }
    return 'transparent';
  }};

  transition: 0.2s;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;

  margin-right: ${({ labelOutSpacing }) => labelOutSpacing};
  :last-child {
    margin-right: 0;
  }
`;

const Title = styled.div`
  margin-bottom: 8px;
  padding-left: 8px;
`;

export default Radio;
