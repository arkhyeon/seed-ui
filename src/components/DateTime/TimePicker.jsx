import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import useSeedFloating from '../../common/useSeedFloating';
import { FLOATING_PROP } from '../../common/floating';
import TimePickerSelection from './timeComponents/TimePickerSelection';
import { TextInput } from '../InputComp/InputComponent';

function TimePicker({ time = '00:00', itemHeight = 32, onChange = () => {}, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(time);

  // 시간 선택 위치: Floating UI(포털+flip). 화면 하단/스크롤에서 안 잘림.
  const { refs, floatingStyles } = useSeedFloating(isOpen, {
    placement: 'bottom-start',
    gap: 3,
    clampHeight: false,
  });

  useEffect(() => {
    setInputValue(time);
  }, [time]);

  return (
    <Wrapper ref={refs.setReference}>
      <TextInput
        value={inputValue === null ? '' : inputValue}
        readOnly
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen &&
        !disabled &&
        createPortal(
          <TimeWrap ref={refs.setFloating} {...FLOATING_PROP} style={floatingStyles}>
            <TimeWrapOverlay onClick={() => setIsOpen(!isOpen)} />
            <TimePickerSelection
              onChange={onChange}
              itemHeight={itemHeight}
              setInputValue={setInputValue}
              time={time}
              isOpen={isOpen}
            />
          </TimeWrap>,
          document.body,
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
  z-index: 10000;
  background-color: var(--seed-surface);
`;

const TimeWrapOverlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export default TimePicker;
