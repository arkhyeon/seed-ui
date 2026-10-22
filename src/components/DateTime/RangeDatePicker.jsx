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
import { css } from '@emotion/react';
import _ from 'lodash';
import useSeedFloating from '../../common/useSeedFloating';
import { FLOATING_PROP, clickedInsideFloating } from '../../common/floating';
import { TextInput } from '../InputComp/InputComponent';
import { formatDate } from './timeComponents/PickerCommonFunc';
import {
  WEEK_DAYS,
  CALENDAR_WIDTH,
  PickerNav,
  PickerInputIcon,
  Wrapper,
  WeekWrapper,
  DayGrid,
  panelStyle,
  headerBand,
  todayDot,
  isSameDay,
} from './dateComponents/PickerShared';

const RangePickerContext = createContext(null);
function useRangePicker() {
  const ctx = useContext(RangePickerContext);
  if (!ctx) throw new Error('useRangePicker must be used within RangeDatePickerProvider');
  return ctx;
}

// ─── Utils ───────────────────────────────────────────────────────────────────

const toDate = val => {
  if (!val) return null;
  if (val instanceof Date) return Number.isNaN(val.getTime()) ? null : val;
  const d = new Date(`${val}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};

const toDateString = val => {
  if (!val) return '';
  if (val instanceof Date) return Number.isNaN(val.getTime()) ? '' : formatDate(val);
  return val;
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

  let mm = mmRaw;
  if (mmRaw.length === 1) {
    if (Number(mmRaw) > 1) mm = `0${mmRaw}`;
  } else if (mmRaw.length === 2) {
    const mv = Number(mmRaw);
    if (mv < 1) mm = '01';
    else if (mv > 12) mm = '12';
  }

  if (digits.length <= 6) return `${yyyy}-${mm}`;

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

  let hh = hhRaw;
  if (hhRaw.length === 1) {
    if (Number(hhRaw) > 2) hh = `0${hhRaw}`;
  } else if (hhRaw.length === 2) {
    const hv = Number(hhRaw);
    if (hv > 23) hh = '23';
  }

  if (digits.length <= 2) return hh;

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

const NO_END = '9999-12-31';

// ─── DateInput ───────────────────────────────────────────────────────────────

function DateInput({ value, onChange, startDate, endDate, placeholder = 'YYYY-MM-DD', disabled = false }) {
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
      disabled={disabled}
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
  const noEnd = endDt === NO_END;
  const s = toDate(startDt);
  const e = toDate(endDt);
  const dayCount = s && e && !noEnd ? Math.round(Math.abs(e - s) / 86400000) + 1 : null;

  return (
    <InputRowWrap>
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
      <InputHalf cols={hasEndTime ? 2 : 1}>
        <InputCell>
          <InputLabel>
            종료일
            {dayCount && <DayCount>{dayCount}일</DayCount>}
          </InputLabel>
          <DateInput
            value={endDt}
            onChange={setEndDt}
            startDate={startDate}
            endDate={endDate}
            disabled={noEnd}
          />
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
    { label: '당해', action: () => setRange(new Date(today.getFullYear(), 0, 1), today) },
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
    { label: '당해', action: () => setRange(today, new Date(today.getFullYear(), 11, 31)) },
    { label: '1년', action: () => setRange(today, addMonths(today, 12)) },
  ];

  return (
    <QuickRow>
      <QuickWrap>
        {allowPast && (
          <QuickGroup>
            <QuickGroupLabel>과거</QuickGroupLabel>
            <QuickButtons>
              {pastButtons.map(({ label, action }) => (
                <QuickBtn type="button" key={label} onClick={action}>
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
                <QuickBtn type="button" key={label} onClick={action}>
                  {label}
                </QuickBtn>
              ))}
            </QuickButtons>
          </QuickGroup>
        )}
      </QuickWrap>
      <TodayBtn type="button" onClick={() => setRange(today, today)}>
        오늘
      </TodayBtn>
    </QuickRow>
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

  const today = useMemo(() => new Date(), []);

  const getDayStatus = useCallback(
    day => {
      const empty = { isStart: false, isEnd: false, inRange: false, isHover: false, band: null };
      if (!day) return empty;
      const d = new Date(viewedYear, viewedMonth - 1, day);
      const effectiveEnd = rangeEnd || hoverDate;
      const isStart = !!rangeStart && d.getTime() === rangeStart.getTime();
      const isEnd = !!rangeEnd && d.getTime() === rangeEnd.getTime();
      const isHover = !rangeEnd && !!hoverDate && d.getTime() === hoverDate.getTime();
      let inRange = false;
      // 선택 구간 띠: 양 끝 칸은 반쪽만 칠해서 원형 끝점과 자연스럽게 이어지게
      let band = null;
      if (rangeStart && effectiveEnd && rangeStart.getTime() !== effectiveEnd.getTime()) {
        const lo = rangeStart < effectiveEnd ? rangeStart : effectiveEnd;
        const hi = rangeStart < effectiveEnd ? effectiveEnd : rangeStart;
        inRange = d > lo && d < hi;
        if (d.getTime() === lo.getTime()) band = 'right';
        else if (d.getTime() === hi.getTime()) band = 'left';
        else if (inRange) band = 'full';
      }
      return { isStart, isEnd, inRange, isHover, band };
    },
    [viewedYear, viewedMonth, rangeStart, rangeEnd, hoverDate],
  );

  return (
    <DayGrid>
      {dayRange.map((day, idx) => {
        const disabled =
          isMonthBeforeStart ||
          isMonthAfterEnd ||
          (isStartBoundaryMonth && sd > day) ||
          (isEndBoundaryMonth && ed < day);
        const { isStart, isEnd, isHover, band } = getDayStatus(day);
        const clickable = !disabled && !!day;
        const col = idx % 7;
        return (
          <RangeDayCell
            key={`day-${idx}`}
            $day={day}
            $disabled={disabled || !day}
            $selected={isStart || isEnd}
            $hover={isHover}
            $band={band}
            $rowStart={col === 0 || day === 1}
            $rowEnd={col === 6 || !dayRange[idx + 1]}
            $today={!!day && isSameDay(new Date(viewedYear, viewedMonth - 1, day), today)}
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
            <span>{day}</span>
          </RangeDayCell>
        );
      })}
    </DayGrid>
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

  // 달력 위치: Floating UI(포털+flip/shift). 좌우 넘침은 shift가 자동 보정(기존 alignRight 대체).
  const { refs, floatingStyles } = useSeedFloating(isOpen, {
    placement: 'bottom-start',
    gap: 4,
    clampHeight: false,
  });

  const rangeStart = useMemo(() => toDate(startDt), [startDt]);
  const rangeEnd = useMemo(() => toDate(endDt), [endDt]);

  const handleInputClick = useCallback(() => {
    if (disabled) return;
    setIsOpen(o => !o);
    setSelectingPhase('start');
  }, [disabled]);

  const handleDayClick = useCallback(
    day => {
      if (selectingPhase === 'start') {
        setStartDt(formatDate(day));
        if (endDt !== NO_END) setEndDt('');
        setSelectingPhase(endDt === NO_END ? 'start' : 'end');
      } else {
        if (endDt === NO_END) return;
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
    [selectingPhase, rangeStart, setStartDt, setEndDt, onApply, endDt],
  );

  useEffect(() => {
    const handler = ({ target }) => {
      // 입력 영역·(포털된) 달력 안이면 유지
      if (wrapperRef.current?.contains(target) || clickedInsideFloating(target)) return;
      setIsOpen(false);
      // start만 찍고 닫으면 end를 start로 맞춰 당일 범위로 완성 (미선택으로 인한 API 400 방지)
      if (selectingPhase === 'end' && !rangeEnd && startDt) {
        setEndDt(startDt);
        setSelectingPhase('start');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [selectingPhase, rangeEnd, startDt, setEndDt]);

  // 한쪽만 선택하고 적용하면 나머지도 같은 날짜로 맞춰 당일 검색처럼 처리
  const handleApply = useCallback(() => {
    let s = startDt;
    let e = endDt;
    if (s && !e) {
      e = s;
      setEndDt(e);
    } else if (!s && e) {
      s = e;
      setStartDt(s);
    }
    setSelectingPhase('start');
    setHoverDate(null);
    if (onApply) onApply(s, e);
    setIsOpen(false);
  }, [startDt, endDt, setStartDt, setEndDt, onApply]);

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
      <Wrapper
        ref={node => {
          wrapperRef.current = node;
          refs.setReference(node);
        }}
      >
        <TextInput
          className="range-picker-input"
          value={inputText}
          placeholder="시작일 ~ 종료일"
          onClick={handleInputClick}
          readOnly
          disabled={disabled}
        />
        <PickerInputIcon />
        {isOpen &&
          createPortal(
            <RangePickerWrapper ref={refs.setFloating} {...FLOATING_PROP} style={floatingStyles}>
              <CalendarsRow>{children}</CalendarsRow>
              <PanelDivider />
              <InputRow />
              {endDt !== NO_END && (
                <>
                  <PanelDivider />
                  <QuickRangeButtons />
                </>
              )}
              {endDt !== NO_END && onApply && (
                <ApplyRow>
                  <ApplyBtn type="button" onClick={handleApply}>
                    적용
                  </ApplyBtn>
                </ApplyRow>
              )}
            </RangePickerWrapper>,
            document.body,
          )}
      </Wrapper>
    </RangePickerContext.Provider>
  );
}

// ─── Public Component ─────────────────────────────────────────────────────────

function RangeDatePicker({
  startDt: startDtProp = '',
  setStartDt = () => {},
  endDt: endDtProp = '',
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
  const startDt = toDateString(startDtProp);
  const endDt = toDateString(endDtProp);
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

  useEffect(() => {
    if (setStartTime && !startTime) setStartTime('00:00');
  }, []);
  useEffect(() => {
    if (setEndTime && !endTime) setEndTime('00:00');
  }, []);

  const initLeft = useMemo(() => {
    let base;
    if (startDt) base = new Date(`${startDt}T00:00:00`);
    // allowPast면 왼쪽=지난달 / 오른쪽=이번달, 아니면 왼쪽=이번달 / 오른쪽=다음달
    else if (allowPast) base = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    else base = new Date(today.getFullYear(), today.getMonth(), 1);
    return Number.isNaN(base.getTime()) ? new Date() : base;
  }, []);

  const [leftViewed, setLeftViewed] = useState(initLeft);
  const [rightViewed, setRightViewed] = useState(() => {
    const d = new Date(initLeft);
    d.setMonth(d.getMonth() + 1);
    return d;
  });

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
  ${panelStyle};
  ${headerBand(14)};
  padding: 14px;
  /* 달력 2개 너비에 맞춤(빠른 선택 버튼이 패널을 넓히지 않게) */
  width: ${CALENDAR_WIDTH * 2 + 20 + 30}px;
  overflow: hidden;
  font-size: 14px;
`;

const CalendarsRow = styled.div`
  display: flex;
  gap: 20px;
`;

const PanelDivider = styled.div`
  height: 1px;
  background: var(--seed-border);
  margin: 10px 0;
`;

const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: ${CALENDAR_WIDTH}px;
`;

const RangeDayCell = styled.li`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  & > span {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    color: var(--seed-text);
    transition: background-color 0.12s, color 0.12s;
  }

  /* 선택 구간 띠 */
  ${({ $band, $rowStart, $rowEnd }) =>
    $band &&
    css`
      &::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: ${$band === 'right' ? '50%' : 0};
        right: ${$band === 'left' ? '50%' : 0};
        background: var(--x-fde8e8);
        border-top-left-radius: ${$band === 'full' && $rowStart ? '10px' : 0};
        border-bottom-left-radius: ${$band === 'full' && $rowStart ? '10px' : 0};
        border-top-right-radius: ${$band === 'full' && $rowEnd ? '10px' : 0};
        border-bottom-right-radius: ${$band === 'full' && $rowEnd ? '10px' : 0};
      }
    `}

  ${({ $day, $disabled }) =>
    $day &&
    !$disabled &&
    css`
      cursor: pointer;
      &:hover > span {
        background-color: var(--seed-hover);
      }
    `}

  ${({ $today }) =>
    $today &&
    css`
      & > span {
        color: var(--seed-primary);
        font-weight: 600;
        ${todayDot};
      }
    `}

  ${({ $hover }) =>
    $hover &&
    css`
      & > span,
      &:hover > span {
        background-color: var(--seed-surface);
        box-shadow: inset 0 0 0 1.5px var(--seed-primary);
        color: var(--seed-primary);
      }
    `}

  ${({ $selected }) =>
    $selected &&
    css`
      & > span,
      &:hover > span {
        background-color: var(--seed-primary);
        color: var(--seed-invert-text);
        font-weight: 600;
        box-shadow: 0 4px 10px -3px var(--seed-primary);
      }
    `}

  ${({ $day, $disabled }) =>
    $day &&
    $disabled &&
    css`
      cursor: default;
      & > span {
        color: var(--seed-text-muted);
        opacity: 0.45;
      }
    `}
`;

const InputRowWrap = styled.div`
  display: flex;
  width: 100%;
  gap: 20px;
`;

const InputHalf = styled.div`
  flex: 1;
  max-width: ${CALENDAR_WIDTH}px;
  display: grid;
  grid-template-columns: ${({ cols }) => `repeat(${cols}, 1fr)`};
  gap: 8px;
  box-sizing: border-box;
`;

const InputCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const DayCount = styled.span`
  margin-left: 6px;
  padding: 1px 7px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: var(--x-fde8e8);
  color: var(--seed-primary);
`;

const InputLabel = styled.span`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: var(--seed-text-secondary);
  white-space: nowrap;
`;

const StyledInput = styled.input`
  height: 30px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  border: 1px solid var(--seed-border);
  border-radius: 8px;
  background: var(--seed-surface);
  color: var(--seed-text);
  padding: 0 10px;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  &:focus {
    border-color: var(--seed-primary);
    box-shadow: 0 0 0 3px var(--x-fde8e8);
  }
  &:disabled {
    background: var(--seed-surface-alt);
    color: var(--seed-text-muted);
  }
  &::placeholder {
    color: var(--seed-text-muted);
  }
`;

const QuickRow = styled.div`
  display: flex;
  gap: 10px;
`;

const QuickWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const QuickGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuickGroupLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--seed-text-muted);
  white-space: nowrap;
  width: 28px;
`;

const QuickButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const QuickBtn = styled.button`
  all: unset;
  cursor: pointer;
  font-size: 12px;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: var(--seed-surface);
  color: var(--seed-text-secondary);
  border: 1px solid var(--seed-border);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  transition: background-color 0.12s, color 0.12s, border-color 0.12s;
  &:hover {
    background: var(--x-fde8e8);
    color: var(--seed-primary);
    border-color: var(--seed-primary);
  }
`;

const TodayBtn = styled.button`
  all: unset;
  cursor: pointer;
  box-sizing: border-box;
  min-width: 56px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  background: var(--x-fde8e8);
  color: var(--seed-primary);
  transition: background-color 0.12s, color 0.12s;
  &:hover {
    background: var(--seed-primary);
    color: var(--seed-invert-text);
  }
`;

const ApplyRow = styled.div`
  margin-top: 10px;
`;

const ApplyBtn = styled.button`
  all: unset;
  cursor: pointer;
  display: block;
  width: 100%;
  height: 32px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  border-radius: 10px;
  background: var(--seed-primary);
  color: var(--seed-invert-text);
  box-shadow: 0 4px 12px -4px var(--seed-primary);
  transition: filter 0.12s;
  &:hover {
    filter: brightness(0.94);
  }
`;

export default RangeDatePicker;
