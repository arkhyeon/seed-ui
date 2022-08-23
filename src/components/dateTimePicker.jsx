import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import styled from '@emotion/styled';
import {
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineCaretDown,
  AiOutlineCaretUp,
} from 'react-icons/ai';

/**
 * @param {Date} param.date
 * 선택하고자 하는 날짜, useState로 관리하는 값이여야 함
 * default 값은 new Date()
 * @param {Function} param.setDate
 * 날짜를 바꾸는 함수, setState 함수여야 함.
 * default 값은 null
 * @param {String} param.width
 * input 박스의 너비
 * default 값은 '100px'
 * @param {String} param.headBg
 * datePicker의 상단 부분 배경색
 * default 값은 '#eee'
 * @param {String} param.pickerBg
 * datePicker의 전체 배경색
 * default 값은 'white'
 * @param {String} param.weekDaysBg
 * 요일 표시 줄의 배경색
 * default 값은 'white'
 * @param {String} param.selectedBg
 * 선택된 날짜의 배경색
 * default 값은 '#808080'
 * @returns {JSX.Element} dateTimePicker Component
 */

function DateTimePicker({
  date = new Date(),
  setDate = null,
  width = '130px',
  headBg = '#eee',
  pickerBg = 'white',
  weekDaysBg = 'white',
  selectedBg = '#808080',
}) {
  const inputRef = useRef(null);
  const dateInfo = useRef(null);
  const weekDays = useRef(['일', '월', '화', '수', '목', '금', '토']).current;
  const [dateViewed, setDateViewed] = useState(date);
  const [inputValue, setInputValue] = useState(
    `${new Date(date.getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10)} ${new Date(date.getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(11, 16)}`,
  );
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);
  const timeRef = useRef(null);
  const [hourInput, setHourInput] = useState(
    `${new Date(date.getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(11, 13)}`,
  );
  const [minuteInput, setMinuteInput] = useState(
    `${new Date(date.getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(14, 16)}`,
  );
  const hourRef = useRef(null);
  const minuteRef = useRef(null);

  useLayoutEffect(() => {
    const timezoneOffset = new Date().getTimezoneOffset() * 60000;
    const timezoneDate = new Date(date.getTime() - timezoneOffset);

    setInputValue(
      `${timezoneDate.toISOString().slice(0, 10)} ${timezoneDate.toISOString().slice(11, 16)}`,
    );

    setHourInput(`${timezoneDate.toISOString().slice(11, 13)}`);
    setMinuteInput(`${timezoneDate.toISOString().slice(14, 16)}`);
  }, [date]);

  useLayoutEffect(() => {
    const timezoneOffset = new Date().getTimezoneOffset() * 60000;
    const timezoneDate = new Date(dateViewed.getTime() - timezoneOffset);
    if (isOpen) {
      dateInfo.current.textContent = `${timezoneDate.toISOString().slice(0, 4)}년 ${dateViewed
        .toISOString()
        .slice(5, 7)}월`;
    }
  }, [dateViewed, date, isOpen]);

  const handleClose = useCallback(
    e => {
      if (
        isOpen &&
        !pickerRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target) &&
        !timeRef.current.contains(e.target)
      ) {
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

  const handleInput = e => {
    const [prevYear, prevMonth, prevDay] = inputValue.slice(0, 10).split('-');
    const [year, month, day] = e.target.value.slice(0, 11).trim().split('-');
    const [prevHour, prevMinute] = inputValue.slice(11, 16).split(':');
    const [hour, minute] = e.target.value.slice(11, 17).trim().split(':');
    let convertedYear = '';
    let checkDiff = false;
    let convertedMonth = '';
    let convertedDay = '';
    let convertedHour = '';
    let convertedMinute = '';
    const cursorIdx = e.target.selectionStart;

    for (let i = 0; i < year.length; i++) {
      if (year[i - 1] !== prevYear[i - 1] && !checkDiff) {
        checkDiff = true;
      } else {
        convertedYear += year[i];
      }
    }

    for (let i = 0; i < month.length; i++) {
      if (month[i - 1] !== prevMonth[i - 1] && !checkDiff) {
        checkDiff = true;
      } else {
        convertedMonth += month[i];
      }
    }

    for (let i = 0; i < day.length; i++) {
      if (day[i - 1] !== prevDay[i - 1] && !checkDiff) {
        checkDiff = true;
      } else {
        convertedDay += day[i];
      }
    }

    for (let i = 0; i < hour.length; i++) {
      if (hour[i - 1] !== prevHour[i - 1] && !checkDiff) {
        checkDiff = true;
      } else {
        convertedHour += hour[i];
      }
    }

    for (let i = 0; i < minute.length; i++) {
      if (minute[i - 1] !== prevMinute[i - 1] && !checkDiff) {
        checkDiff = true;
      } else {
        convertedMinute += minute[i];
      }
    }

    if (convertedMonth[0] === '1' && cursorIdx === 6) {
      convertedMonth = `${convertedMonth[0]}0`;
    }

    if (cursorIdx === 6 || cursorIdx === 7) {
      convertedDay = '01';
    }

    if (convertedDay[0] === '3' && cursorIdx === 9) {
      convertedDay = `${convertedDay[0]}0`;
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
      setTimeout(() => {
        inputRef.current.setSelectionRange(cursorIdx, cursorIdx);
      }, 10);
    } else {
      const newDate = new Date(`${convertedYear}-${convertedMonth}-${convertedDay}`);
      newDate.setHours(parseInt(convertedHour, 10));
      newDate.setMinutes(parseInt(convertedMinute, 10));

      setDate(newDate);
      setDateViewed(newDate);
      setTimeout(() => {
        inputRef.current.setSelectionRange(cursorIdx, cursorIdx);
      }, 10);
    }
  };

  const checkValidate = input => {
    const reg = /^\d{4}-\d{2}-\d{2}$/;
    if (reg.test(input)) {
      return true;
    }
    return false;
  };

  function checkValidDate(value) {
    let result = true;
    try {
      const date = value.slice(0, 10).split('-');
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
  }

  const handlePrev = () => {
    const dupDate = new Date(dateViewed.getTime());

    dupDate.setMonth(dupDate.getMonth() - 1);
    setDateViewed(dupDate);
  };

  const handleNext = () => {
    const dupDate = new Date(dateViewed.getTime());

    dupDate.setMonth(dupDate.getMonth() + 1);
    setDateViewed(dupDate);
  };

  const renderWeekDays = () => {
    return (
      <WeekWrapper weekDaysBg={weekDaysBg}>
        {weekDays.map((el, idx) => (
          <WeekDay key={`weekday-${idx}`}>{el}</WeekDay>
        ))}
      </WeekWrapper>
    );
  };

  const renderDays = () => {
    const dupDate = new Date(dateViewed.getTime());
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
        {days.map((el, idx) => (
          <Day
            key={`day-${idx}`}
            onClick={handleDayClick}
            day={el}
            date={date}
            dateViewed={dateViewed}
            selectedBg={selectedBg}
          >
            {el}
          </Day>
        ))}
      </DayWrapper>
    );
  };

  const handleDayClick = e => {
    if (e.target.textContent === '') {
      return null;
    }

    const dupDate = new Date(dateViewed.getTime());

    const year = dupDate.getFullYear();
    const month = dupDate.getMonth() + 1;
    const day = parseInt(e.target.textContent, 10);

    const newDate = new Date(`${year}-${month}-${day}`);
    newDate.setHours(hourInput);
    newDate.setMinutes(minuteInput);

    setDate(newDate);
    setDateViewed(newDate);

    setIsOpen(false);
  };

  const addHour = () => {
    const parsedHour = parseInt(hourInput, 10);
    const dupDate = new Date(date.getTime());

    if (parsedHour + 1 < 24) {
      setHourInput(parsedHour + 1 < 10 ? `0${parsedHour + 1}` : parsedHour + 1);
      dupDate.setHours(parsedHour + 1);
    } else {
      setHourInput('00');
      dupDate.setHours(0);
    }
    setDate(dupDate);
  };

  const minusHour = () => {
    const parsedHour = parseInt(hourInput, 10);
    const dupDate = new Date(date.getTime());

    if (parsedHour - 1 > 0) {
      setHourInput(parsedHour - 1 < 10 ? `0${parsedHour - 1}` : parsedHour - 1);
      dupDate.setHours(parsedHour - 1);
    } else {
      setHourInput('23');
      dupDate.setHours(23);
    }
    setDate(dupDate);
  };

  const addMinute = () => {
    const parsedMinute = parseInt(minuteInput, 10);
    const dupDate = new Date(date.getTime());

    if (parsedMinute + 1 < 60) {
      setMinuteInput(parsedMinute + 1 < 10 ? `0${parsedMinute + 1}` : parsedMinute + 1);
      dupDate.setMinutes(parsedMinute + 1);
    } else {
      setMinuteInput('00');
      dupDate.setMinutes(0);
    }
    setDate(dupDate);
  };

  const minusMinute = () => {
    const parsedMinute = parseInt(minuteInput, 10);
    const dupDate = new Date(date.getTime());

    if (parsedMinute - 1 > 0) {
      setMinuteInput(parsedMinute - 1 < 10 ? `0${parsedMinute - 1}` : parsedMinute - 1);
      dupDate.setMinutes(parsedMinute - 1);
    } else {
      setMinuteInput('59');
      dupDate.setMinutes(59);
    }
    setDate(dupDate);
  };

  const handleHourInput = e => {
    const prevHour = String(hourInput);
    const hour = e.target.value;
    let convertedHour = '';
    let checkDiff = false;
    const cursorIdx = e.target.selectionStart;
    const dupDate = new Date(date.getTime());

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
      setHourInput(convertedHour);
      dupDate.setHours(parseInt(convertedHour, 10));
      setDate(dupDate);
    }
    setTimeout(() => {
      hourRef.current.setSelectionRange(cursorIdx, cursorIdx);
    }, 10);
  };

  const handleMinuteInput = e => {
    const prevMinute = String(minuteInput);
    const minute = e.target.value;
    let convertedMinute = '';
    let checkDiff = false;
    const cursorIdx = e.target.selectionStart;
    const dupDate = new Date(date.getTime());

    for (let i = 0; i < minute.length; i++) {
      if (minute[i - 1] !== prevMinute[i - 1] && !checkDiff) {
        checkDiff = true;
      } else {
        convertedMinute += minute[i];
      }
    }

    if (checkMinute(convertedMinute)) {
      setMinuteInput(convertedMinute);
      dupDate.setMinutes(parseInt(convertedMinute, 10));
      setDate(dupDate);
    }
    setTimeout(() => {
      minuteRef.current.setSelectionRange(cursorIdx, cursorIdx);
    }, 10);
  };

  const checkHour = input => {
    const reg = /^([01][0-9]|2[0-3])$/;

    return reg.test(input);
  };

  const checkMinute = input => {
    const reg = /^([0-5][0-9])$/;

    return reg.test(input);
  };

  return (
    <Wrapper>
      <Input
        width={width}
        ref={inputRef}
        onChange={handleInput}
        value={inputValue}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      />
      {isOpen && (
        <>
          <PickerWrapper ref={pickerRef} pickerBg={pickerBg}>
            <Head headBg={headBg}>
              <Button pos="left" width={width} onClick={handlePrev}>
                <AiOutlineLeft />
              </Button>
              <Button pos="right" width={width} onClick={handleNext}>
                <AiOutlineRight />
              </Button>
              <div ref={dateInfo} />
            </Head>
            {renderWeekDays()}
            {renderDays()}
          </PickerWrapper>
          <TimeWrapper ref={timeRef}>
            <LineWrapper>
              <AiOutlineCaretUp onClick={addHour} />
              <TimteInput value={hourInput} onChange={handleHourInput} ref={hourRef} />
              <AiOutlineCaretDown onClick={minusHour} />
            </LineWrapper>

            <LineWrapper>
              <AiOutlineCaretUp onClick={addMinute} />
              <TimteInput value={minuteInput} onChange={handleMinuteInput} ref={minuteRef} />
              <AiOutlineCaretDown onClick={minusMinute} />
            </LineWrapper>
          </TimeWrapper>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: ${({ width }) => width};
`;

const PickerWrapper = styled.div`
  position: absolute;

  margin-top: 4px;
  background: ${({ pickerBg }) => pickerBg};
  width: 280px;
  height: 300px;
  z-index: 80;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid black;

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
  background: ${({ headBg }) => headBg};
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

  left: ${({ pos, width }) => {
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
  background: ${({ weekDaysBg }) => weekDaysBg};
  justify-content: space-between;
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

  background: ${({ day, date, dateViewed, selectedBg }) => {
    if (
      dateViewed.getFullYear() === date.getFullYear() &&
      dateViewed.getMonth() === date.getMonth() &&
      parseInt(day, 10) === date.getDate()
    ) {
      return `${selectedBg}`;
    }
    return 'transparent';
  }};
`;

const TimeWrapper = styled.div`
  position: absolute;
  left: 284px;
  border: 1px solid black;
  margin-top: 4px;
  border-radius: 4px;

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

export default DateTimePicker;