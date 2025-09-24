import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from '@emotion/styled';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import _ from 'lodash';
import { css } from '@emotion/react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { TextInput } from '../InputComp/InputComponent';
import DataList from '../InputComp/DataList';
import { addDays, addMonths, arrayRange, formatDate } from './timeComponents/PickerCommonFunc';

const DatePickerContext = createContext(null);

function useDatePicker() {
  const context = useContext(DatePickerContext);
  if (!context) {
    throw new Error('useDatePicker must be used within a DatePickerProvider');
  }
  return context;
}

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function Year() {
  const { dateViewed, setDateViewed, startYear, endYear, startMonth, endMonth } = useDatePicker();

  const viewedYear = dateViewed.getFullYear();

  const yearRange = useMemo(() => {
    const range = arrayRange(endYear - startYear + 1, startYear);
    if (!range.includes(viewedYear)) {
      range.push(viewedYear);
      range.sort((a, b) => a - b);
    }
    return range;
  }, [startYear, endYear, viewedYear]);

  const changeYear = useCallback(
    value => {
      const tempDate = new Date(dateViewed);
      tempDate.setFullYear(value);

      if (startYear === value && tempDate.getMonth() < startMonth - 1) {
        tempDate.setMonth(startMonth - 1);
      } else if (endYear === value && tempDate.getMonth() > endMonth - 1) {
        tempDate.setMonth(endMonth - 1);
      }

      setDateViewed(tempDate);
    },
    [dateViewed, endMonth, endYear, setDateViewed, startMonth, startYear],
  );

  return (
    <DataList
      valueList={yearRange}
      setData={changeYear}
      select
      defaultValue={viewedYear}
      height="200px"
    />
  );
}

function Month() {
  const { dateViewed, setDateViewed, startYear, endYear, startMonth, endMonth } = useDatePicker();

  const viewedYear = dateViewed.getFullYear();
  const viewedMonth = dateViewed.getMonth() + 1;

  const changeMonth = useCallback(
    value => {
      const dupDate = new Date(dateViewed);
      dupDate.setMonth(value - 1);
      setDateViewed(dupDate);
    },
    [dateViewed, setDateViewed],
  );

  const monthRange = useMemo(() => {
    let range;
    if (startYear === viewedYear) {
      range = arrayRange(12 - startMonth + 1, startMonth);
    } else if (endYear === viewedYear) {
      range = arrayRange(endMonth, 1);
    } else {
      range = arrayRange(12, 1);
    }

    if (!range.includes(viewedMonth)) {
      range.push(viewedMonth);
      range.sort((a, b) => a - b);
    }
    return range;
  }, [viewedYear, viewedMonth, startYear, startMonth, endYear, endMonth]);

  return (
    <DataList
      valueList={monthRange}
      setData={changeMonth}
      select
      defaultValue={viewedMonth}
      height="200px"
    />
  );
}

