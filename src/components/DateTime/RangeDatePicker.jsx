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
import { css } from '@emotion/react';
import _ from 'lodash';
import { TextInput } from '../InputComp/InputComponent';
import { formatDate } from './timeComponents/PickerCommonFunc';
import { WEEK_DAYS, PickerNav, Wrapper, WeekWrapper } from './dateComponents/PickerShared';

const RangePickerContext = createContext(null);
function useRangePicker() {
  const ctx = useContext(RangePickerContext);
  if (!ctx) throw new Error('useRangePicker must be used within RangeDatePickerProvider');
  return ctx;
}

// ─── Utils ───────────────────────────────────────────────────────────────────

const toDate = str => {
  if (!str) return null;
  const d = new Date(`${str}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};

const isSameOrAfter = (a, b) =>
  a.getFullYear() > b.getFullYear() ||
  (a.getFullYear() === b.getFullYear() && a.getMonth() >= b.getMonth());

const clampDate = (date, min, max) => {
  if (date < min) return new Date(min);
  if (date > max) return new Date(max);
  return date;
};

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

const addMonths = (date, n) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
};

const formatDateInput = raw => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;

  const yyyy = digits.slice(0, 4);
  const mmRaw = digits.slice(4, 6);
  const ddRaw = digits.slice(6, 8);

  // month auto-pad: if first digit > 1, prepend 0; clamp to 12
  let mm = mmRaw;
  if (mmRaw.length === 1) {
    if (Number(mmRaw) > 1) mm = `0${mmRaw}`;
  } else if (mmRaw.length === 2) {
    const mv = Number(mmRaw);
    if (mv < 1) mm = '01';
    else if (mv > 12) mm = '12';
  }

  if (digits.length <= 6) return `${yyyy}-${mm}`;

  // day auto-pad: if first digit > 3, prepend 0; clamp to max days in month
  const maxDay = new Date(Number(yyyy), Number(mm), 0).getDate();
  let dd = ddRaw;
  if (ddRaw.length === 1) {
    if (Number(ddRaw) > 3) dd = `0${ddRaw}`;
  } else if (ddRaw.length === 2) {
    const dv = Number(ddRaw);
    if (dv < 1) dd = '01';
    else if (dv > maxDay) dd = String(maxDay).padStart(2, '0');
  }

  return `${yyyy}-${mm}-${dd}`;
};

const isValidDateStr = (str, startDate, endDate) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const [y, m, day] = str.split('-').map(Number);
  if (m < 1 || m > 12) return false;
  if (day < 1 || day > new Date(y, m, 0).getDate()) return false;
  const d = new Date(`${str}T00:00:00`);
  if (Number.isNaN(d.getTime())) return false;
  if (startDate && d < startDate) return false;
  if (endDate && d > endDate) return false;
  return true;
};

const formatTimeInput = raw => {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 1) return digits;

  const hhRaw = digits.slice(0, 2);
  const mmRaw = digits.slice(2, 4);

  // hour auto-pad: if first digit > 2, prepend 0; clamp to 23
  let hh = hhRaw;
  if (hhRaw.length === 1) {
    if (Number(hhRaw) > 2) hh = `0${hhRaw}`;
  } else if (hhRaw.length === 2) {
    const hv = Number(hhRaw);
    if (hv > 23) hh = '23';
  }

  if (digits.length <= 2) return hh;

  // minute: clamp to 59
  let mm = mmRaw;
  if (mmRaw.length === 2) {
    const mv = Number(mmRaw);
    if (mv > 59) mm = '59';
  }

  return `${hh}:${mm}`;
};

const isValidTime = str => {
  if (!/^\d{2}:\d{2}$/.test(str)) return false;
  const [h, m] = str.split(':').map(Number);
  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
};

// ─── DateInput ───────────────────────────────────────────────────────────────
function DateInput({ value, onChange, startDate, endDate, placeholder = 'YYYY-MM-DD' }) {
  const [local, setLocal] = useState(value || '');

  useEffect(() => setLocal(value || ''), [value]);

  const handleChange = e => {
    const formatted = formatDateInput(e.target.value);
    setLocal(formatted);
    if (formatted.length === 10 && isValidDateStr(formatted, startDate, endDate)) {
      onChange(formatted);
    }
  };

  const handleBlur = () => {
    if (!local) return;
    if (local.length === 10 && isValidDateStr(local, startDate, endDate)) {
      onChange(local);
    } else {
      setLocal(value || '');
    }
  };

  return (
    <StyledInput
      value={local}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      maxLength={10}
    />
  );
}

// ─── TimeInput ───────────────────────────────────────────────────────────────
function TimeInput({ value, onChange, placeholder = 'HH:mm' }) {
  const [local, setLocal] = useState(value || '');

  useEffect(() => setLocal(value || ''), [value]);

  const handleChange = e => {
    const formatted = formatTimeInput(e.target.value);
    setLocal(formatted);
    if (formatted.length === 5 && isValidTime(formatted)) {
      onChange(formatted);
    }
  };

  const handleBlur = () => {
    if (!local) {
      onChange('');
      return;
    }
    if (isValidTime(local)) onChange(local);
    else setLocal(value || '');
  };

  return (
    <StyledInput
      value={local}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      maxLength={5}
    />
  );
}

// ─── InputRow ────────────────────────────────────────────────────────────────
function InputRow() {
  const {
    startDt,
    setStartDt,
    endDt,
    setEndDt,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    startDate,
    endDate,
  } = useRangePicker();

  const hasStartTime = startTime !== undefined;
  const hasEndTime = endTime !== undefined;

  return (
    <InputRowWrap>
      {/* 왼쪽 반 = 왼쪽 캘린더 너비 */}
      <InputHalf cols={hasStartTime ? 2 : 1}>
        <InputCell>
          <InputLabel>시작일</InputLabel>
          <DateInput
            value={startDt}
            onChange={setStartDt}
            startDate={startDate}
            endDate={endDate}
          />
        </InputCell>
        {hasStartTime && (
          <InputCell>
            <InputLabel>시작 시간</InputLabel>
            <TimeInput value={startTime} onChange={setStartTime} />
          </InputCell>
        )}
      </InputHalf>
      {/* 오른쪽 반 = 오른쪽 캘린더 너비 */}
      <InputHalf cols={hasEndTime ? 2 : 1}>
        <InputCell>
          <InputLabel>종료일</InputLabel>
          <DateInput value={endDt} onChange={setEndDt} startDate={startDate} endDate={endDate} />
        </InputCell>
        {hasEndTime && (
          <InputCell>
            <InputLabel>종료 시간</InputLabel>
            <TimeInput value={endTime} onChange={setEndTime} />
          </InputCell>
        )}
      </InputHalf>
    </InputRowWrap>
  );
}

// ─── QuickRangeButtons ───────────────────────────────────────────────────────
function QuickRangeButtons() {
  const {
    setStartDt,
    setEndDt,
    startDate,
    endDate,
    setLeftViewed,
    setRightViewed,
    allowPast,
    allowFuture,
  } = useRangePicker();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const setRange = useCallback(
    (start, end) => {
      const s = clampDate(start, startDate, endDate);
      const e = clampDate(end, startDate, endDate);
      setStartDt(formatDate(s));
      setEndDt(formatDate(e));
      setLeftViewed(s);
      setRightViewed(e);
    },
    [startDate, endDate, setStartDt, setEndDt, setLeftViewed, setRightViewed],
  );

  const pastButtons = [
    { label: '1일', action: () => setRange(addDays(today, -1), today) },
    { label: '7일', action: () => setRange(addDays(today, -6), today) },
    {
      label: '당월',
      action: () => setRange(new Date(today.getFullYear(), today.getMonth(), 1), today),
    },
    { label: '1개월', action: () => setRange(addMonths(today, -1), today) },
    { label: '3개월', action: () => setRange(addMonths(today, -3), today) },
    { label: '6개월', action: () => setRange(addMonths(today, -6), today) },
    {
      label: '당해',
      action: () => setRange(new Date(today.getFullYear(), 0, 1), today),
    },
    { label: '1년', action: () => setRange(addMonths(today, -12), today) },
  ];

  const futureButtons = [
    { label: '1일', action: () => setRange(today, addDays(today, 1)) },
    { label: '7일', action: () => setRange(today, addDays(today, 6)) },
    {
      label: '당월',
      action: () => setRange(today, new Date(today.getFullYear(), today.getMonth() + 1, 0)),
    },
    { label: '1개월', action: () => setRange(today, addMonths(today, 1)) },
    { label: '3개월', action: () => setRange(today, addMonths(today, 3)) },
    { label: '6개월', action: () => setRange(today, addMonths(today, 6)) },
    {
      label: '당해',
      action: () => setRange(today, new Date(today.getFullYear(), 11, 31)),
    },
    { label: '1년', action: () => setRange(today, addMonths(today, 12)) },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <QuickWrap>
        {allowPast && (
          <QuickGroup>
            <QuickGroupLabel>과거</QuickGroupLabel>
            <QuickButtons>
              {pastButtons.map(({ label, action }) => (
                <QuickBtn key={label} onClick={action}>
                  {label}
                </QuickBtn>
              ))}
            </QuickButtons>
          </QuickGroup>
        )}
        {allowFuture && (
          <QuickGroup>
            <QuickGroupLabel>미래</QuickGroupLabel>
            <QuickButtons>
              {futureButtons.map(({ label, action }) => (
                <QuickBtn key={label} onClick={action}>
                  {label}
                </QuickBtn>
              ))}
            </QuickButtons>
          </QuickGroup>
        )}
      </QuickWrap>
      <QuickBtn
        onClick={() => setRange(today, today)}
        className="felx-cc"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'auto',
          margin: '2px 4px 2px 2px',
        }}
      >
        오늘
      </QuickBtn>
    </div>
  );
}

// ─── RangeDay ────────────────────────────────────────────────────────────────

function RangeDay({ dateViewed }) {
  const { startDate, endDate, rangeStart, rangeEnd, hoverDate, setHoverDate, handleDayClick } =
    useRangePicker();

  const viewedYear = dateViewed.getFullYear();
  const viewedMonth = dateViewed.getMonth() + 1;
  const sy = startDate.getFullYear();
  const sm = startDate.getMonth() + 1;
  const sd = startDate.getDate();
  const ey = endDate.getFullYear();
  const em = endDate.getMonth() + 1;
  const ed = endDate.getDate();

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

  const isMonthBeforeStart = viewedYear < sy || (viewedYear === sy && viewedMonth < sm);
  const isMonthAfterEnd = viewedYear > ey || (viewedYear === ey && viewedMonth > em);
  const isStartBoundaryMonth = viewedYear === sy && viewedMonth === sm;
  const isEndBoundaryMonth = viewedYear === ey && viewedMonth === em;

  const getDayStatus = useCallback(
    day => {
      if (!day) return { isStart: false, isEnd: false, inRange: false };
      const d = new Date(viewedYear, viewedMonth - 1, day);
      const effectiveEnd = rangeEnd || hoverDate;
      const isStart = rangeStart && d.getTime() === rangeStart.getTime();
      const isEnd = rangeEnd && d.getTime() === rangeEnd.getTime();
      let inRange = false;
      if (rangeStart && effectiveEnd) {
        const lo = rangeStart < effectiveEnd ? rangeStart : effectiveEnd;
        const hi = rangeStart < effectiveEnd ? effectiveEnd : rangeStart;
        inRange = d > lo && d < hi;
      }
      return { isStart, isEnd, inRange };
    },
    [viewedYear, viewedMonth, rangeStart, rangeEnd, hoverDate],
  );

  return (
    <DayWrapper>
      {dayRange.map((day, idx) => {
        const disabled =
          isMonthBeforeStart ||
          isMonthAfterEnd ||
          (isStartBoundaryMonth && sd > day) ||
          (isEndBoundaryMonth && ed < day);
        const { isStart, isEnd, inRange } = getDayStatus(day);
        const clickable = !disabled && !!day;
        return (
          <RangeDayCell
            key={`day-${idx}`}
            day={day}
            disabled={disabled || !day}
            isStart={isStart}
            isEnd={isEnd}
            inRange={inRange}
            onClick={
              clickable ? () => handleDayClick(new Date(viewedYear, viewedMonth - 1, day)) : null
            }
            onMouseEnter={
              clickable && !rangeEnd
                ? () => setHoverDate(new Date(viewedYear, viewedMonth - 1, day))
                : null
            }
            onMouseLeave={!rangeEnd ? () => setHoverDate(null) : null}
          >
            {day}
          </RangeDayCell>
        );
      })}
    </DayWrapper>
  );
}

// ─── SingleCalendar ───────────────────────────────────────────────────────────

function SingleCalendar({ dateViewed, setDateViewed }) {
  const { startDate, endDate } = useRangePicker();

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth() + 1;
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth() + 1;

  const handleMonthChange = useCallback(
    amount => {
      const d = new Date(dateViewed);
      d.setMonth(d.getMonth() + amount);
      const ty = d.getFullYear();
      const tm = d.getMonth() + 1;
      if (amount < 0 && (ty < startYear || (ty === startYear && tm < startMonth))) return;
      if (amount > 0 && (ty > endYear || (ty === endYear && tm > endMonth))) return;
      setDateViewed(d);
    },
    [dateViewed, startYear, startMonth, endYear, endMonth, setDateViewed],
  );

  return (
    <CalendarWrapper>
      <PickerNav
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
        {WEEK_DAYS.map(w => (
          <li key={w}>{w}</li>
        ))}
      </WeekWrapper>
      <RangeDay dateViewed={dateViewed} />
    </CalendarWrapper>
  );
}

// ─── Provider ────────────────────────────────────────────────────────────────

function RangeDatePickerProvider({
  startDt,
  setStartDt,
  endDt,
  setEndDt,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  disabled,
  startDate,
  endDate,
  allowPast,
  allowFuture,
  onApply,
  setLeftViewed,
  setRightViewed,
  children,
}) {
  const wrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);
  const [selectingPhase, setSelectingPhase] = useState('start');

  const rangeStart = useMemo(() => toDate(startDt), [startDt]);
  const rangeEnd = useMemo(() => toDate(endDt), [endDt]);

  const handleDayClick = useCallback(
    day => {
      if (selectingPhase === 'start') {
        setStartDt(formatDate(day));
        setEndDt('');
        setSelectingPhase('end');
      } else {
        if (rangeStart && day < rangeStart) {
          setStartDt(formatDate(day));
          setEndDt(formatDate(rangeStart));
        } else {
          setEndDt(formatDate(day));
        }
        setSelectingPhase('start');
        setHoverDate(null);
        if (!onApply) setIsOpen(false);
      }
    },
    [selectingPhase, rangeStart, setStartDt, setEndDt, onApply],
  );

  useEffect(() => {
    const handler = ({ target }) => {
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setIsOpen(false);
        if (selectingPhase === 'end' && !rangeEnd) {
          setStartDt('');
          setSelectingPhase('start');
        }
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [selectingPhase, rangeEnd, setStartDt]);

  const inputText = useMemo(() => {
    const parts = [];
    if (startDt) parts.push(startTime ? `${startDt} ${startTime}` : startDt);
    if (endDt) parts.push(endTime ? `${endDt} ${endTime}` : endDt);
    if (parts.length === 0) return '';
    if (parts.length === 1) return `${parts[0]} ~ `;
    return parts.join(' ~ ');
  }, [startDt, endDt, startTime, endTime]);

  const value = useMemo(
    () => ({
      rangeStart,
      rangeEnd,
      hoverDate,
      setHoverDate,
      handleDayClick,
      startDate,
      endDate,
      allowPast,
      allowFuture,
      startDt,
      setStartDt,
      endDt,
      setEndDt,
      startTime,
      setStartTime,
      endTime,
      setEndTime,
      setLeftViewed,
      setRightViewed,
    }),
    [
      rangeStart,
      rangeEnd,
      hoverDate,
      handleDayClick,
      startDate,
      endDate,
      allowPast,
      allowFuture,
      startDt,
      setStartDt,
      endDt,
      setEndDt,
      startTime,
      setStartTime,
      endTime,
      setEndTime,
      setLeftViewed,
      setRightViewed,
    ],
  );

  return (
    <RangePickerContext.Provider value={value}>
      <Wrapper ref={wrapperRef}>
        <TextInput
          className="range-picker-input"
          value={inputText}
          placeholder="시작일 ~ 종료일"
          onClick={() => {
            if (!disabled) {
              setIsOpen(o => !o);
              setSelectingPhase('start');
            }
          }}
          readOnly
          disabled={disabled}
        />
        {isOpen && (
          <RangePickerWrapper>
            <CalendarsRow>{children}</CalendarsRow>
            <PanelDivider />
            <InputRow />
            <PanelDivider />
            <QuickRangeButtons />
            {onApply && (
              <ApplyRow>
                <ApplyBtn
                  onClick={() => {
                    onApply();
                    setIsOpen(false);
                  }}
                >
                  적용
                </ApplyBtn>
              </ApplyRow>
            )}
          </RangePickerWrapper>
        )}
      </Wrapper>
    </RangePickerContext.Provider>
  );
}

// ─── Public Component ─────────────────────────────────────────────────────────

/**
 * @param {string}   startDt       - 'YYYY-MM-DD'
 * @param {function} setStartDt
 * @param {string}   endDt         - 'YYYY-MM-DD'
 * @param {function} setEndDt
 * @param {string}   [startTime]   - 'HH:mm' — 있을 때만 시작 시간 표시
 * @param {function} [setStartTime]
 * @param {string}   [endTime]     - 'HH:mm' — 있을 때만 종료 시간 표시
 * @param {function} [setEndTime]
 * @param {boolean}  [disabled]
 * @param {Date}     [startDate]   - 선택 가능 최소일
 * @param {Date}     [endDate]     - 선택 가능 최대일
 * @param {boolean}  [allowPast=true]   - false면 오늘 이전 날짜 선택 불가
 * @param {boolean}  [allowFuture=true] - false면 오늘 이후 날짜 선택 불가
 * @param {function} [onApply]     - 있으면 적용 버튼 표시 후 클릭 시 실행
 */
function RangeDatePicker({
  startDt = '',
  setStartDt = () => {},
  endDt = '',
  setEndDt = () => {},
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  disabled = false,
  startDate = new Date('2023-01-01'),
  endDate = new Date('2040-12-31'),
  allowPast = true,
  allowFuture = true,
  onApply,
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const effectiveStartDate = useMemo(
    () => (!allowPast && today > startDate ? today : startDate),
    [allowPast, today, startDate],
  );

  const effectiveEndDate = useMemo(
    () => (!allowFuture && today < endDate ? today : endDate),
    [allowFuture, today, endDate],
  );

  // 시간 prop이 있는데 값이 비어있으면 '00:00' 초기값 세팅
  useEffect(() => {
    if (setStartTime && !startTime) setStartTime('00:00');
  }, []);
  useEffect(() => {
    if (setEndTime && !endTime) setEndTime('00:00');
  }, []);
  const initLeft = useMemo(() => {
    let base;
    if (!allowPast) base = new Date(today.getFullYear(), today.getMonth(), 1);
    else if (!allowFuture) base = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    else base = startDt ? new Date(`${startDt}T00:00:00`) : new Date();
    return Number.isNaN(base.getTime()) ? new Date() : base;
  }, []);

  const [leftViewed, setLeftViewed] = useState(initLeft);
  const [rightViewed, setRightViewed] = useState(() => {
    const d = new Date(initLeft);
    d.setMonth(d.getMonth() + 1);
    return d;
  });

  // allowPast=false  → left 최솟값 = today 달
  // allowFuture=false → right 최댓값 = today 달, left 최댓값 = today-1 달
  const clampLeft = useCallback(
    d => {
      const dFirst = new Date(d.getFullYear(), d.getMonth(), 1);
      if (!allowPast) {
        const minFirst = new Date(today.getFullYear(), today.getMonth(), 1);
        if (dFirst < minFirst) return minFirst;
      }
      if (!allowFuture) {
        const maxFirst = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        if (dFirst > maxFirst) return maxFirst;
      }
      return d;
    },
    [allowPast, allowFuture, today],
  );

  const clampRight = useCallback(
    d => {
      const dFirst = new Date(d.getFullYear(), d.getMonth(), 1);
      if (!allowPast) {
        const minFirst = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        if (dFirst < minFirst) return minFirst;
      }
      if (!allowFuture) {
        const maxFirst = new Date(today.getFullYear(), today.getMonth(), 1);
        if (dFirst > maxFirst) return maxFirst;
      }
      return d;
    },
    [allowPast, allowFuture, today],
  );

  const handleSetLeft = useCallback(
    d => {
      const clamped = clampLeft(d);
      setLeftViewed(clamped);
      setRightViewed(prev => {
        if (!isSameOrAfter(clamped, prev)) return clampRight(prev);
        const next = new Date(clamped);
        next.setMonth(next.getMonth() + 1);
        return clampRight(next);
      });
    },
    [clampLeft, clampRight],
  );

  const handleSetRight = useCallback(
    d => {
      const clamped = clampRight(d);
      setRightViewed(clamped);
      setLeftViewed(prev => {
        if (!isSameOrAfter(prev, clamped)) return clampLeft(prev);
        const next = new Date(clamped);
        next.setMonth(next.getMonth() - 1);
        return clampLeft(next);
      });
    },
    [clampLeft, clampRight],
  );

  return (
    <RangeDatePickerProvider
      startDt={startDt}
      setStartDt={setStartDt}
      endDt={endDt}
      setEndDt={setEndDt}
      startTime={startTime}
      setStartTime={setStartTime}
      endTime={endTime}
      setEndTime={setEndTime}
      disabled={disabled}
      startDate={effectiveStartDate}
      endDate={effectiveEndDate}
      allowPast={allowPast}
      allowFuture={allowFuture}
      onApply={onApply}
      setLeftViewed={handleSetLeft}
      setRightViewed={handleSetRight}
    >
      <SingleCalendar dateViewed={leftViewed} setDateViewed={handleSetLeft} />
      <SingleCalendar dateViewed={rightViewed} setDateViewed={handleSetRight} />
    </RangeDatePickerProvider>
  );
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const RangePickerWrapper = styled.div`
  position: absolute;
  margin-top: 4px;
  background: white;
  z-index: 80;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  padding: 8px;
  width: fit-content;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
`;

const CalendarsRow = styled.div`
  display: flex;
  gap: 0;
`;

const PanelDivider = styled.div`
  height: 1px;
  background: #eeeeee;
  margin: 8px 0;
`;

const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px;
`;

const DayWrapper = styled.ul`
  width: 100% !important;
  height: 198px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 8px;
`;

const RangeDayCell = styled.li`
  width: 32px !important;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  margin-top: 1px;
  font-size: 13px;
  transition: background 0.1s;

  ${({ inRange }) =>
    inRange &&
    css`
      background-color: #fde8e8;
      border-radius: 0;
    `}
  ${({ isStart }) =>
    isStart &&
    css`
      background-color: #fb5b5b !important;
      color: white;
      border-radius: 4px 0 0 4px;
      box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    `}
  ${({ isEnd }) =>
    isEnd &&
    css`
      background-color: #fb5b5b !important;
      color: white;
      border-radius: 0 4px 4px 0;
      box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    `}
  ${({ day, disabled }) =>
    day &&
    !disabled &&
    css`
      cursor: pointer;
      &:hover {
        background-color: #f0b0b0;
        color: white;
      }
    `}
  ${({ day, disabled }) =>
    day &&
    disabled &&
    css`
      cursor: default;
      background-color: #ebebeb !important;
      color: #bbb;
    `}
`;

const InputRowWrap = styled.div`
  display: flex;
  width: 100%;
  gap: 0;
`;

const InputHalf = styled.div`
  flex: 1;
  max-width: 250px;
  display: grid;
  grid-template-columns: ${({ cols }) => `repeat(${cols}, 1fr)`};
  gap: 6px;
  padding: 2px 4px;
  box-sizing: border-box;
`;

const InputCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  overflow: hidden;
`;

const InputLabel = styled.span`
  font-size: 13px;
  color: #666;
  white-space: nowrap;
`;

const StyledInput = styled.input`
  height: 28px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  border: 1px solid #d0d0d0;
  border-radius: 3px;
  padding: 0 6px;
  font-size: 13px;
  outline: none;
  &:focus {
    border-color: #fb5b5b;
  }
  &::placeholder {
    color: #bbb;
  }
`;

const QuickWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 2px 4px;
`;

const QuickGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const QuickGroupLabel = styled.span`
  font-size: 12px;
  color: #888;
  white-space: nowrap;
  width: 30px;
`;

const QuickButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const QuickBtn = styled.button`
  all: unset;
  cursor: pointer;
  font-size: 12px;
  height: 30px;
  padding: 0 10px;
  border-radius: 3px;
  background: #f5f5f5;
  color: #444;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  transition: background 0.1s;
  &:hover {
    background: #fb5b5b;
    color: white;
    border-color: #fb5b5b;
  }
`;

const ApplyRow = styled.div`
  margin-top: 8px;
`;

const ApplyBtn = styled.button`
  all: unset;
  cursor: pointer;
  display: block;
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  font-size: 13px;
  text-align: center;
  border-radius: 4px;
  background: #3e3e3e;
  color: white;
  &:hover {
    background: #fb5b5b;
  }
`;

export default RangeDatePicker;
