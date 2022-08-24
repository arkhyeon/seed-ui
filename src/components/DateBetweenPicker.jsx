import React, { useState, useEffect, useRef, useCallback } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

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
 * @param {String} param.pickerBg
 * datePicker의 전체 배경 색
 * default 값은 'white'
 * @param {String} param.headBg
 * datePicker의 제일 상단 배경 색
 * default 값은 '#eee'
 * @param {String} param.weekDaysBg
 * 요일 표시줄 배경색
 * default 값은 'white'
 * @param {String} param.selectedBg
 * 선택된 날짜들 배경 색
 * default 값은 '#808080'
 * @param {String} param.selectedFC
 * 선택된 날짜들 글씨 색
 * default 값은 'white'
 * @returns {JSX.Element} DateBetweenPicker Component
 */

function DateBetweenPicker({
  startDate = new Date(),
  endDate = new Date(),
  setStartDate = null,
  setEndDate = null,
  width = '100px',
  pickerBg = 'white',
  headBg = '#eee',
  weekDaysBg = 'white',
  selectedBg = '#808080',
  selectedFC = 'white',
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
    new Date(startDate.getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10),
  );
  const [endInputValue, setEndInputValue] = useState(
    new Date(endDate.getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10),
  );

  useEffect(() => {
    if (!isOpenEnd) {
      setStartDateViewed(startDate);
    }
    if (!isOpenEnd) {
      setEndDateViewed(endDate);
    }
  }, [isOpenEnd, isOpenStart, startDate, endDate]);

  useEffect(() => {
    setStartInputValue(
      new Date(startDate.getTime() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10),
    );
    setEndInputValue(
      new Date(endDate.getTime() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10),
    );
  }, [startDate, endDate]);

  const handleStartPicker = () => {
    setIsOpenStart(!isOpenStart);
    setIsOpenEnd(false);
  };
  const handleEndPicker = () => {
    setIsOpenEnd(!isOpenEnd);
    setIsOpenStart(false);
  };

  const handleNext = target => {
    if (target === 'start') {
      const dupDate = new Date(startDateViewed.getTime());

      dupDate.setMonth(dupDate.getMonth() + 1);
      setStartDateViewed(dupDate);
    } else if (target === 'end') {
      const dupDate = new Date(endDateViewed.getTime());

      dupDate.setMonth(dupDate.getMonth() + 1);
      setEndDateViewed(dupDate);
    }
  };

  const handlePrev = target => {
    if (target === 'start') {
      const dupDate = new Date(startDateViewed.getTime());

      dupDate.setMonth(dupDate.getMonth() - 1);
      setStartDateViewed(dupDate);
    } else if (target === 'end') {
      const dupDate = new Date(endDateViewed.getTime());

      dupDate.setMonth(dupDate.getMonth() - 1);
      setEndDateViewed(dupDate);
    }
  };

  const handleOutside = useCallback(
    e => {
      if (
        isOpenStart &&
        !startPickerRef.current.contains(e.target) &&
        !startInputRef.current.contains(e.target)
      ) {
        setIsOpenStart(false);
      }

      if (
        isOpenEnd &&
        !endPickerRef.current.contains(e.target) &&
        !endPickerRef.current.contains(e.target)
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

  const renderWeekDays = () => {
    return (
      <WeekWrapper weekDaysBg={weekDaysBg}>
        {weekDays.map((el, idx) => (
          <WeekDay key={`weekday-${idx}`}>{el}</WeekDay>
        ))}
      </WeekWrapper>
    );
  };

  const renderDays = target => {
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
        {days.map((el, idx) => (
          <Day
            key={`day-${idx}`}
            onClick={e => handleDayClick(e, target)}
            day={el}
            startDate={startDate}
            dateViewed={target === 'start' ? startDateViewed : endDateViewed}
            endDate={endDate}
            selectedBg={selectedBg}
            selectedFC={selectedFC}
          >
            {el}
          </Day>
        ))}
      </DayWrapper>
    );
  };

  const handleDayClick = (e, target) => {
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
      newEndDate = endDate;
    } else {
      newStartDate = startDate;
      newEndDate = new Date(`${year}-${month}-${day}`);
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
  };

  const handleInput = (e, target) => {
    let prevYear;
    let prevMonth;
    let prevDay;

    if (target === 'start') {
      [prevYear, prevMonth, prevDay] = startInputValue.split('-');
    } else if (target === 'end') {
      [prevYear, prevMonth, prevDay] = endInputValue.split('-');
    }

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
        newEndDate = endDate;
      } else {
        newStartDate = startDate;
        newEndDate = new Date(`${convertedYear}-${convertedMonth}-${convertedDay}`);
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

  const checkStartEnd = (startDate, endDate) => {
    return endDate.getTime() - startDate.getTime() >= 0;
  };

  const renderYear = target => {
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
      >
        {temp.map(el => (
          <option key={`year-${el}`} value={el}>
            {el}
          </option>
        ))}
      </select>
    );
  };

  const renderMonth = target => {
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
      >
        {temp.map(el => (
          <option key={`month-${el}`} value={el}>
            {el}
          </option>
        ))}
      </select>
    );
  };

  const changeYear = (e, target) => {
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
  };

  const changeMonth = (e, target) => {
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
  };

  return (
    <Wrapper>
      <div style={{ position: 'relative' }}>
        <Input
          width={width}
          onClick={handleStartPicker}
          ref={startInputRef}
          value={startInputValue}
          onChange={e => handleInput(e, 'start')}
        />
        {isOpenStart && (
          <PickWrapper ref={startPickerRef} pickerBg={pickerBg}>
            <Head headBg={headBg}>
              <Button pos="left" width={width} onClick={() => handlePrev('start')}>
                <AiOutlineLeft />
              </Button>
              <Button pos="right" width={width} onClick={() => handleNext('start')}>
                <AiOutlineRight />
              </Button>
              {renderYear('start')}
              {renderMonth('start')}
            </Head>
            {renderWeekDays()}
            {renderDays('start')}
          </PickWrapper>
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
        />
        {isOpenEnd && (
          <PickWrapper ref={endPickerRef} pickerBg={pickerBg}>
            <Head headBg={headBg}>
              <Button pos="left" width={width} onClick={() => handlePrev('end')}>
                <AiOutlineLeft />
              </Button>
              <Button pos="right" width={width} onClick={() => handleNext('end')}>
                <AiOutlineRight />
              </Button>
              {renderYear('end')}
              {renderMonth('end')}
            </Head>
            {renderWeekDays()}
            {renderDays('end')}
          </PickWrapper>
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
  background: ${({ pickerBg }) => pickerBg};

  -webkit-touch-callout: none;
  user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
`;

const Head = styled.div`
  height: 40px;
  width: 100%;
  background: ${({ headBg }) => headBg};
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
  background: ${({ weekDaysBg }) => weekDaysBg};
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

  ${({ day, startDate, endDate, dateViewed, selectedBg, selectedFC }) => {
    if (day === '') {
      return css`
        background: transparent;
      `;
    }

    if (dateViewed.getFullYear() < startDate.getFullYear()) {
      return css`
        background: transparent;
        :hover {
          background: #eee;
        }
      `;
    }
    if (
      dateViewed.getFullYear() === startDate.getFullYear() &&
      dateViewed.getMonth() < startDate.getMonth()
    ) {
      return css`
        background: transparent;
        :hover {
          background: #eee;
        }
      `;
    }
    if (
      dateViewed.getFullYear() === startDate.getFullYear() &&
      dateViewed.getMonth() === startDate.getMonth() &&
      day < startDate.getDate()
    ) {
      return css`
        background: transparent;
        :hover {
          background: #eee;
        }
      `;
    }
    if (dateViewed.getFullYear() > endDate.getFullYear()) {
      return css`
        background: transparent;
        :hover {
          background: #eee;
        }
      `;
    }
    if (
      dateViewed.getFullYear() === endDate.getFullYear() &&
      dateViewed.getMonth() > endDate.getMonth()
    ) {
      return css`
        background: transparent;
        :hover {
          background: #eee;
        }
      `;
    }
    if (
      dateViewed.getFullYear() === endDate.getFullYear() &&
      dateViewed.getMonth() === endDate.getMonth() &&
      day > endDate.getDate()
    ) {
      return css`
        background: transparent;
        :hover {
          background: #eee;
        }
      `;
    }

    return css`
      background: ${selectedBg};
      color: ${selectedFC};
    `;
  }};
`;

export default DateBetweenPicker;