function Day() {
  const {
    date,
    setDate,
    dateViewed,
    setDateViewed,
    setIsOpen,
    startYear,
    startMonth,
    startDay,
    endYear,
    endMonth,
    endDay,
  } = useDatePicker();

  const handleDayClick = useCallback(
    day => {
      if (day === '') return;

      const changedDate = new Date(dateViewed.getFullYear(), dateViewed.getMonth(), day);

      setDate(changedDate);
      setDateViewed(changedDate);
      setIsOpen(false);
    },
    [dateViewed, setDate, setDateViewed, setIsOpen],
  );

  const dayRange = useMemo(() => {
    const year = dateViewed.getFullYear();
    const month = dateViewed.getMonth();
    const startEmptyDays = new Date(year, month, 1).getDay();
    const mainDays = new Date(year, month + 1, 0).getDate();
    const days = [...Array(startEmptyDays).fill(''), ..._.range(1, mainDays + 1)];
    const endEmptyDays = 7 - (days.length % 7) === 7 ? 0 : 7 - (days.length % 7);
    days.push(...Array(endEmptyDays).fill(''));
    return days;
  }, [dateViewed]);

  const viewedYear = dateViewed.getFullYear();
  const viewedMonth = dateViewed.getMonth() + 1;

  const isMonthBeforeStart =
    viewedYear < startYear || (viewedYear === startYear && viewedMonth < startMonth);
  const isMonthAfterEnd =
    viewedYear > endYear || (viewedYear === endYear && viewedMonth > endMonth);

  const isStartBoundaryMonth = viewedYear === startYear && viewedMonth === startMonth;
  const isEndBoundaryMonth = viewedYear === endYear && viewedMonth === endMonth;

  const isSameYM =
    date.getFullYear() === dateViewed.getFullYear() && date.getMonth() === dateViewed.getMonth();
  const selectedDate = date.getDate();

  return (
    <DayWrapper>
      {dayRange.map((day, idx) => {
        const cantSelected =
          isMonthBeforeStart ||
          isMonthAfterEnd ||
          (isStartBoundaryMonth && startDay > day) ||
          (isEndBoundaryMonth && endDay < day);

        return (
          <Days
            className={
              isSameYM && day === selectedDate ? 'selected-day day' : 'non-selected-day day'
            }
            key={`day-${idx}`}
            onClick={cantSelected || !day ? null : () => handleDayClick(day)}
            day={day}
            sdt={cantSelected || !day}
          >
            {day}
          </Days>
        );
      })}
    </DayWrapper>
  );
}

function SelectDays() {
  const { date, setDate, setDateViewed, startDate, endDate } = useDatePicker();

  const setChangeDate = useCallback(
    changedDate => {
      let newDate = changedDate;
      if (changedDate < startDate) {
        newDate = startDate;
      } else if (changedDate > endDate) {
        newDate = endDate;
      }
      setDateViewed(newDate);
      setDate(newDate);
    },
    [endDate, setDate, setDateViewed, startDate],
  );

  const addDaysButton = useCallback(
    day => {
      const changedDate = addDays(day, new Date(date));
      setChangeDate(changedDate);
    },
    [date, setChangeDate],
  );

  const addMonthsButton = useCallback(
    month => {
      const changedDate = addMonths(month, new Date(date));
      setChangeDate(changedDate);
    },
    [date, setChangeDate],
  );

  const buttons = [
    { label: '10일', days: 10 },
    { label: '1개월', months: 1 },
    { label: '6개월', months: 6 },
    { label: '1년', months: 12 },
  ];

  return (
    <SelectDaysWrap>
      {buttons.map(({ label, days, months }) => (
        <div key={label}>
          {label}
          <span
            onClick={() => (days ? addDaysButton(days) : addMonthsButton(months))}
            role="button"
            aria-hidden
          >
            <FaPlus />
          </span>
          <span
            onClick={() => (days ? addDaysButton(-days) : addMonthsButton(-months))}
            role="button"
            aria-hidden
          >
            <FaMinus />
          </span>
        </div>
      ))}
    </SelectDaysWrap>
  );
}

