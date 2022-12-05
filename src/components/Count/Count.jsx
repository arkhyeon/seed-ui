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

function Count({ value = 1, onChange = () => {}, max = 2147483647, min = 0 }) {
  const handleMinus = useCallback(() => {
    if (value - 1 < min) {
      return;
    }

    onChange(value - 1);
  }, [value, min]);

  const handlePlus = useCallback(() => {
    if (value + 1 > max) {
      return;
    }

    onChange(value + 1);
  }, [value, max]);

  const checkOnlyNum = useCallback(str => {
    const reg = /^[0-9]+$/;

    return reg.test(str);
  }, []);

  const handleChange = useCallback(
    e => {
      if (e.target.value === '') {
        onChange(min);
        return;
      }

      if (checkOnlyNum(e.target.value)) {
        if (Number(e.target.value) <= max && Number(e.target.value) >= min)
          onChange(parseInt(e.target.value, 10));

        if (Number(e.target.value) > max) {
          onChange(max);
        }
      }
    },
    [checkOnlyNum, max, min],
  );

  return (
    <Wrapper>
      <Text value={value} onChange={handleChange} className="count-text" />
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
