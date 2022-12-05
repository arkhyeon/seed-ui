import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import Hour from './Hour';
import Minute from './Minute';

function TimePickerSelection({ time, onChange, itemHeight, setInputValue, isOpen }) {
  const [value, setValue] = useState(time);
  const pickerRef = useRef(null);

  useEffect(() => {
    document.addEventListener('wheel', preventWheelEvent, { passive: false });
    return () => {
      document.removeEventListener('wheel', preventWheelEvent, { passive: false });
    };
  }, []);

  const preventWheelEvent = e => {
    if (isOpen && pickerRef.current?.contains(e.target)) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    setInputValue(value);
    onChange(value);
  }, [value]);

  const params = {
    itemHeight,
    value,
    setValue,
  };

  return (
    <TimePickerAnimationWrap>
      <TimeTitle>
        <span>시</span>
        <Colon>:</Colon>
        <span>분</span>
      </TimeTitle>
      <TimePickerSelectionWrap ref={pickerRef} style={{ height: `${itemHeight * 5}px` }}>
        <TimePickerSelectionOverlay
          style={{
            top: `${itemHeight * 2}px`,
            height: `${itemHeight}px`,
          }}
        />
        <Hour {...params} />
        <Colon>:</Colon>
        <Minute {...params} />
      </TimePickerSelectionWrap>
    </TimePickerAnimationWrap>
  );
}

const TimePickerAnimationWrap = styled.div`
  overflow: hidden;
  user-select: none;
  border-radius: 3px;
  border: 1px solid #d2d2d2;
  box-shadow: 1px 3px 3px 0 #c3c3c3;

  animation: fade-in 150ms ease-out;
  @keyframes fade-in {
    0% {
      transform: translateY(-150px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const TimeTitle = styled.div`
  width: 100%;
  height: 32px;
  background-color: #3e3e3e;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
  font-weight: bold;
`;

const TimePickerSelectionWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 110px;
  overflow: hidden;
`;

const TimePickerSelectionOverlay = styled.div`
  position: absolute;
  border-radius: 6px;
  background-color: #fb5b5b;
  pointer-events: none;
  margin: 0 5px;
  left: 0;
  right: 0;
  z-index: 1;
`;

const Colon = styled.div`
  display: flex;
  align-items: center;
  color: #f7f7f7;
  z-index: 100;
  font-weight: 600;
`;

export default TimePickerSelection;
