import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { TextInput } from '../../components/InputComp/InputComponent';
import HourMin from './component/HourMin';

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
 * @param {Boolean} props.disabled
 * input box를 수정할 수 있는 지 여부
 * default 값은 false
 * @returns {JSX.Element} TimePikcer Component
 */
function TimePicker({ time = '00:00', setTime = null, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const pickerRef = useRef(null);

  const handleOutside = useCallback(
    e => {
      if (inputRef.current.contains(e.target)) {
        return;
      }

      if (isOpen && !pickerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    },
    [isOpen],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [handleOutside]);

  const handleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <Wrapper>
      <TextInput
        value={time}
        inputRef={inputRef}
        onClick={handleOpen}
        disabled={disabled}
        className="time-picker-input"
        readOnly
      />
      {isOpen && !disabled && (
        <TimeWrapper ref={pickerRef}>
          <HourMin time={time} setTime={setTime} pickerRef={pickerRef} isOpen={isOpen} />
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
  margin-top: 4px;
  border-radius: 3px;
  z-index: 80;

  display: flex;
  background: white;
  box-shadow: 1px 1px 3px 0 #d2d2d2;
`;

export default TimePicker;
