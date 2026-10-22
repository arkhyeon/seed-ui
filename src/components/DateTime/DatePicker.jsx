import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import _ from 'lodash';
import { css } from '@emotion/react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import useSeedFloating from '../../common/useSeedFloating';
import { FLOATING_PROP, clickedInsideFloating } from '../../common/floating';
import { TextInput } from '../InputComp/InputComponent';
import { addDays, addMonths, formatDate } from './timeComponents/PickerCommonFunc';
import {
  WEEK_DAYS,
  CALENDAR_WIDTH,
  PickerNav,
  PickerInputIcon,
  Wrapper,
  WeekWrapper,
  DayGrid,
  panelStyle,
  todayDot,
  isSameDay,
} from './dateComponents/PickerShared';

const DatePickerContext = createContext(null);

function useDatePicker() {
  const context = useContext(DatePickerContext);
  if (!context) {
    throw new Error('useDatePicker must be used within a DatePickerProvider');
  }
  return context;
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

  const today = useMemo(() => new Date(), []);

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
    <DayGrid>
      {dayRange.map((day, idx) => {
        const cantSelected =
          isMonthBeforeStart ||
          isMonthAfterEnd ||
          (isStartBoundaryMonth && startDay > day) ||
          (isEndBoundaryMonth && endDay < day);
        const selected = isSameYM && day === selectedDate;

        return (
          <Days
            className={selected ? 'selected-day day' : 'non-selected-day day'}
            key={`day-${idx}`}
            onClick={cantSelected || !day ? null : () => handleDayClick(day)}
            $day={day}
            $disabled={cantSelected || !day}
            $selected={selected}
            $today={!!day && isSameDay(new Date(viewedYear, viewedMonth - 1, day), today)}
          >
            {day}
          </Days>
        );
      })}
    </DayGrid>
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
        <Stepper key={label}>
          <button
            type="button"
            aria-label={`${label} 전`}
            onClick={() => (days ? addDaysButton(-days) : addMonthsButton(-months))}
          >
            <FaMinus />
          </button>
          <span>{label}</span>
          <button
            type="button"
            aria-label={`${label} 후`}
            onClick={() => (days ? addDaysButton(days) : addMonthsButton(months))}
          >
            <FaPlus />
          </button>
        </Stepper>
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

  // 달력 위치: Floating UI(포털+flip). 화면 하단/스크롤 컨테이너에서 안 잘림.
  const { refs, floatingStyles } = useSeedFloating(isOpen, {
    placement: 'bottom-start',
    gap: 6,
    clampHeight: false,
  });

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
    // 입력 영역 안이거나, (중첩) 떠있는 요소(달력·연/월 드롭다운) 안이면 유지
    if (pickerRef.current?.contains(target) || clickedInsideFloating(target)) return;
    setIsOpen(false);
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
      <Wrapper
        ref={node => {
          pickerRef.current = node;
          refs.setReference(node);
        }}
      >
        <TextInput
          className="date-picker-input"
          value={inputValue}
          onClick={() => setIsOpen(open => !open)}
          readOnly
          disabled={disabled}
        />
        <PickerInputIcon />
        {isOpen &&
          createPortal(
            <PickerWrapper
              className="date-picker"
              ref={refs.setFloating}
              {...FLOATING_PROP}
              style={floatingStyles}
            >
              <PickerNav
                className="date-picker-head"
                onPrev={() => handleMonthChange(-1)}
                onNext={() => handleMonthChange(1)}
                dateViewed={dateViewed}
                setDateViewed={setDateViewed}
                startYear={startYear}
                endYear={endYear}
                startMonth={startMonth}
                endMonth={endMonth}
              />
              <WeekWrapper>
                {WEEK_DAYS.map(week => (
                  <li key={`weekday-${week}`} className="date-picker-week">
                    {week}
                  </li>
                ))}
              </WeekWrapper>
              {children}
            </PickerWrapper>,
            document.body,
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

const PickerWrapper = styled.div`
  ${panelStyle};
  width: ${CALENDAR_WIDTH + 24}px !important;
  display: flex;
  flex-direction: column;
  font-size: 14px;
`;

const Days = styled.li`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  color: var(--seed-text);
  transition: background-color 0.12s, color 0.12s;

  ${({ $day, $disabled }) =>
    $day &&
    !$disabled &&
    css`
      cursor: pointer;
      &:hover {
        background-color: var(--seed-hover);
      }
    `}

  ${({ $today }) =>
    $today &&
    css`
      color: var(--seed-primary);
      font-weight: 600;
      ${todayDot};
    `}

  ${({ $selected }) =>
    $selected &&
    css`
      background-color: var(--seed-primary) !important;
      color: var(--seed-invert-text);
      font-weight: 600;
      box-shadow: 0 4px 10px -3px var(--seed-primary);
    `}

  ${({ $day, $disabled }) =>
    $day &&
    $disabled &&
    css`
      cursor: default;
      color: var(--seed-text-muted);
      opacity: 0.45;
    `}
`;

const SelectDaysWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--seed-border);
`;

const Stepper = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--seed-border);
  border-radius: 8px;
  overflow: hidden;
  font-size: 12px;
  color: var(--seed-text-secondary);

  & span {
    flex: 1;
    text-align: center;
    font-weight: 500;
  }

  & button {
    all: unset;
    box-sizing: border-box;
    width: 28px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: var(--seed-text-muted);
    transition: background-color 0.12s, color 0.12s;

    &:hover {
      background: var(--x-fde8e8);
      color: var(--seed-primary);
    }

    svg {
      width: 9px;
      height: 9px;
    }
  }
`;

export default DatePicker;