function DatePickerProvider({
  children,
  date: dateProp,
  setDate: setDateString,
  disabled,
  startDate,
  endDate,
}) {
  const pickerRef = useRef(null);

  // 1. Create the internal Date object, handling both string and Date object props.
  const dateAsObject = useMemo(() => {
    let d;
    if (typeof dateProp === 'string') {
      // Add time part to avoid timezone issues.
      d = new Date(`${dateProp}T00:00:00`);
    } else {
      // It's likely a Date object.
      d = new Date(dateProp);
    }
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }, [dateProp]);

  // 2. Create the inputValue, ensuring it's always a string.
  const inputValueString = useMemo(() => {
    if (typeof dateProp === 'string') {
      // Check if the string is a valid date format before returning
      return !Number.isNaN(dateAsObject.getTime()) ? dateProp : formatDate(new Date());
    }
    // If it's a Date object, format it.
    return formatDate(dateAsObject);
  }, [dateProp, dateAsObject]);

  const [dateViewed, setDateViewed] = useState(dateAsObject);
  const [inputValue, setInputValue] = useState(inputValueString);
  const [isOpen, setIsOpen] = useState(false);

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth() + 1;
  const startDay = startDate.getDate();
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth() + 1;
  const endDay = endDate.getDate();

  // 3. Effect to sync with prop changes
  useEffect(() => {
    setDateViewed(dateAsObject);
    setInputValue(inputValueString);
  }, [dateAsObject, inputValueString]);

  const handleClose = useCallback(({ target }) => {
    if (pickerRef.current && !pickerRef.current.contains(target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClose);
    return () => document.removeEventListener('mousedown', handleClose);
  }, [handleClose]);

  const handleMonthChange = useCallback(
    amount => {
      const newDate = new Date(dateViewed);
      newDate.setMonth(newDate.getMonth() + amount);

      const targetYear = newDate.getFullYear();
      const targetMonth = newDate.getMonth() + 1;

      if (amount < 0) {
        if (targetYear < startYear || (targetYear === startYear && targetMonth < startMonth)) {
          return;
        }
      } else if (targetYear > endYear || (targetYear === endYear && targetMonth > endMonth)) {
        return;
      }
      setDateViewed(newDate);
    },
    [dateViewed, endMonth, endYear, startMonth, startYear],
  );

  // 4. Wrapper for setDate that converts Date object to 'YYYY-MM-DD' string
  const setDateFromString = useCallback(
    newDate => {
      setDateString(formatDate(newDate));
    },
    [setDateString],
  );

  const value = useMemo(
    () => ({
      date: dateAsObject, // Use the Date object internally
      setDate: setDateFromString, // Use the wrapped function to output strings
      dateViewed,
      setDateViewed,
      isOpen,
      setIsOpen,
      inputValue,
      disabled,
      startDate,
      endDate,
      startYear,
      startMonth,
      startDay,
      endYear,
      endMonth,
      endDay,
    }),
    [
      dateAsObject,
      setDateFromString,
      dateViewed,
      isOpen,
      inputValue,
      disabled,
      startDate,
      endDate,
      startYear,
      startMonth,
      startDay,
      endYear,
      endMonth,
      endDay,
    ],
  );

  return (
    <DatePickerContext.Provider value={value}>
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
              <Button
                onClick={() => handleMonthChange(-1)}
                className="date-picker-button date-picker-button-left"
              >
                <AiOutlineLeft />
              </Button>
              <SelectWrapper>
                <Year />
                <Month />
              </SelectWrapper>
              <Button
                onClick={() => handleMonthChange(1)}
                className="date-picker-button date-picker-button-right"
              >
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
            {children}
          </PickerWrapper>
        )}
      </Wrapper>
    </DatePickerContext.Provider>
  );
}

function DatePicker({
  date = new Date(), // Default to a Date object
  setDate = () => {},
  disabled = false,
  startDate = new Date('2023-01-01'),
  endDate = new Date('2040-12-31'),
}) {
  return (
    <DatePickerProvider
      date={date}
      setDate={setDate}
      disabled={disabled}
      startDate={startDate}
      endDate={endDate}
    >
      <Day />
      <SelectDays />
    </DatePickerProvider>
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
    width: 85px !important;

    &:last-of-type {
      width: 65px !important;
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

const DayWrapper = styled.ul`
  width: 100% !important;
  height: 198px;
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

const Days = styled.li`
  width: 32px !important;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  margin-top: 1px;

  ${({ day }) =>
    day &&
    css`
      &:hover {
        background-color: #eceff1;
      }
      cursor: pointer;
    `}

  ${({ sdt, day }) =>
    day &&
    sdt &&
    css`
      cursor: default;
      background-color: #ebebeb !important;
    `}
`;

const SelectDaysWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 8px;
  font-size: 14px;

  & div {
    width: 50px;
    height: 24px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background-color: #3e3e3e;
    border-radius: 3px;
    cursor: pointer;
  }

  & div:hover span {
    display: block;
  }

  & span {
    width: 50%;
    left: 0;
    position: absolute;
    display: none;
    text-align: center;
    background-color: #3e3e3e;
  }

  & span:nth-of-type(2) {
    left: 50%;
    border-left: 1px solid #ebebeb;
    box-sizing: border-box;
  }
`;

export default DatePicker;
