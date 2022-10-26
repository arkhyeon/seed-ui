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
      <Icon onClick={handleMinus} className="count-btn count-btn-minus">
        <AiOutlineMinus />
      </Icon>
      <div style={{ textAlign: 'center' }}>
        <Text value={cnt} onChange={handleChange} className="count-text" />
      </div>
      <Icon onClick={handlePlus} className="count-btn count-btn-plus">
        <AiOutlinePlus />
      </Icon>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
`;

const Text = styled.input`
  display: block;
  margin: auto;
  border: 1px solid #bdbdbd;
  border-radius: 5px;
  color: #212529;
  font-size: 14px;
  margin-right: 10px;
  padding: 8px 6px 6px 6px;
  width: 50px;
  text-align: center;
`;

const Icon = styled.div`
  display: flex;
  border: 1px solid #bdbdbd;
  border-radius: 5px;
  color: #212529;
  font-size: 14px;
  padding: 8px 6px 6px 6px;
  margin-right: 10px;
  cursor: pointer;
`;

export default Count;
