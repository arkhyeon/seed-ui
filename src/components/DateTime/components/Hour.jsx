import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { initNumberList } from './PickerCommonFunc';

function Hour({ itemHeight, value, setValue }) {
  const [hours, setHours] = useState(initNumberList(itemHeight, 24, parseInt(value.slice(0, 2))));
  const mainListRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(null);
  const [firstCursorPosition, setFirstCursorPosition] = useState(null);
  const [currentTranslatedValue, setCurrentTranslatedValue] = useState(
    parseInt(
      initNumberList(itemHeight, 24, parseInt(value.slice(0, 2))).filter(
        item => item.number === value.slice(0, 2) && item.selected === true,
      )[0].translatedValue,
    ),
  );
  const [startCapture, setStartCapture] = useState(false);
  const [showFinalTranslate, setShowFinalTranslate] = useState(false);
  const [dragStartTime, setDragStartTime] = useState(null);
  const [dragEndTime, setDragEndTime] = useState(null);
  const [dragType, setDragType] = useState(null);
  const [dragDirection, setDragDirection] = useState(null);

  const handleMouseDown = e => {
    setShowFinalTranslate(false);
    setFirstCursorPosition(e.clientY);
    setStartCapture(true);
    setDragStartTime(performance.now());
  };

  const handleTouchStart = e => {
    setShowFinalTranslate(false);
    setFirstCursorPosition(e.targetTouches[0].clientY);
    setStartCapture(true);
    setDragStartTime(performance.now());
  };

  const handleMouseUp = e => {
    setStartCapture(false);
    setCurrentTranslatedValue(prev => prev + cursorPosition);
    setShowFinalTranslate(true);
    setDragEndTime(performance.now());
    if (performance.now() - dragStartTime <= 100) {
      setDragType('fast');
    } else {
      setDragType('slow');
    }
    if (cursorPosition < 0) {
      setDragDirection('down');
    } else {
      setDragDirection('up');
    }
  };

  const handleMouseLeave = e => {
    setStartCapture(false);
    setCurrentTranslatedValue(prev => prev + cursorPosition);
    setShowFinalTranslate(true);
    setDragEndTime(performance.now());
    if (performance.now() - dragStartTime <= 100) {
      setDragType('fast');
    } else {
      setDragType('slow');
    }

    if (cursorPosition < 0) {
      setDragDirection('down');
    } else {
      setDragDirection('up');
    }
  };

  const handleMouseMove = e => {
    if (startCapture) {
      setCursorPosition(e.clientY - firstCursorPosition);
    } else {
      setCursorPosition(0);
    }
  };

  const handleTouchMove = e => {
    if (startCapture) {
      setCursorPosition(e.targetTouches[0].clientY - firstCursorPosition);
    } else {
      setCursorPosition(0);
    }
  };

  // preview translation
  useEffect(() => {
    if (startCapture) {
      mainListRef.current.style.transform = `translateY(${
        currentTranslatedValue + cursorPosition
      }px)`;
    }
  }, [cursorPosition]);

  // final translation here
  useEffect(() => {
    if (showFinalTranslate) {
      if (dragEndTime - dragStartTime <= 100 && cursorPosition !== 0) {
        let currentValue;
        if (dragDirection === 'down') {
          currentValue = currentTranslatedValue - (120 / (dragEndTime - dragStartTime)) * 100;
        } else if (dragDirection === 'up') {
          currentValue = currentTranslatedValue + (120 / (dragEndTime - dragStartTime)) * 100;
        }
        let finalValue = Math.round(currentValue / itemHeight) * itemHeight;
        if (finalValue < itemHeight * -69) finalValue = itemHeight * -69;
        if (finalValue > itemHeight * 2) finalValue = itemHeight * 2;

        mainListRef.current.style.transform = `translateY(${finalValue}px)`;
        setCurrentTranslatedValue(finalValue);
      }
      if (dragEndTime - dragStartTime > 100 && cursorPosition !== 0) {
        let finalValue = Math.round(currentTranslatedValue / itemHeight) * itemHeight;
        if (finalValue < itemHeight * -69) finalValue = itemHeight * -69;
        if (finalValue > itemHeight * 2) finalValue = itemHeight * 2;

        mainListRef.current.style.transform = `translateY(${finalValue}px)`;
        setCurrentTranslatedValue(finalValue);
      }
      setCursorPosition(0);
    }
  }, [showFinalTranslate]);

  // return to default position after drag end (handleTransitionEnd)
  const handleTransitionEnd = e => {
    initNumberList(itemHeight, 24).map(item => {
      if (parseInt(item.translatedValue) === currentTranslatedValue) {
        setValue(prev => `${item.number}:${prev.slice(3, 6)}`);
        setHours(() => {
          const newValue = initNumberList(itemHeight, 24).map(hour => {
            if (hour.number == item.number && hour.translatedValue == currentTranslatedValue) {
              return {
                ...hour,
                selected: true,
              };
            }
            return hour;
          });
          return newValue;
        });
      }
    });
  };

  // handle click to select number
  const handleClickToSelect = e => {
    if (cursorPosition === 0) {
      setCurrentTranslatedValue(parseInt(e.target.dataset.translatedValue));
    }
  };

  const isFastCondition = showFinalTranslate && dragType === 'fast';
  const isSlowCondition = showFinalTranslate && dragType === 'slow';

  const handleWheelScroll = e => {
    if (e.deltaY > 0) {
      if (currentTranslatedValue < itemHeight * 2) {
        setCurrentTranslatedValue(prev => prev + itemHeight);
      }
    } else if (currentTranslatedValue > itemHeight * -69) {
      setCurrentTranslatedValue(prev => prev - itemHeight);
    }
  };

  return (
    <TimePickerItemWrap
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ height: itemHeight * 5 }}
      onWheel={handleWheelScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      <TimePickerItemAnimation
        ref={mainListRef}
        isFastCondition={isFastCondition}
        isSlowCondition={isSlowCondition}
        onTransitionEnd={handleTransitionEnd}
        style={{ transform: `translateY(${currentTranslatedValue}px)` }}
      >
        {hours.map(({ translatedValue, number, selected }) => (
          <HourWrap key={translatedValue + number} style={{ height: `${itemHeight}px` }}>
            <HourNum
              selected={selected}
              onClick={handleClickToSelect}
              data-translated-value={translatedValue}
            >
              {number}
            </HourNum>
          </HourWrap>
        ))}
      </TimePickerItemAnimation>
    </TimePickerItemWrap>
  );
}

const TimePickerItemWrap = styled.div`
  width: 50px;
  overflow: hidden;
  z-index: 100;
  margin-left: 5px;
`;

const TimePickerItemAnimation = styled.div`
  ${({ isFastCondition }) => {
    return (
      isFastCondition &&
      css`
        transition: transform 700ms cubic-bezier(0.13, 0.67, 0.01, 0.94);
      `
    );
  }}
  ${({ isSlowCondition }) => {
    return (
      isSlowCondition &&
      css`
        transition: transform 600ms cubic-bezier(0.13, 0.67, 0.01, 0.94);
      `
    );
  }}
`;

const HourWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  transition: all 100ms linear;
`;

const HourNum = styled.div`
  width: fit-content;
  height: 100%;
  transition: all 100ms linear;
  cursor: pointer;
  border-radius: 7px;
  line-height: 35px;
  text-align: center;
  display: flex;
  justify-content: end;
  align-items: center;
  font-size: 14px;
  color: #666;
  padding: 0 10px;

  &:hover {
    background-color: #eceff1;
  }

  ${({ selected }) => {
    return (
      selected &&
      css`
        color: #f7f7f7;
        font-size: 16px;
        background: transparent !important;
      `
    );
  }}
`;

export default Hour;
