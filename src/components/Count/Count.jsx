import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

const clickHolding = btnEl => {
  let timerId;
  const DURATION = 150;

  const onMouseDown = e => {
    if (e.button === 0 && btnEl) {
      timerId = setInterval(() => btnEl.click(), DURATION);
    }
  };

  const clearTimer = () => clearInterval(timerId);

  btnEl.addEventListener('mousedown', onMouseDown);
  btnEl.addEventListener('mouseup', clearTimer);
  btnEl.addEventListener('mouseout', clearTimer);
  btnEl.addEventListener('contextmenu', clearTimer);

  return () => {
    btnEl.removeEventListener('mousedown', onMouseDown);
    btnEl.removeEventListener('mouseup', clearTimer);
    btnEl.removeEventListener('mouseout', clearTimer);
    btnEl.removeEventListener('contextmenu', clearTimer);
  };
};

function Count({ value = 1, onChange = () => {}, max = 2147483647, min = 0 }) {
  const btnUpRef = useRef(null);
  const btnDownRef = useRef(null);
  const [inputValue, setInputValue] = useState(String(value));

  useLayoutEffect(() => {
    setInputValue(String(value));
  }, [value]);

  useLayoutEffect(() => {
    const removeUp = clickHolding(btnUpRef.current);
    const removeDown = clickHolding(btnDownRef.current);
    return () => {
      removeUp();
      removeDown();
    };
  }, []);

  const clamp = useCallback(num => Math.min(max, Math.max(min, num)), [max, min]);

  const clickPlus = () => {
    const next = clamp((Number(inputValue) || min) + 1);
    setInputValue(String(next));
    onChange(next);
  };

  const clickMinus = () => {
    const next = clamp((Number(inputValue) || min) - 1);
    setInputValue(String(next));
    onChange(next);
  };

  const handleChange = e => {
    const val = e.target.value;

    if (val === '') {
      setInputValue('');
      return;
    }

    if (!/^[0-9]+$/.test(val)) return;

    const num = Number(val);

    if (num > max) {
      setInputValue(String(max)); // ✅ max 초과면 max로
      onChange(max);
      return;
    }

    setInputValue(val);
    onChange(num);
  };

  const handleBlur = () => {
    const num = Number(inputValue);
    if (!inputValue || num < min) {
      // ✅ 빈값이거나 min 미만이면 min으로
      setInputValue(String(min));
      onChange(min);
    }
  };

  const handleFocus = e => e.target.select();

  const handleKeyDown = e => {
    if (e.key === 'Enter') handleBlur();
  };

  return (
    <Wrapper>
      <Text
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        className="count-text"
      />
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
  width: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  position: relative;

  &:hover > div {
    display: block;
  }
`;

const IconWrap = styled.div`
  position: absolute;
  right: 1px;
  display: none;
`;

const Text = styled.input`
  width: 100%;
  display: block;
  border: 1px solid #d2d2d2;
  border-radius: 5px;
  color: #212529;
  font-size: 14px;
  padding: 8px 16px 6px 12px;
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
