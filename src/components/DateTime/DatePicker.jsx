import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { TextInput } from '../InputComp/InputComponent';
import Year from './dateComponents/Year';
import Month from './dateComponents/Month';
import Day from './dateComponents/Day';
import { formatDate } from './timeComponents/PickerCommonFunc';
import SelectDays from './dateComponents/SelectDays';

/**
 * @param {Date} param.date
 * 선택하고자 하는 날짜, useState로 관리하는 값이여야 함
 * default 값은 new Date()
 * @param {Function} param.setDate
 * 날짜를 바꾸는 함수, setState 함수여야 함.
 * default 값은 null
 * @param {String} param.disabled
 * 날짜 변경 금지
 * @returns {JSX.Element} datePicker Component
 */

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function DatePicker({
  date = new Date(),
  setDate = null,
  disabled = false,
  startDate = new Date('2000-01-01'),
  endDate = new Date('2040-12-31'),
}) {
  const pickerRef = useRef(null);
  const [dateViewed, setDateViewed] = useState(date);
  const [inputValue, setInputValue] = useState(formatDate(date));
  const [isOpen, setIsOpen] = useState(false);

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth() + 1;
  const startDay = startDate.getDate();
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth() + 1;
  const endDay = endDate.getDate();

  useEffect(() => setInputValue(formatDate(date)), [date, startDate, endDate]);

  const handleClose = useCallback(
    ({ target }) => {
      if (!pickerRef.current.contains(target)) {
        setIsOpen(false);
      }
    },
    [setIsOpen],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClose);
    return () => document.removeEventListener('mousedown', handleClose);
  }, [handleClose]);

  const handlePrev = () => {
    const prevDate = new Date(dateViewed);
    prevDate.setMonth(prevDate.getMonth() - 1);

    if (startYear === prevDate.getFullYear() && startMonth > prevDate.getMonth() + 1) {
      return;
    }

    if (startYear > prevDate.getFullYear()) {
      return;
    }
    console.log(prevDate);
    setDateViewed(prevDate);
  };

  const handleNext = () => {
    const nextDate = new Date(dateViewed);
    nextDate.setMonth(nextDate.getMonth() + 1);

    if (endYear === nextDate.getFullYear() && endMonth < nextDate.getMonth() + 1) {
      return;
    }

    if (endYear < nextDate.getFullYear()) {
      return;
    }

    setDateViewed(nextDate);
  };

  return (
    <Wrapper ref={pickerRef}>
      <TextInput
        className="date-picker-input"
        value={inputValue}
        onClick={() => setIsOpen(open => !open)}
        readOnly
        disabled={disabled}
      />
      {isOpen && (
        <PickerWrapper className="date-picker">
          <PickerHeader className="date-picker-head">
            <Button onClick={handlePrev} className="date-picker-button date-picker-button-left">
              <AiOutlineLeft />
            </Button>
            <SelectWrapper>
              <Year
                startYear={startYear}
                startMonth={startMonth}
                endYear={endYear}
                endMonth={endMonth}
                dateViewed={dateViewed}
                setDateViewed={setDateViewed}
              />
              <Month
                startYear={startYear}
                startMonth={startMonth}
                endYear={endYear}
                endMonth={endMonth}
                dateViewed={dateViewed}
                setDateViewed={setDateViewed}
              />
            </SelectWrapper>
            <Button onClick={handleNext} className="date-picker-button date-picker-button-right">
              <AiOutlineRight />
            </Button>
          </PickerHeader>
          <WeekWrapper>
            {WEEK_DAYS.map(week => (
              <li key={`weekday-${week}`} className="date-picker-week">
                {week}
              </li>
            ))}
          </WeekWrapper>
          <Day
            startYear={startYear}
            startMonth={startMonth}
            startDay={startDay}
            endYear={endYear}
            endMonth={endMonth}
            endDay={endDay}
            dateViewed={dateViewed}
            setDateViewed={setDateViewed}
            date={date}
            setDate={setDate}
            setIsOpen={setIsOpen}
          />
          <SelectDays
            date={date}
            setDate={setDate}
            setDateViewed={setDateViewed}
            startDate={startDate}
            endDate={endDate}
          />
        </PickerWrapper>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;

const PickerWrapper = styled.div`
  position: absolute;
  margin-top: 4px;
  background: white;
  width: 250px !important;
  z-index: 80;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  font-size: 15px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;

  -webkit-touch-callout: none;
  user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
`;

const PickerHeader = styled.div`
  height: 40px;
  width: 100% !important;
  background: #3e3e3e;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const SelectWrapper = styled.div`
  width: auto !important;
  display: flex;
  gap: 5px;

  & div {
    width: 75px !important;

    &:last-of-type {
      width: 55px !important;
    }
    & input {
      cursor: default;
      padding: 3.5px 7px;
    }

    & li {
      padding: 0.375rem 1.25rem 0.375rem 0.75rem;
    }
  }
`;

const Button = styled.div`
  width: 25px !important;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;

  svg {
    width: 25px;
    height: 25px;
  }
`;

const WeekWrapper = styled.ul`
  display: flex;
  width: 100% !important;
  background: #3e3e3e;
  color: white;
  justify-content: center;

  & li {
    font-weight: bolder;
    width: 32px !important;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default DatePicker;
