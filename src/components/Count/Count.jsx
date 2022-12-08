import React, { useState, useLayoutEffect, useCallback, useEffect, useRef } from 'react';
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

const clickHolding = btnEl => {
  let timerId;
  const DURATION = 150;

  const onMouseDown = e => {
    if (e.button === 0 && btnEl) {
      timerId = setInterval(() => {
        btnEl.click();
      }, DURATION);
    }
  };

  const clearTimer = () => {
    if (timerId) {
      clearInterval(timerId);
    }
  };

  btnEl.addEventListener('mousedown', onMouseDown);
  btnEl.addEventListener('mouseup', clearTimer);
  btnEl.addEventListener('mouseout', clearTimer);
  btnEl.addEventListener('contextmenu', clearTimer);

  return () => {
    btnEl.removeEventListener('mousedown', onMouseDown);
    btnEl.removeEventListener('contextmenu', clearTimer);
    btnEl.removeEventListener('mouseup', clearTimer);
    btnEl.removeEventListener('mouseout', clearTimer);
  };
};

function Count({ value = 1, onChange = () => {}, max = 2147483647, min = 0 }) {
  const btnUpRef = useRef(null);
  const btnDownRef = useRef(null);
  const counter = useRef(value);

  useLayoutEffect(() => {
    const removeListenerUp = clickHolding(btnUpRef.current);
    const removeListenerDown = clickHolding(btnDownRef.current);
    return () => {
      removeListenerUp();
      removeListenerDown();
    };
  }, []);

  useLayoutEffect(() => {
    counter.current = value;
  }, [value]);

  const clickPlus = () => {
    if (max <= counter.current) return;
    counter.current++;
    onChange(counter.current);
  };

  const clickMinus = () => {
    if (min >= counter.current) return;
    counter.current--;
    onChange(counter.current);
  };

  const checkOnlyNum = useCallback(str => {
    const reg = /^[0-9]+$/;

    return reg.test(str);
  }, []);

  const handleChange = useCallback(
    e => {
      const targetValue = Number(e.target.value);
      if (!targetValue) {
        onChange(min);
        counter.current = min;
        return;
      }

      if (checkOnlyNum(e.target.value)) {
        if (targetValue <= max && targetValue >= min) {
          onChange(targetValue);
          counter.current = targetValue;
        }

        if (targetValue > max) {
          onChange(max);
          counter.current = max;
        }
      }
    },
    [checkOnlyNum, max, min],
  );

  return (
    <Wrapper>
      <Text value={value} onChange={handleChange} className="count-text" />
      <IconWrap>
        <Icon ref={btnUpRef} onClick={clickPlus} className="count-btn count-btn-plus">
          <AiOutlinePlus />
        </Icon>
        <Icon ref={btnDownRef} onClick={clickMinus} className="count-btn count-btn-minus">
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
