import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import TimePickerSelection from './components/TimePickerSelection';
import { TextInput } from '../components/InputComponent';

function TimePicker({ time = '00:00', itemHeight = 32, onChange = () => {}, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(time);

  useEffect(() => {
    setInputValue(time);
  }, [time]);


  return (
    <Wrapper>
      <TextInput
        value={inputValue === null ? '' : inputValue}
        readOnly
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && !disabled && (
        <TimeWrap>
          <TimeWrapOverlay onClick={() => setIsOpen(!isOpen)} />
          <TimePickerSelection
            onChange={onChange}
            itemHeight={itemHeight}
            setInputValue={setInputValue}
            time={time}
            isOpen={isOpen}
          />
        </TimeWrap>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;

const TimeWrap = styled.div`
  display: flex;
  justify-content: start;
  align-items: flex-end;
  z-index: 99998;
  margin-top: 3px;
  position: absolute;
  background-color: white;
`;

const TimeWrapOverlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export default TimePicker;
