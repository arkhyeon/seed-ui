import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';
import { TextInput } from './components/InputComponent';

/**
 * @param {String} props.time
 * 다루고자 하는 시간
 * '00:00' 양식
 * state로 관리되는 값 이여야 함
 * default 값은 '00:00'
 * @param {Function} props.setTime
 * 시간을 관리하는 함수
 * useState를 통해 생성된 상태 관리 함수여야 함
 * default 값은 null
 * @param {String} props.svgColor
 * 아이콘들의 색상
 * default 값은 'black'
 * @param {String} props.width
 * 기본 input 태그의 너비
 * default 값은 '50px'
 * @returns
 */

function TimePicker({
  time = '00:00',
  setTime = null,
  svgColor = 'black',
  width = '50px',
  disabled = false,
}) {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  const handleOutside = e => {
    if (inputRef.current.contains(e.target)) {
      return;
    }

    if (isOpen && !pickerRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutside);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [handleOutside]);

  const handleHour = e => {
    const prevMinute = time.slice(3, 5);
    const hour = e.target.value;
    let convertedHour = '';
    const cursorIdx = e.target.selectionStart;

    for (let i = 0; i < hour.length; i++) {
      if (cursorIdx !== i) {
        convertedHour += hour[i];
      }
    }

    if (convertedHour[0] === '2' && cursorIdx === 1) {
      convertedHour = `${convertedHour[0]}0`;
    }

    if (checkHour(convertedHour)) {
      setTime(`${convertedHour}:${prevMinute}`);
    }
    setTimeout(() => {
      hourRef.current.setSelectionRange(cursorIdx, cursorIdx);
    }, 10);
  };

  const handleMinute = e => {
    const prevHour = time.slice(0, 2);
    const minute = e.target.value;
    let convertedMinute = '';
    const cursorIdx = e.target.selectionStart;

    for (let i = 0; i < minute.length; i++) {
      if (cursorIdx !== i) {
        convertedMinute += minute[i];
      }
    }

    if (checkMinute(convertedMinute)) {
      setTime(`${prevHour}:${convertedMinute}`);
    }
    setTimeout(() => {
      minuteRef.current.setSelectionRange(cursorIdx, cursorIdx);
    }, 10);
  };

  const handleInput = e => {
    const [hour, minute] = e.target.value.split(':');
    const checkDiff = false;
    let convertedHour = '';
    let convertedMinute = '';
    const cursorIdx = e.target.selectionStart;

    for (let i = 0; i < hour.length; i++) {
      if (cursorIdx !== i) {
        convertedHour += hour[i];
      }
    }

    for (let i = 0; i < minute.length; i++) {
      if (cursorIdx !== i + 3) {
        convertedMinute += minute[i];
      }
    }

    if (convertedHour[0] === '2' && cursorIdx === 1) {
      convertedHour = `${convertedHour[0]}0`;
    }

    if (!checkHour(convertedHour) || !checkMinute(convertedMinute) || checkDiff === 0) {
      setTimeout(() => {
        inputRef.current.setSelectionRange(cursorIdx, cursorIdx);
      }, 10);
    } else {
      setTime(`${convertedHour}:${convertedMinute}`);
      setTimeout(() => {
        inputRef.current.setSelectionRange(cursorIdx, cursorIdx);
      }, 10);
    }
  };

  const plusHour = () => {
    let [hour, minute] = time.split(':');
    hour = parseInt(hour, 10);

    if (hour + 1 < 10) {
      hour = `0${hour + 1}`;
    } else {
      hour += 1;
    }

    if (parseInt(hour, 10) === 24) {
      hour = '00';
    }

    setTime(`${hour}:${minute}`);
  };

  const minusHour = () => {
    let [hour, minute] = time.split(':');
    hour = parseInt(hour, 10);

    if (hour - 1 < 0) {
      hour = `23`;
    } else if (hour - 1 < 10) {
      hour = `0${hour - 1}`;
    } else {
      hour -= 1;
    }

    setTime(`${hour}:${minute}`);
  };

  const plusMinute = () => {
    let [hour, minute] = time.split(':');
    minute = parseInt(minute, 10);

    if (minute + 1 < 10) {
      minute = `0${minute + 1}`;
    } else {
      minute += 1;
    }

    if (parseInt(minute, 10) === 60) {
      minute = '00';
    }

    setTime(`${hour}:${minute}`);
  };

  const minusMinute = () => {
    let [hour, minute] = time.split(':');
    minute = parseInt(minute, 10);

    if (minute - 1 < 0) {
      minute = `59`;
    } else if (minute - 1 < 10) {
      minute = `0${minute - 1}`;
    } else {
      minute -= 1;
    }

    setTime(`${hour}:${minute}`);
  };

  const checkHour = input => {
    const reg = /^([01][0-9]|2[0-3])$/;

    return reg.test(input);
  };

  const checkMinute = input => {
    const reg = /^([0-5][0-9])$/;

    return reg.test(input);
  };

  const handleOpen = () => [setIsOpen(!isOpen)];

  return (
    <Wrapper>
      <TextInput
        value={time}
        onChange={handleInput}
        inputRef={inputRef}
        width={width}
        onClick={handleOpen}
        disabled={disabled}
      />
      {isOpen && (
        <TimeWrapper ref={pickerRef}>
          <LineWrapper svgColor={svgColor}>
            <AiOutlineCaretUp onClick={plusHour} />
            <TimeInput value={time.slice(0, 2)} onChange={handleHour} ref={hourRef} />
            <AiOutlineCaretDown onClick={minusHour} />
          </LineWrapper>
          <LineWrapper svgColor={svgColor}>
            <AiOutlineCaretUp onClick={plusMinute} />
            <TimeInput value={time.slice(3, 5)} onChange={handleMinute} ref={minuteRef} />
            <AiOutlineCaretDown onClick={minusMinute} />
          </LineWrapper>
        </TimeWrapper>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;

const TimeWrapper = styled.div`
  position: absolute;
  border: 1px solid black;
  margin-top: 4px;
  border-radius: 4px;
  z-index: 80;

  display: flex;
  padding: 4px;
  background: white;
`;

const LineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  cursor: pointer;

  svg {
    color: ${({ svgColor }) => svgColor};
    :hover {
      cursor: pointer;
    }
  }
`;

const TimeInput = styled.input`
  width: 36px;
  text-align: center;
`;
export default TimePicker;
