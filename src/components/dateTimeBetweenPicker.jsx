import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import {
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineCaretDown,
  AiOutlineCaretUp,
} from 'react-icons/ai';

/**
 * @param {Date} param.startDate
 * 시작 날짜
 * state로 관리하는 상태 값 이여야 함
 * default 값은 new Date()
 * @param {Date} param.endDate
 * 종료 날짜
 * state로 관리하는 상태 값 이여야 함
 * default 값은 new Date()
 * @param {Function} param.setStartDate
 * 시작 날짜를 변경하는 함수
 * setState 함수(상태 변경 함수)여야 함
 * default 값은 null
 * @param {Function} param.setEndDate
 * 종료 날자를 변경하는 함수
 * setState 함수(상태 변경 함수)여야 함
 * default 값은 null
 * @param {String} param.width
 * input 박스의 너비
 * default 값은 '100px'
 * @returns {JSX.Element} DateBetweenPicker Component
 */

function DateTimeBetweenPicker({
  startDate = new Date(),
  endDate = new Date(),
  setStartDate = null,
  setEndDate = null,
  width = '130px',
}) {
  const [isOpenStart, setIsOpenStart] = useState(false);
  const [isOpenEnd, setIsOpenEnd] = useState(false);
  const [startDateViewed, setStartDateViewed] = useState(startDate);
  const [endDateViewed, setEndDateViewed] = useState(endDate);
  const startPickerRef = useRef(null);
  const endPickerRef = useRef(null);
  const startInputRef = useRef(null);
  const endInputRef = useRef(null);
  const weekDays = useRef(['일', '월', '화', '수', '목', '금', '토']).current;
  const [startInputValue, setStartInputValue] = useState(
    `${new Date(startDate.getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10)} ${new Date(startDate.getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(11, 16)}`,
  );
  const [endInputValue, setEndInputValue] = useState(
    `${new Date(endDate.getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10)} ${new Date(endDate.getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(11, 16)}`,
  );
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const [startHourInput, setStartHourInput] = useState(
    `${new Date(startDate.getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(11, 13)}`,
  );
  const [endHourInput, setEndHourInput] = useState(
    `${new Date(endDate.getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(11, 13)}`,
  );
  const [startMinuteInput, setStartMinuteInput] = useState(
    `${new Date(startDate.getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(14, 16)}`,
  );
  const [endMinuteInput, setEndMinuteInput] = useState(
    `${new Date(endDate.getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(14, 16)}`,
  );
  const startHourRef = useRef(null);
  const startMinuteRef = useRef(null);
  const endHourRef = useRef(null);
  const endMinuteRef = useRef(null);
  const startYearRef = useRef(null);
  const endYearRef = useRef(null);
  const startMonthRef = useRef(null);
  const endMonthRef = useRef(null);

  useEffect(() => {
    if (!isOpenEnd) {
      const dupDate = new Date(startDate);
      dupDate.setDate(1);
      setStartDateViewed(dupDate);
    }
    if (!isOpenEnd) {
      const dupDate = new Date(endDate);
      dupDate.setDate(1);
      setEndDateViewed(dupDate);
    }
  }, [isOpenEnd, isOpenStart, startDate, endDate]);

  useEffect(() => {
    const startTimezoneOffset = new Date().getTimezoneOffset() * 60000;
    const startTimezoneDate = new Date(startDate.getTime() - startTimezoneOffset);

    const endTimezoneOffset = new Date().getTimezoneOffset() * 60000;
    const endTimezoneDate = new Date(endDate.getTime() - endTimezoneOffset);

    setStartInputValue(
      `${startTimezoneDate.toISOString().slice(0, 10)} ${startTimezoneDate
        .toISOString()
        .slice(11, 16)}`,
    );

    setEndInputValue(
      `${endTimezoneDate.toISOString().slice(0, 10)} ${endTimezoneDate
        .toISOString()
        .slice(11, 16)}`,
    );

    setStartHourInput(`${startTimezoneDate.toISOString().slice(11, 13)}`);
    setStartMinuteInput(`${startTimezoneDate.toISOString().slice(14, 16)}`);

    setEndHourInput(`${endTimezoneDate.toISOString().slice(11, 13)}`);
    setEndMinuteInput(`${endTimezoneDate.toISOString().slice(14, 16)}`);
  }, [startDate, endDate]);

  const checkStartEnd = useCallback((startDate, endDate) => {
    return endDate.getTime() - startDate.getTime() >= 0;
  }, []);

  const checkHour = useCallback(input => {
    const reg = /^([01][0-9]|2[0-3])$/;

    return reg.test(input);
  }, []);

  const checkMinute = useCallback(input => {
    const reg = /^([0-5][0-9])$/;

    return reg.test(input);
  }, []);

  const checkValidate = useCallback(input => {
    const reg = /^\d{4}-\d{2}-\d{2}$/;
    if (reg.test(input)) {
      return true;
    }
    return false;
  }, []);

  const checkValidDate = useCallback(value => {
    let result = true;
    try {
      const date = value.split('-');
      const y = parseInt(date[0], 10);
      const m = parseInt(date[1], 10);
      const d = parseInt(date[2], 10);

      const dateRegex =
        /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-.\/])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/;
      result = dateRegex.test(`${d}-${m}-${y}`);
    } catch (err) {
      result = false;
    }
    return result;
  }, []);

  const handleStartPicker = useCallback(() => {
    setIsOpenStart(!isOpenStart);
    setIsOpenEnd(false);
  }, [isOpenStart]);

  const handleEndPicker = useCallback(() => {
    setIsOpenEnd(!isOpenEnd);
    setIsOpenStart(false);
  }, [isOpenEnd]);

  const handleNext = useCallback(
    target => {
      if (target === 'start') {
        const dupDate = new Date(startDateViewed.getTime());

        dupDate.setMonth(dupDate.getMonth() + 1);
        setStartDateViewed(dupDate);
      } else if (target === 'end') {
        const dupDate = new Date(endDateViewed.getTime());

        dupDate.setMonth(dupDate.getMonth() + 1);
        setEndDateViewed(dupDate);
      }
    },
    [endDateViewed, startDateViewed],
  );

  const handlePrev = useCallback(
    target => {
      if (target === 'start') {
        const dupDate = new Date(startDateViewed.getTime());

        dupDate.setMonth(dupDate.getMonth() - 1);
        setStartDateViewed(dupDate);
      } else if (target === 'end') {
        const dupDate = new Date(endDateViewed.getTime());

        dupDate.setMonth(dupDate.getMonth() - 1);
        setEndDateViewed(dupDate);
      }
    },
    [endDateViewed, startDateViewed],
  );

  const handleOutside = useCallback(
    e => {
      if (
        isOpenStart &&
        !startPickerRef.current.contains(e.target) &&
        !startInputRef.current.contains(e.target) &&
        !startTimeRef.current.contains(e.target)
      ) {
        setIsOpenStart(false);
      }

      if (
        isOpenEnd &&
        !endPickerRef.current.contains(e.target) &&
        !endPickerRef.current.contains(e.target) &&
        !endTimeRef.current.contains(e.target)
      ) {
        setIsOpenEnd(false);
      }
    },
    [setIsOpenStart, setIsOpenEnd, isOpenStart, isOpenEnd],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleOutside);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [handleOutside]);

  useLayoutEffect(() => {
    if (startPickerRef.current) {
      startYearRef.current.value = `${startDateViewed.getFullYear()}년`;
      startMonthRef.current.value = `${startDateViewed.getMonth() + 1}월`;
    }

    if (endPickerRef.current) {
      endYearRef.current.value = `${endDateViewed.getFullYear()}년`;
      endMonthRef.current.value = `${endDateViewed.getMonth() + 1}월`;
    }
  }, [startDateViewed, endDateViewed]);

  const renderWeekDays = useCallback(() => {
    return (
      <WeekWrapper>
        {weekDays.map((el, idx) => (
          <WeekDay key={`weekday-${idx}`} className="date-picker-week">
            {el}
          </WeekDay>
        ))}
      </WeekWrapper>
    );
  }, [weekDays]);

  const handleDayClick = useCallback(
    (e, target) => {
      if (e.target.textContent === '') {
        return null;
      }

      let dupDate;

      if (target === 'start') {
        dupDate = new Date(startDateViewed.getTime());
      } else if (target === 'end') {
        dupDate = new Date(endDateViewed.getTime());
      }

      const year = dupDate.getFullYear();
      const month = dupDate.getMonth() + 1;
      const day = parseInt(e.target.textContent, 10);

      let newStartDate;
      let newEndDate;

      if (target === 'start') {
        newStartDate = new Date(`${year}-${month}-${day}`);
        newStartDate.setHours(parseInt(startHourInput, 10));
        newStartDate.setMinutes(parseInt(startMinuteInput, 10));
        newEndDate = endDate;
      } else {
        newStartDate = startDate;
        newEndDate = new Date(`${year}-${month}-${day}`);
        newEndDate.setHours(parseInt(endHourInput, 10));
        newEndDate.setMinutes(parseInt(endMinuteInput, 10));
      }

      if (!checkStartEnd(newStartDate, newEndDate)) {
        if (target === 'start') {
          newEndDate = newStartDate;
        } else {
          newStartDate = newEndDate;
        }
      }

      setStartDate(newStartDate);
      setStartDateViewed(newStartDate);
      setEndDate(newEndDate);
      setEndDateViewed(newEndDate);

      setIsOpenStart(false);
      setIsOpenEnd(false);
    },
    [
      endDate,
      endDateViewed,
      endHourInput,
      endMinuteInput,
      setEndDate,
      setStartDate,
      startDate,
      startDateViewed,
      startHourInput,
      startMinuteInput,
      checkStartEnd,
    ],
  );

  const renderDays = useCallback(
    target => {
      let dupDate;

      if (target === 'start') {
        dupDate = new Date(startDateViewed.getTime());
      } else if (target === 'end') {
        dupDate = new Date(endDateViewed.getTime());
      }

      const year = dupDate.getFullYear();
      const month = dupDate.getMonth();
      let firstWeekDay = new Date(year, month, 1).getDay();
      if (firstWeekDay === 7) {
        firstWeekDay = 0;
      }
      const lastDay = new Date(year, month + 1, 0).getDate();

      const days = [];

      for (let i = 0; i < firstWeekDay; i++) {
        days.push('');
      }

      for (let i = 1; i <= lastDay; i++) {
        days.push(String(i));
      }

      const leftDays = 7 - (days.length % 7) === 7 ? 0 : 7 - (days.length % 7);

      for (let i = 1; i <= leftDays; i++) {
        days.push('');
      }

      return (
        <DayWrapper>
          {days.map((el, idx) => {
            if (el === '') {
              return <Empty />;
            }

            const dateViewed = target === 'start' ? startDateViewed : endDateViewed;

            if (dateViewed.getFullYear() < startDate.getFullYear()) {
              return (
                <Day
                  key={`day-${idx}`}
                  onClick={e => handleDayClick(e, target)}
                  day={el}
                  startDate={startDate}
                  endDate={endDate}
                  className="non-selected-day day"
                >
                  {el}
                </Day>
              );
            }
            if (
              dateViewed.getFullYear() === startDate.getFullYear() &&
              dateViewed.getMonth() < startDate.getMonth()
            ) {
              return (
                <Day
                  key={`day-${idx}`}
                  onClick={e => handleDayClick(e, target)}
                  day={el}
                  startDate={startDate}
                  endDate={endDate}
                  className="non-selected-day day"
                >
                  {el}
                </Day>
              );
            }
            if (
              dateViewed.getFullYear() === startDate.getFullYear() &&
              dateViewed.getMonth() === startDate.getMonth() &&
              el < startDate.getDate()
            ) {
              return (
                <Day
                  key={`day-${idx}`}
                  onClick={e => handleDayClick(e, target)}
                  day={el}
                  startDate={startDate}
                  endDate={endDate}
                  className="non-selected-day day"
                >
                  {el}
                </Day>
              );
            }
            if (dateViewed.getFullYear() > endDate.getFullYear()) {
              return (
                <Day
                  key={`day-${idx}`}
                  onClick={e => handleDayClick(e, target)}
                  day={el}
                  startDate={startDate}
                  endDate={endDate}
                  className="non-selected-day day"
                >
                  {el}
                </Day>
              );
            }
            if (
              dateViewed.getFullYear() === endDate.getFullYear() &&
              dateViewed.getMonth() > endDate.getMonth()
            ) {
              return (
                <Day
                  key={`day-${idx}`}
                  onClick={e => handleDayClick(e, target)}
                  day={el}
                  startDate={startDate}
                  endDate={endDate}
                  className="non-selected-day day"
                >
                  {el}
                </Day>
              );
            }
            if (
              dateViewed.getFullYear() === endDate.getFullYear() &&
              dateViewed.getMonth() === endDate.getMonth() &&
              el > endDate.getDate()
            ) {
              return (
                <Day
                  key={`day-${idx}`}
                  onClick={e => handleDayClick(e, target)}
                  day={el}
                  startDate={startDate}
                  endDate={endDate}
                  className="non-selected-day day"
                >
                  {el}
                </Day>
              );
            }

            return (
              <Day
                key={`day-${idx}`}
                onClick={e => handleDayClick(e, target)}
                day={el}
                startDate={startDate}
                endDate={endDate}
                className="selected-day day"
              >
                {el}
              </Day>
            );
          })}
        </DayWrapper>
      );
    },
    [endDate, endDateViewed, handleDayClick, startDate, startDateViewed],
  );

  const handleInput = useCallback(
    (e, target) => {
      let prevYear;
      let prevMonth;
      let prevDay;
      let prevHour;
      let prevMinute;

      if (target === 'start') {
        [prevYear, prevMonth, prevDay] = startInputValue.slice(0, 10).split('-');
        [prevHour, prevMinute] = startInputValue.slice(11, 16).split(':');
      } else if (target === 'end') {
        [prevYear, prevMonth, prevDay] = endInputValue.slice(0, 10).split('-');
        [prevHour, prevMinute] = endInputValue.slice(11, 16).split(':');
      }

      const [year, month, day] = e.target.value.slice(0, 11).trim().split('-');
      const [hour, minute] = e.target.value.slice(11, 17).trim().split(':');
      let convertedYear = '';
      const checkDiff = false;
      let convertedMonth = '';
      let convertedDay = '';
      let convertedHour = '';
      let convertedMinute = '';
      const cursorIdx = e.target.selectionStart;

      for (let i = 0; i < year.length; i++) {
        if (i !== cursorIdx) {
          convertedYear += year[i];
        }
      }

      for (let i = 0; i < month.length; i++) {
        if (i + 5 !== cursorIdx) {
          convertedMonth += month[i];
        }
      }

      for (let i = 0; i < day.length; i++) {
        if (i + 8 !== cursorIdx) {
          convertedDay += day[i];
        }
      }

      for (let i = 0; i < hour.length; i++) {
        if (i + 11 !== cursorIdx) {
          convertedHour += `${hour[i]}`;
        }
      }

      for (let i = 0; i < minute.length; i++) {
        if (i + 14 !== cursorIdx) {
          convertedMinute += `${minute[i]}`;
        }
      }

      if (convertedMonth[0] === '1' && cursorIdx === 6) {
        convertedMonth = `${convertedMonth[0]}0`;
      } else if (convertedMonth[0] === '0' && cursorIdx === 6) {
        convertedMonth = `${convertedMonth[0]}1`;
      }

      if (cursorIdx === 6 || cursorIdx === 7) {
        convertedDay = '01';
      }

      if (convertedDay[0] === '3' && cursorIdx === 9) {
        convertedDay = `${convertedDay[0]}0`;
      } else if (convertedDay[0] === '0' && cursorIdx === 9) {
        convertedDay = `${convertedDay[0]}1`;
      }

      if (convertedHour[0] === '2' && cursorIdx === 12) {
        convertedHour = `${convertedHour[0]}0`;
      }

      if (
        !checkValidate(`${convertedYear}-${convertedMonth}-${convertedDay}`) ||
        !checkValidDate(`${convertedYear}-${convertedMonth}-${convertedDay}`) ||
        !checkHour(convertedHour) ||
        !checkMinute(convertedMinute) ||
        checkDiff === 0
      ) {
        if (target === 'start') {
          setTimeout(() => {
            startInputRef.current.setSelectionRange(cursorIdx, cursorIdx);
          }, 10);
        } else if (target === 'end') {
          endInputRef.current.setSelectionRange(cursorIdx, cursorIdx);
        }
      } else {
        let newStartDate;
        let newEndDate;

        if (target === 'start') {
          newStartDate = new Date(`${convertedYear}-${convertedMonth}-${convertedDay}`);
          newStartDate.setHours(convertedHour);
          newStartDate.setMinutes(convertedMinute);
          newEndDate = endDate;
        } else {
          newStartDate = startDate;
          newEndDate = new Date(`${convertedYear}-${convertedMonth}-${convertedDay}`);
          newEndDate.setHours(convertedHour);
          newEndDate.setMinutes(convertedMinute);
        }
        if (!checkStartEnd(newStartDate, newEndDate)) {
          if (target === 'start') {
            newEndDate = newStartDate;
          } else {
            newStartDate = newEndDate;
          }
        }

        setStartDate(newStartDate);
        setStartDateViewed(newStartDate);
        setEndDate(newEndDate);
        setEndDateViewed(newEndDate);

        if (target === 'start') {
          setTimeout(() => {
            startInputRef.current.setSelectionRange(cursorIdx, cursorIdx);
          }, 10);
        } else if (target === 'end') {
          setTimeout(() => {
            endInputRef.current.setSelectionRange(cursorIdx, cursorIdx);
          }, 10);
        }
      }
    },
    [
      endDate,
      endInputValue,
      setEndDate,
      setStartDate,
      startDate,
      startInputValue,
      checkHour,
      checkMinute,
      checkStartEnd,
      checkValidDate,
      checkValidate,
    ],
  );

  const addHour = useCallback(
    (e, target) => {
      let parsedHour;
      let dupDate;

      if (target === 'start') {
        parsedHour = parseInt(startHourInput, 10);
        dupDate = new Date(startDate.getTime());
      } else {
        parsedHour = parseInt(endHourInput, 10);
        dupDate = new Date(endDate.getTime());
      }

      if (target === 'start') {
        if (parsedHour + 1 < 24) {
          setStartHourInput(parsedHour + 1 < 10 ? `0${parsedHour + 1}` : parsedHour + 1);
          dupDate.setHours(parsedHour + 1);
        } else {
          setStartHourInput('00');
          dupDate.setHours(0);
        }
        setStartDate(dupDate);
      } else {
        if (parsedHour + 1 < 24) {
          setEndHourInput(parsedHour + 1 < 10 ? `0${parsedHour + 1}` : parsedHour + 1);
          dupDate.setHours(parsedHour + 1);
        } else {
          setEndHourInput('00');
          dupDate.setHours(0);
        }
        setEndDate(dupDate);
      }
    },
    [endDate, endHourInput, setEndDate, setStartDate, startDate, startHourInput],
  );

  const minusHour = useCallback(
    (e, target) => {
      let parsedHour;
      let dupDate;

      if (target === 'start') {
        parsedHour = parseInt(startHourInput, 10);
        dupDate = new Date(startDate.getTime());
      } else {
        parsedHour = parseInt(endHourInput, 10);
        dupDate = new Date(endDate.getTime());
      }

      if (target === 'start') {
        if (parsedHour - 1 > 0) {
          setStartHourInput(parsedHour - 1 < 10 ? `0${parsedHour - 1}` : parsedHour - 1);
          dupDate.setHours(parsedHour - 1);
        } else {
          setStartHourInput('23');
          dupDate.setHours(23);
        }
        setStartDate(dupDate);
      } else {
        if (parsedHour - 1 > 0) {
          setEndHourInput(parsedHour - 1 < 10 ? `0${parsedHour - 1}` : parsedHour - 1);
          dupDate.setHours(parsedHour - 1);
        } else {
          setEndHourInput('23');
          dupDate.setHours(23);
        }
        setEndDate(dupDate);
      }
    },
    [endDate, endHourInput, setEndDate, setStartDate, startDate, startHourInput],
  );

  const addMinute = useCallback(
    (e, target) => {
      let parsedMinute;
      let dupDate;

      if (target === 'start') {
        parsedMinute = parseInt(startMinuteInput, 10);
        dupDate = new Date(startDate.getTime());
      } else {
        parsedMinute = parseInt(endMinuteInput, 10);
        dupDate = new Date(endDate.getTime());
      }

      if (target === 'start') {
        if (parsedMinute + 1 < 60) {
          setStartMinuteInput(parsedMinute + 1 < 10 ? `0${parsedMinute + 1}` : parsedMinute + 1);
          dupDate.setMinutes(parsedMinute + 1);
        } else {
          setStartMinuteInput('00');
          dupDate.setMinutes(0);
        }
        setStartDate(dupDate);
      } else {
        if (parsedMinute + 1 < 60) {
          setEndMinuteInput(parsedMinute + 1 < 10 ? `0${parsedMinute + 1}` : parsedMinute + 1);
          dupDate.setMinutes(parsedMinute + 1);
        } else {
          setEndMinuteInput('00');
          dupDate.setMinutes(0);
        }
        setEndDate(dupDate);
      }
    },
    [endDate, endMinuteInput, setEndDate, startDate, setStartDate, startMinuteInput],
  );

  const minusMinute = useCallback(
    (e, target) => {
      let parsedMinute;
      let dupDate;

      if (target === 'start') {
        parsedMinute = parseInt(startMinuteInput, 10);
        dupDate = new Date(startDate.getTime());
      } else {
        parsedMinute = parseInt(endMinuteInput, 10);
        dupDate = new Date(endDate.getTime());
      }

      if (target === 'start') {
        if (parsedMinute - 1 > 0) {
          setStartMinuteInput(parsedMinute - 1 < 10 ? `0${parsedMinute - 1}` : parsedMinute - 1);
          dupDate.setMinutes(parsedMinute - 1);
        } else {
          setStartMinuteInput('59');
          dupDate.setMinutes(59);
        }
        setStartDate(dupDate);
      } else {
        if (parsedMinute - 1 > 0) {
          setEndMinuteInput(parsedMinute - 1 < 10 ? `0${parsedMinute - 1}` : parsedMinute - 1);
          dupDate.setMinutes(parsedMinute - 1);
        } else {
          setEndMinuteInput('59');
          dupDate.setMinutes(59);
        }
        setEndDate(dupDate);
      }
    },
    [endDate, endMinuteInput, setEndDate, setStartDate, startDate, startMinuteInput],
  );

  const handleHourInput = useCallback(
    (e, target) => {
      let prevHour;
      let dupDate;

      if (target === 'start') {
        prevHour = String(startHourInput);
        dupDate = new Date(startDate.getTime());
      } else {
        prevHour = String(endHourInput);
        dupDate = new Date(endDate.getTime());
      }

      const hour = e.target.value;
      let convertedHour = '';
      let checkDiff = false;
      const cursorIdx = e.target.selectionStart;

      for (let i = 0; i < hour.length; i++) {
        if (hour[i - 1] !== prevHour[i - 1] && !checkDiff) {
          checkDiff = true;
        } else {
          convertedHour += hour[i];
        }
      }

      if (convertedHour[0] === '2' && cursorIdx === 1) {
        convertedHour = `${convertedHour[0]}0`;
      }

      if (checkHour(convertedHour)) {
        if (target === 'start') {
          setStartHourInput(convertedHour);
          dupDate.setHours(parseInt(convertedHour, 10));
          setStartDate(dupDate);
          setTimeout(() => {
            startHourRef.current.setSelectionRange(cursorIdx, cursorIdx);
          }, 10);
        } else {
          setEndHourInput(convertedHour);
          dupDate.setHours(parseInt(convertedHour, 10));
          setEndDate(dupDate);
          setTimeout(() => {
            endHourRef.current.setSelectionRange(cursorIdx, cursorIdx);
          }, 10);
        }
      }
    },
    [endDate, endHourInput, setEndDate, setStartDate, startDate, startHourInput, checkHour],
  );

  const handleMinuteInput = useCallback(
    (e, target) => {
      let prevMinute;
      let dupDate;

      if (target === 'start') {
        prevMinute = String(startMinuteInput);
        dupDate = new Date(startDate.getTime());
      } else {
        prevMinute = String(endMinuteInput);
        dupDate = new Date(endDate.getTime());
      }

      const minute = e.target.value;
      let convertedMinute = '';
      let checkDiff = false;
      const cursorIdx = e.target.selectionStart;

      for (let i = 0; i < minute.length; i++) {
        if (minute[i - 1] !== prevMinute[i - 1] && !checkDiff) {
          checkDiff = true;
        } else {
          convertedMinute += minute[i];
        }
      }

      if (checkMinute(convertedMinute)) {
        if (target === 'start') {
          setStartMinuteInput(convertedMinute);
          dupDate.setMinutes(parseInt(convertedMinute, 10));
          setStartDate(dupDate);
          setTimeout(() => {
            startMinuteRef.current.setSelectionRange(cursorIdx, cursorIdx);
          }, 10);
        } else {
          setEndMinuteInput(convertedMinute);
          dupDate.setMinutes(parseInt(convertedMinute, 10));
          setEndDate(dupDate);
          setTimeout(() => {
            endMinuteRef.current.setSelectionRange(cursorIdx, cursorIdx);
          }, 10);
        }
      }
    },
    [endDate, endMinuteInput, setEndDate, setStartDate, startDate, startMinuteInput, checkMinute],
  );

  const changeYear = useCallback(
    (e, target) => {
      let dupDate;

      if (target === 'start') {
        dupDate = new Date(startDateViewed);
      } else {
        dupDate = new Date(endDateViewed);
      }

      dupDate.setFullYear(e.target.value.slice(0, -1));

      if (target === 'start') {
        setStartDateViewed(dupDate);
      } else {
        setEndDateViewed(dupDate);
      }
    },
    [endDateViewed, startDateViewed],
  );

  const changeMonth = useCallback(
    (e, target) => {
      let dupDate;

      if (target === 'start') {
        dupDate = new Date(startDateViewed);
      } else {
        dupDate = new Date(endDateViewed);
      }

      dupDate.setMonth(e.target.value.slice(0, -1) - 1);

      if (target === 'start') {
        setStartDateViewed(dupDate);
      } else {
        setEndDateViewed(dupDate);
      }
    },
    [endDateViewed, startDateViewed],
  );

  const renderYear = useCallback(
    target => {
      const temp = [];

      for (let i = 2000; i <= 2040; i++) {
        temp.push(`${i}년`);
      }

      return (
        <select
          defaultValue={
            target === 'start' ? `${startDate.getFullYear()}년` : `${endDate.getFullYear()}년`
          }
          onChange={e => changeYear(e, target)}
          ref={target === 'start' ? startYearRef : endYearRef}
        >
          {temp.map(el => (
            <option key={`year-${el}`} value={el}>
              {el}
            </option>
          ))}
        </select>
      );
    },
    [changeYear, endDate, startDate],
  );

  const renderMonth = useCallback(
    target => {
      const temp = [];

      for (let i = 1; i <= 12; i++) {
        temp.push(`${i}월`);
      }

      return (
        <select
          defaultValue={
            target === 'start' ? `${startDate.getMonth() + 1}월` : `${endDate.getMonth() + 1}월`
          }
          onChange={e => changeMonth(e, target)}
          ref={target === 'start' ? startMonthRef : endMonthRef}
        >
          {temp.map(el => (
            <option key={`month-${el}`} value={el}>
              {el}
            </option>
          ))}
        </select>
      );
    },
    [changeMonth, endDate, startDate],
  );

  return (
    <Wrapper>
      <div style={{ position: 'relative' }}>
        <Input
          width={width}
          onClick={handleStartPicker}
          ref={startInputRef}
          value={startInputValue}
          onChange={e => handleInput(e, 'start')}
          className="date-picker-input"
        />
        {isOpenStart && (
          <>
            <PickWrapper ref={startPickerRef}>
              <Head className="date-picker-head">
                <Button
                  pos="left"
                  width={width}
                  onClick={() => handlePrev('start')}
                  className="date-picker-button date-picker-button-left"
                >
                  <AiOutlineLeft />
                </Button>
                <Button
                  pos="right"
                  width={width}
                  onClick={() => handleNext('start')}
                  className="date-picker-button date-picker-button-right"
                >
                  <AiOutlineRight />
                </Button>
                {renderYear('start')}
                {renderMonth('start')}
              </Head>
              {renderWeekDays()}
              {renderDays('start')}
            </PickWrapper>
            <TimeWrapper ref={startTimeRef}>
              <LineWrapper>
                <AiOutlineCaretUp
                  onClick={e => addHour(e, 'start')}
                  className="date-picker-time-button"
                />
                <TimteInput
                  value={startHourInput}
                  onChange={e => handleHourInput(e, 'start')}
                  ref={startHourRef}
                  className="date-picker-time-input"
                />
                <AiOutlineCaretDown
                  onClick={e => minusHour(e, 'start')}
                  className="date-picker-time-button"
                />
              </LineWrapper>

              <LineWrapper>
                <AiOutlineCaretUp
                  onClick={e => addMinute(e, 'start')}
                  className="date-picker-time-button"
                />
                <TimteInput
                  value={startMinuteInput}
                  onChange={e => handleMinuteInput(e, 'start')}
                  ref={startMinuteRef}
                  className="date-picker-time-input"
                />
                <AiOutlineCaretDown
                  onClick={e => minusMinute(e, 'start')}
                  className="date-picker-time-button"
                />
              </LineWrapper>
            </TimeWrapper>
          </>
        )}
      </div>
      <div>~</div>
      <div style={{ position: 'relative' }}>
        <Input
          width={width}
          onClick={handleEndPicker}
          ref={endInputRef}
          value={endInputValue}
          onChange={e => handleInput(e, 'end')}
          className="date-picker-input"
        />
        {isOpenEnd && (
          <>
            <PickWrapper ref={endPickerRef}>
              <Head className="date-picker-head">
                <Button
                  pos="left"
                  width={width}
                  onClick={() => handlePrev('end')}
                  className="date-picker-button date-picker-button-left"
                >
                  <AiOutlineLeft />
                </Button>
                <Button
                  pos="right"
                  width={width}
                  onClick={() => handleNext('end')}
                  className="date-picker-button date-picker-button-right"
                >
                  <AiOutlineRight />
                </Button>
                {renderYear('end')}
                {renderMonth('end')}
              </Head>
              {renderWeekDays()}
              {renderDays('end')}
            </PickWrapper>
            <TimeWrapper ref={endTimeRef}>
              <LineWrapper>
                <AiOutlineCaretUp onClick={e => addHour(e, 'end')} />
                <TimteInput
                  value={endHourInput}
                  onChange={e => handleHourInput(e, 'end')}
                  ref={endHourRef}
                />
                <AiOutlineCaretDown onClick={e => minusHour(e, 'end')} />
              </LineWrapper>

              <LineWrapper>
                <AiOutlineCaretUp onClick={e => addMinute(e, 'end')} />
                <TimteInput
                  value={endMinuteInput}
                  onChange={e => handleMinuteInput(e, 'end')}
                  ref={endMinuteRef}
                />
                <AiOutlineCaretDown onClick={e => minusMinute(e, 'end')} />
              </LineWrapper>
            </TimeWrapper>
          </>
        )}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
`;

const Input = styled.input`
  width: ${({ width }) => width};
  position: relative;
`;

const PickWrapper = styled.div`
  position: absolute;

  margin-top: 4px;

  width: 280px;
  height: 300px;
  z-index: 80;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid black;
  background: white;

  -webkit-touch-callout: none;
  user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
`;

const Head = styled.div`
  height: 40px;
  width: 100%;
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.div`
  position: absolute;
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  top: calc(20px - 25px / 2);
  cursor: pointer;

  left: ${({ pos }) => {
    if (pos === 'left') {
      return '16px';
    }
    if (pos === 'right') {
      return `calc(280px - 25px - 16px)`;
    }
    return 0;
  }};

  svg {
    width: 25px;
    height: 25px;
  }
`;

const WeekWrapper = styled.ul`
  display: flex;
  margin-top: 8px;
  width: 224px;
  justify-content: space-between;
  background: white;
`;

const WeekDay = styled.li`
  font-weight: bolder;
  width: 32px;
  display: flex;
  justify-content: center;
`;

const DayWrapper = styled.ul`
  width: 224px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .selected-day {
    background: #eee;
  }
`;

const Day = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  background: white;
  cursor: ${({ day }) => {
    if (day === '') {
      return 'normal';
    }
    return 'pointer';
  }};
  padding: 8px 0;

  border-radius: 4px;
`;

const TimeWrapper = styled.div`
  position: absolute;
  left: 284px;
  border: 1px solid black;
  margin-top: 4px;
  border-radius: 4px;
  background: white;

  display: flex;
  padding: 4px;
`;

const LineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  cursor: pointer;
`;

const TimteInput = styled.input`
  width: 50px;
  text-align: center;
`;

const Empty = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  background: white;
`;

export default DateTimeBetweenPicker;
