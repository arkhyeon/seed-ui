import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { MdLabelOutline, MdLabel } from 'react-icons/md';

function Option({ valueArr, setValueArr, value, valueStr, setValueStr }) {
  const [isCheck, setIsCheck] = useState(false);
  const optionRef = useRef(null);

  const handleCheck = useCallback(() => {
    if (valueStr !== undefined) {
      if (valueStr === value) {
        setIsCheck(false);
        setValueStr('');
      } else {
        setIsCheck(true);
        setValueStr(value);
      }
      return;
    }

    setIsCheck(!isCheck);

    if (isCheck) {
      setValueArr(valueArr.filter(el => el !== value));
    } else {
      setValueArr(valueArr.concat(value));
    }
  }, [isCheck, value, valueArr, setValueArr, valueStr, setValueStr]);

  useEffect(() => {
    if (valueStr !== undefined) {
      if (valueStr === value) {
        setIsCheck(true);
      } else {
        setIsCheck(false);
      }
      return;
    }

    if (valueArr.filter(el => el === value).length === 1) {
      setIsCheck(true);
    } else {
      setIsCheck(false);
    }
  }, [valueArr, setIsCheck, value, valueStr, setValueStr]);

  return (
    <Wrapper ref={optionRef} onClick={handleCheck} className="label-selector-option">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isCheck ? <MdLabel /> : <MdLabelOutline />}
        {value}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  cursor: pointer;
  padding-left: 15px;
  display: flex;
  align-items: center;
  height: 32px;
  font-size: 14px;
  justify-content: space-between;

  svg {
    width: 15px;
    height: 15px;
  }

  :hover {
    background: rgb(62, 62, 62);
    color: white;
  }

  :first-of-type {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:hover {
    & > div > svg {
      visibility: visible;
    }
  }
`;

export default Option;
