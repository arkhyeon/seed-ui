import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { TextInput } from './components/InputComponent';

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
 * @returns {JSX.Element} datePicker Component
 */

function DatePicker({
  date = new Date(),
  setDate = null,
  width = '100px',
  headBg = '#eee',
  pickerBg = 'white',
  weekDaysBg = 'white',
  selectedBg = '#808080',
}) {
  const inputRef = useRef(null);
  const weekDays = useRef(['일', '월', '화', '수', '목', '금', '토']).current;
  const [dateViewed, setDateViewed] = useState(date);
  const [inputValue, setInputValue] = useState(
    new Date(date.getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10),
  );
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);
  const yearRef = useRef(null);
  const monthRef = useRef(null);

  useEffect(() => {
    const timezoneOffset = new Date().getTimezoneOffset() * 60000;
    const timezoneDate = new Date(date.getTime() - timezoneOffset);
    setInputValue(timezoneDate.toISOString().slice(0, 10));
  }, [date]);

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

  useEffect(() => {
    if (!isOpen) {
      const dupDate = new Date(date);
      dupDate.setDate(1);
      setDateViewed(dupDate);
    }
  }, [isOpen, setDateViewed, date]);

  useEffect(() => {
    if (yearRef.current) {
      yearRef.current.value = `${dateViewed.getFullYear()}년`;
    }

    if (monthRef.current) {
      monthRef.current.value = `${dateViewed.getMonth() + 1}월`;
    }
  }, [dateViewed]);

  const handleInput = e => {
    const [prevYear, prevMonth, prevDay] = inputValue.split('-');
    const [year, month, day] = e.target.value.split('-');
    let convertedYear = '';
    const checkDiff = false;
    let convertedMonth = '';
    let convertedDay = '';
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

    if (
      !checkValidate(`${convertedYear}-${convertedMonth}-${convertedDay}`) ||
      !checkValidDate(`${convertedYear}-${convertedMonth}-${convertedDay}`) ||
      checkDiff === 0
    ) {
      setTimeout(() => {
        inputRef.current.setSelectionRange(cursorIdx, cursorIdx);
      }, 10);
    } else {
      setDate(new Date(`${convertedYear}-${convertedMonth}-${convertedDay}`));
      setDateViewed(new Date(`${convertedYear}-${convertedMonth}-${convertedDay}`));
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

    const dupSelectedDate = new Date(date.getTime());
    const selectedYear = dupSelectedDate.getFullYear();
    const selectedMonth = dupSelectedDate.getMonth();
    const selectedDate = dupSelectedDate.getDate();

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
          if (
            selectedYear === year &&
            selectedMonth === month &&
            parseInt(el, 10) === selectedDate
          ) {
            return (
              <Day
                className="selected-day"
                key={`day-${idx}`}
                onClick={handleDayClick}
                day={el}
                date={date}
                dateViewed={dateViewed}
                selectedBg={selectedBg}
              >
                {el}
              </Day>
            );
          }
          return (
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
          );
        })}
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
    setDate(new Date(`${year}-${month}-${day}`));
    setDateViewed(new Date(`${year}-${month}-${day}`));

    setIsOpen(false);
  };

  const renderYear = () => {
    const temp = [];

    for (let i = 2000; i <= 2040; i++) {
      temp.push(`${i}년`);
    }

    return (
      <select defaultValue={`${date.getFullYear()}년`} onChange={changeYear} ref={yearRef}>
        {temp.map(el => (
          <option key={`year-${el}`} value={el}>
            {el}
          </option>
        ))}
      </select>
    );
  };

  const renderMonth = () => {
    const temp = [];

    for (let i = 1; i <= 12; i++) {
      temp.push(`${i}월`);
    }

    return (
      <select defaultValue={`${date.getMonth() + 1}월`} onChange={changeMonth} ref={monthRef}>
        {temp.map(el => (
          <option key={`month-${el}`} value={el}>
            {el}
          </option>
        ))}
      </select>
    );
  };

  const changeYear = e => {
    const dupDate = new Date(dateViewed);
    dupDate.setFullYear(e.target.value.slice(0, -1));
    setDateViewed(dupDate);
  };

  const changeMonth = e => {
    const dupDate = new Date(dateViewed);
    dupDate.setMonth(e.target.value.slice(0, -1) - 1);
    setDateViewed(dupDate);
  };

  return (
    <Wrapper>
      <TextInput
        className="date-picker-input"
        width={width}
        inputRef={inputRef}
        onChange={handleInput}
        value={inputValue}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      />
      {isOpen && (
        <PickerWrapper ref={pickerRef} pickerBg={pickerBg}>
          <Head headBg={headBg} className="date-picker-head">
            <Button pos="left" width={width} onClick={handlePrev} className="date-picker-button">
              <AiOutlineLeft />
            </Button>
            <Button pos="right" width={width} onClick={handleNext}>
              <AiOutlineRight />
            </Button>
            {renderYear()}
            {renderMonth()}
          </Head>
          {renderWeekDays()}
          {renderDays()}
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

export default DatePicker;
