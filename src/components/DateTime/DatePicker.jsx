import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { css } from '@emotion/react';
import _ from 'lodash';
import { FaMinus, FaPlus } from 'react-icons/all';
import { TextInput } from '../InputComp/InputComponent';
import DataList from '../InputComp/DataList';

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

const TIME_ZONE = 3240 * 10000;
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function DatePicker({
  date = new Date(),
  setDate = null,
  disabled = false,
  startDate,
  endDate,
  yearStep = 40,
}) {
  const inputRef = useRef(null);
  const pickerRef = useRef(null);
  const [dateViewed, setDateViewed] = useState(date);
  const [inputValue, setInputValue] = useState(
    new Date(+date + TIME_ZONE).toISOString().split('T')[0],
  );
  const [isOpen, setIsOpen] = useState(false);

  const startYear = startDate?.getFullYear() ? startDate.getFullYear() : 2000;
  const startMonth = startDate?.getMonth() ? startDate.getMonth() + 1 : 1;
  const startDay = startDate?.getDate() ? startDate.getDate() : 0;
  const endYear = endDate?.getFullYear() ? endDate.getFullYear() : startYear + yearStep;
  const endMonth = endDate?.getMonth() + 1 ? endDate.getMonth() + 1 : 12;
  const endDay = endDate?.getDate() ? endDate.getDate() : 28;

  useEffect(() => {
    setInputValue(new Date(+date + TIME_ZONE).toISOString().split('T')[0]);
    setDateViewed(date);
  }, [date, startDate, endDate]);

  const handleClose = useCallback(
    e => {
      if (isOpen && !pickerRef.current.contains(e.target) && !inputRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    },
    [setIsOpen, isOpen],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClose);

    return () => {
      document.removeEventListener('mousedown', handleClose);
    };
  }, [handleClose]);

  const handlePrev = () => {
    const prevDate = new Date(dateViewed.getTime());
    prevDate.setMonth(prevDate.getMonth() - 1);

    if (startYear === prevDate.getFullYear() && startMonth > prevDate.getMonth() + 1) {
      return;
    }

    if (startYear > prevDate.getFullYear()) {
      return;
    }

    setDateViewed(prevDate);
  };

  const handleNext = () => {
    const nextDate = new Date(dateViewed.getTime());
    nextDate.setMonth(nextDate.getMonth() + 1);

    if (endYear === nextDate.getFullYear() && endMonth < nextDate.getMonth() + 1) {
      return;
    }

    if (endYear < nextDate.getFullYear()) {
      return;
    }

    setDateViewed(nextDate);
  };

  const handleDayClick = useCallback(
    e => {
      if (e.target.textContent === '') {
        return;
      }

      const changedDate = new Date(
        `${dateViewed.getFullYear()}-${dateViewed.getMonth() + 1}-${parseInt(
          e.target.textContent,
        )}`,
      );

      setDate(changedDate);
      setDateViewed(changedDate);

      setIsOpen(false);
    },
    [dateViewed, setDate],
  );

  const renderDays = useCallback(() => {
    const year = dateViewed.getFullYear();
    const month = dateViewed.getMonth();

    let startEmptyDays = new Date(year, month, 1).getDay();
    if (startEmptyDays === 7) {
      startEmptyDays = 0;
    }
    const mainDays = new Date(year, month + 1, 0).getDate();
    const days = [];

    days.push(...Array(startEmptyDays).fill(''));
    days.push(..._.range(1, mainDays + 1));
    const endEmptyDays = 7 - (days.length % 7) === 7 ? 0 : 7 - (days.length % 7);
    days.push(...Array(endEmptyDays).fill(''));

    const isSameYM = date.getFullYear() === year && date.getMonth() === month;
    const isStartSameYM = startYear === year && startMonth === month + 1;
    const isEndSameYM = endYear === year && endMonth === month + 1;
    const selectedDate = date.getDate();

    return (
      <DayWrapper>
        {days.map((day, idx) => {
          const cantSelected = (isStartSameYM && startDay > day) || (isEndSameYM && endDay < day);
          return (
            <Day
              className={
                isSameYM && day === selectedDate ? 'selected-day day' : 'non-selected-day day'
              }
              key={`day-${idx}`}
              onClick={cantSelected ? null : handleDayClick}
              day={day}
              date={date}
              dateViewed={dateViewed}
              sdt={cantSelected}
            >
              {day}
            </Day>
          );
        })}
      </DayWrapper>
    );
  }, [date, dateViewed, handleDayClick, startDate, endDate]);

  const changeYear = useCallback(
    value => {
      const dupDate = new Date(dateViewed);
      dupDate.setFullYear(value);

      if (startYear === value) {
        dupDate.setMonth(startMonth - 1);
      } else if (endYear === value) {
        dupDate.setMonth(endMonth - 1);
      }

      setDateViewed(dupDate);
    },
    [dateViewed],
  );

  const renderYear = useCallback(() => {
    const temp = Array(endYear - startYear + 1)
      .fill(startYear)
      .map((x, y) => x + y);

    return (
      <DataList
        valueList={temp}
        setData={changeYear}
        select
        defaultValue={dateViewed.getFullYear()}
        height="200px"
      />
    );
  }, [changeYear, date, startDate, endDate]);

  const changeMonth = useCallback(
    value => {
      const dupDate = new Date(dateViewed);
      dupDate.setMonth(value - 1);
      setDateViewed(dupDate);
    },
    [dateViewed],
  );

  const renderMonth = useCallback(() => {
    const month = [];
    if (startYear === dateViewed.getFullYear()) {
      month.push(..._.range(startMonth, 13));
    } else if (endYear === dateViewed.getFullYear()) {
      month.push(..._.range(1, endMonth + 1));
    } else {
      month.push(..._.range(1, 13));
    }

    return (
      <DataList
        valueList={month}
        setData={changeMonth}
        select
        defaultValue={dateViewed.getMonth() + 1}
        height="200px"
      />
    );
  }, [changeMonth, date, startDate, endDate]);

  return (
    <Wrapper>
      <TextInput
        className="date-picker-input"
        ref={inputRef}
        value={inputValue}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        readOnly
        disabled={disabled}
      />
      {isOpen && (
        <PickerWrapper ref={pickerRef}>
          <PickerHeader className="date-picker-head">
            <Button onClick={handlePrev} className="date-picker-button date-picker-button-left">
              <AiOutlineLeft />
            </Button>
            <SelectWrapper>
              {renderYear()}
              {renderMonth()}
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
          {renderDays()}
          <SelectDaysWrap>
            <div>
              10일 전
              <span>
                <FaPlus />
              </span>
              <span>
                <FaMinus />
              </span>
            </div>
            <div>1개월 전</div>
            <div>6개월 전</div>
            <div>1년 전</div>
          </SelectDaysWrap>
          <SelectDaysWrap>
            <div>10일 후</div>
            <div>1개월 후</div>
            <div>6개월 후</div>
            <div>1년 후</div>
          </SelectDaysWrap>
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

const DayWrapper = styled.ul`
  width: 100% !important;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 8px;

  .selected-day {
    background: #fb5b5b !important;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    color: white;
  }
`;

const Day = styled.li`
  width: 32px !important;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  margin-top: 1px;

  ${({ day }) => {
    return (
      day &&
      css`
        &:hover {
          background-color: #eceff1;
        }
        cursor: pointer;
      `
    );
  }};

  ${({ sdt, day }) => {
    return (
      day &&
      sdt &&
      css`
        cursor: default;
        background-color: #ebebeb !important;
      `
    );
  }}
`;

const SelectDaysWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 8px;
  font-size: 14px;

  & div {
    position: relative;
    display: flex;
    color: white;
    background-color: #3e3e3e;
    border-radius: 3px;
    padding: 2px 4px;
    cursor: pointer;
  }

  & div:hover span {
    display: block;
  }

  & span {
    width: 50%;
    position: absolute;
    //display: none;
    text-align: center;
    background-color: #3e3e3e;
  }

  & span:nth-child(2) {
    left: 50%;
    //border-left: 1px solid #ebebeb;
  }
`;

export default DatePicker;
