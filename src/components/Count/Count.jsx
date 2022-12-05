import React, { useState, useLayoutEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

/**
 * @param {Number} params.initialValue
 * inputbox에 가장 처음 표기될 숫자
 * 기본 값은 1
 * @param {Number} params.max
 * 설정할 수 있는 숫자의 최댓값
 * 기본 값은 99
 * @param {Number} params.min
 * 설정할 수 있는 숫자의 최솟값
 * 기본 값은 0
 * @returns {JSXComponent} Count Component
 */

function Count({ initialValue = 1, max = 99, min = 0 }) {
  const [cnt, setCnt] = useState(1);

  useLayoutEffect(() => {
    setCnt(initialValue);
  }, [initialValue]);

  const handleMinus = useCallback(() => {
    if (cnt - 1 < min) {
      return;
    }

    setCnt(cnt - 1);
  }, [cnt, min]);

  const handlePlus = useCallback(() => {
    if (cnt + 1 > max) {
      return;
    }

    setCnt(cnt + 1);
  }, [cnt, max]);

  const checkOnlyNum = useCallback(str => {
    const reg = /^[0-9]+$/;

    return reg.test(str);
  }, []);

  const handleChange = useCallback(
    e => {
      if (e.target.value === '') {
        setCnt(min);
        return;
      }

      if (checkOnlyNum(e.target.value)) {
        if (Number(e.target.value) <= max && Number(e.target.value) >= min)
          setCnt(parseInt(e.target.value, 10));

        if (Number(e.target.value) > max) {
          setCnt(max);
        }
      }
    },
    [checkOnlyNum, max, min],
  );

  return (
    <Wrapper>
      <Text value={cnt} onChange={handleChange} className="count-text" />
      <IconWrap>
        <Icon onClick={handlePlus} className="count-btn count-btn-plus">
          <AiOutlinePlus />
        </Icon>
        <Icon onClick={handleMinus} className="count-btn count-btn-minus">
          <AiOutlineMinus />
        </Icon>
      </IconWrap>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  position: relative;
`;

const IconWrap = styled.div`
  position: absolute;
  right: 1px;
`;

const Text = styled.input`
  display: block;
  border: 1px solid #d2d2d2;
  border-radius: 5px;
  color: #212529;
  font-size: 14px;
  padding: 8px 16px 6px 12px;
  width: 50px;
`;

const Icon = styled.div`
  display: flex;
  color: white;
  font-size: 14px;
  cursor: pointer;
  padding: 0 6px;
  background-color: #3e3e3e;

  &.count-btn-plus {
    border-radius: 0 4px 0 0;
  }

  &.count-btn-minus {
    border-radius: 0 0 4px 0;
    margin-top: 2px;
  }

  & svg path {
    stroke-width: 70px;
  }
`;

export default Count;
