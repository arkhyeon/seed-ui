import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

function HourMin({ time, setTime, pickerRef, isOpen }) {
  const [hour, setHour] = useState(time.slice(0, 2));
  const [min, setMin] = useState(time.slice(3, 5));

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

  const renderHour = () => {
    const numHour = Number(hour);

    return (
      <LineWrapper onWheel={hourWheeling}>
        <Time rotate={60} onClick={e => settingHour(e.target.textContent)}>
          {numHour - 3 < 0 ? makeDoubleDigit(numHour + 21) : makeDoubleDigit(numHour - 3)}
        </Time>
        <Time rotate={40} onClick={e => settingHour(e.target.textContent)}>
          {numHour - 2 < 0 ? makeDoubleDigit(numHour + 22) : makeDoubleDigit(numHour - 2)}
        </Time>
        <Time rotate={20} onClick={e => settingHour(e.target.textContent)}>
          {numHour - 1 < 0 ? makeDoubleDigit(numHour + 23) : makeDoubleDigit(numHour - 1)}
        </Time>
        <Time className="activeTime">{hour}</Time>
        <Time rotate={-20} onClick={e => settingHour(e.target.textContent)}>
          {numHour + 1 > 23 ? makeDoubleDigit(numHour - 23) : makeDoubleDigit(numHour + 1)}
        </Time>
        <Time rotate={-40} onClick={e => settingHour(e.target.textContent)}>
          {numHour + 2 > 23 ? makeDoubleDigit(numHour - 22) : makeDoubleDigit(numHour + 2)}
        </Time>
        <Time rotate={-60} onClick={e => settingHour(e.target.textContent)}>
          {numHour + 3 > 23 ? makeDoubleDigit(numHour - 21) : makeDoubleDigit(numHour + 3)}
        </Time>
      </LineWrapper>
    );
  };

  const hourWheeling = e => {
    let currentHour = '';

    if (e.deltaY < 0) {
      currentHour = hour <= 0 ? '23' : String(Number(hour) - 1).padStart(2, '0');
    }
    if (e.deltaY > 0) {
      currentHour = hour >= 23 ? '00' : String(Number(hour) + 1).padStart(2, '0');
    }

    settingHour(currentHour);
  };

  const settingHour = currentHour => {
    setHour(currentHour);
    setTime(currentHour + time.slice(2, 5));
  };

  const renderMin = () => {
    const numMin = Number(min);

    return (
      <LineWrapper onWheel={minWheeling}>
        <Time rotate={60} onClick={e => settingMin(e.target.textContent)}>
          {numMin - 3 < 0 ? makeDoubleDigit(numMin + 57) : makeDoubleDigit(numMin - 3)}
        </Time>
        <Time rotate={40} onClick={e => settingMin(e.target.textContent)}>
          {numMin - 2 < 0 ? makeDoubleDigit(numMin + 58) : makeDoubleDigit(numMin - 2)}
        </Time>
        <Time rotate={20} onClick={e => settingMin(e.target.textContent)}>
          {numMin - 1 < 0 ? makeDoubleDigit(numMin + 59) : makeDoubleDigit(numMin - 1)}
        </Time>
        <Time className="activeTime">{min}</Time>
        <Time rotate={-20} onClick={e => settingMin(e.target.textContent)}>
          {numMin + 1 > 59 ? makeDoubleDigit(numMin - 59) : makeDoubleDigit(numMin + 1)}
        </Time>
        <Time rotate={-40} onClick={e => settingMin(e.target.textContent)}>
          {numMin + 2 > 59 ? makeDoubleDigit(numMin - 58) : makeDoubleDigit(numMin + 2)}
        </Time>
        <Time rotate={-60} onClick={e => settingMin(e.target.textContent)}>
          {numMin + 3 > 59 ? makeDoubleDigit(numMin - 57) : makeDoubleDigit(numMin + 3)}
        </Time>
      </LineWrapper>
    );
  };

  const minWheeling = e => {
    let currentMin = '';
    if (e.deltaY < 0) {
      currentMin = min <= 0 ? '59' : String(Number(min) - 1).padStart(2, '0');
    }
    if (e.deltaY > 0) {
      currentMin = min >= 59 ? '00' : String(Number(min) + 1).padStart(2, '0');
    }
    settingMin(currentMin);
  };

  const settingMin = currentMin => {
    setMin(currentMin);
    setTime(time.slice(0, 3) + currentMin);
  };

  const makeDoubleDigit = number => {
    return String(number).padStart(2, '0');
  };

  return (
    <>
      {renderHour()}
      {renderMin()}
    </>
  );
}

const LineWrapper = styled.div`
  width: 100%;
  height: 245px;
  overflow-y: scroll;
  cursor: pointer;
  top: 0;
  overscroll-behavior: contain;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  padding: 1px 0;

  &::-webkit-scrollbar {
    width: 0;
  }

  svg {
    :hover {
      cursor: pointer;
    }
  }
`;

const Time = styled.div`
  width: 50px;
  height: 35px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-weight: bold;
  &.activeTime {
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    background-color: #3e3e3e;
    color: white;
    border-radius: 3px;
  }

  ${({ rotate }) =>
    rotate &&
    css`
      transform: rotateX(${rotate}deg);
      opacity: 0.3;
      &:hover {
        background-color: palegoldenrod;
      }
    `}
`;

export default HourMin;
