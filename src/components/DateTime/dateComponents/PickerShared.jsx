import React, { useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';
import { AiOutlineCalendar, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { arrayRange } from '../timeComponents/PickerCommonFunc';
import DataList from '../../InputComp/DataList';

export const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 달력 한 칸 크기(px) — 7칸 * CELL = 달력 본문 너비
export const CELL = 36;
export const ROW_HEIGHT = 32;
export const CALENDAR_WIDTH = CELL * 7;
// 상단 헤더(연/월 이동 28 + 간격 2 + 요일 26) 높이 — 패널 배경 색띠 높이 계산용
const HEADER_HEIGHT = 28 + 2 + 26;

export function Year({ dateViewed, setDateViewed, startYear, endYear, startMonth, endMonth }) {
  const viewedYear = dateViewed.getFullYear();

  const yearRange = useMemo(() => {
    const range = arrayRange(endYear - startYear + 1, startYear);
    if (!range.includes(viewedYear)) {
      range.push(viewedYear);
      range.sort((a, b) => a - b);
    }
    return range;
  }, [startYear, endYear, viewedYear]);

  const yearLabels = useMemo(() => yearRange.map(y => `${y}년`), [yearRange]);

  const changeYear = useCallback(
    value => {
      const d = new Date(dateViewed);
      d.setFullYear(value);
      if (startYear === value && d.getMonth() < startMonth - 1) d.setMonth(startMonth - 1);
      else if (endYear === value && d.getMonth() > endMonth - 1) d.setMonth(endMonth - 1);
      setDateViewed(d);
    },
    [dateViewed, endMonth, endYear, setDateViewed, startMonth, startYear],
  );

  return (
    <DataList
      valueList={yearRange}
      labelList={yearLabels}
      setData={changeYear}
      select
      defaultValue={viewedYear}
      height="200px"
      listMinWidth="104px"
    />
  );
}

export function Month({ dateViewed, setDateViewed, startYear, endYear, startMonth, endMonth }) {
  const viewedYear = dateViewed.getFullYear();
  const viewedMonth = dateViewed.getMonth() + 1;

  const monthRange = useMemo(() => {
    let range;
    if (startYear === viewedYear) range = arrayRange(12 - startMonth + 1, startMonth);
    else if (endYear === viewedYear) range = arrayRange(endMonth, 1);
    else range = arrayRange(12, 1);
    if (!range.includes(viewedMonth)) {
      range.push(viewedMonth);
      range.sort((a, b) => a - b);
    }
    return range;
  }, [viewedYear, viewedMonth, startYear, startMonth, endYear, endMonth]);

  const monthLabels = useMemo(() => monthRange.map(m => `${m}월`), [monthRange]);

  const changeMonth = useCallback(
    value => {
      const d = new Date(dateViewed);
      d.setMonth(value - 1);
      setDateViewed(d);
    },
    [dateViewed, setDateViewed],
  );

  return (
    <DataList
      valueList={monthRange}
      labelList={monthLabels}
      setData={changeMonth}
      select
      defaultValue={viewedMonth}
      height="200px"
      listMinWidth="88px"
    />
  );
}

export function PickerNav({
  onPrev,
  onNext,
  dateViewed,
  setDateViewed,
  startYear,
  endYear,
  startMonth,
  endMonth,
  className,
}) {
  return (
    <PickerHeader className={className}>
      <NavButton type="button" onClick={onPrev} aria-label="이전 달">
        <AiOutlineLeft />
      </NavButton>
      <SelectWrapper>
        <Year
          dateViewed={dateViewed}
          setDateViewed={setDateViewed}
          startYear={startYear}
          endYear={endYear}
          startMonth={startMonth}
          endMonth={endMonth}
        />
        <Month
          dateViewed={dateViewed}
          setDateViewed={setDateViewed}
          startYear={startYear}
          endYear={endYear}
          startMonth={startMonth}
          endMonth={endMonth}
        />
      </SelectWrapper>
      <NavButton type="button" onClick={onNext} aria-label="다음 달">
        <AiOutlineRight />
      </NavButton>
    </PickerHeader>
  );
}

// 입력창 오른쪽 달력 아이콘
export function PickerInputIcon() {
  return (
    <InputIconWrap aria-hidden>
      <AiOutlineCalendar />
    </InputIconWrap>
  );
}

export const isSameDay = (a, b) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const popIn = keyframes`
  from { opacity: 0; translate: 0 -4px; }
  to { opacity: 1; translate: 0 0; }
`;

// 패널 상단(연/월 이동 + 요일)에 연한 primary 색띠 + 구분선 — 레이아웃 높이 추가 없음
export const headerBand = padding => css`
  background: linear-gradient(var(--seed-border), var(--seed-border)) 0
      ${padding + HEADER_HEIGHT}px / 100% 1px no-repeat,
    linear-gradient(180deg, var(--x-fde8e8), var(--x-fde8e8)) 0 0 / 100%
      ${padding + HEADER_HEIGHT}px no-repeat,
    var(--seed-surface);
`;

// 떠있는 달력 패널 공통 스타일
export const panelStyle = css`
  background: var(--seed-surface);
  color: var(--seed-text);
  z-index: 10000;
  border: 1px solid var(--seed-border);
  border-radius: 14px;
  box-shadow: 0 12px 32px -8px var(--seed-shadow), 0 4px 10px -4px var(--seed-shadow);
  padding: 12px;
  box-sizing: border-box;
  animation: ${popIn} 0.14s ease-out;

  -webkit-touch-callout: none;
  user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
`;

export const Wrapper = styled.div`
  width: 100%;
  position: relative;

  & input {
    cursor: pointer;
    padding-right: 34px;
  }
  & input:disabled {
    cursor: default;
  }
`;

const InputIconWrap = styled.span`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  display: flex;
  pointer-events: none;
  color: var(--seed-text-muted);

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const PickerHeader = styled.div`
  height: 28px;
  width: 100% !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
`;

export const SelectWrapper = styled.div`
  width: auto !important;
  display: flex;
  gap: 2px;

  & > div {
    width: 84px !important;
    &:last-of-type {
      width: 64px !important;
    }
  }

  & input {
    cursor: pointer;
    height: 26px;
    padding: 0 20px 0 6px;
    text-overflow: clip;
    border: none;
    border-radius: 8px;
    background-color: transparent;
    background-position: right 4px center;
    background-size: 12px 10px;
    color: var(--seed-text);
    font-size: 14px;
    letter-spacing: -0.2px;
    font-weight: 600;
    transition: background-color 0.15s;

    &:hover,
    &:focus {
      background-color: var(--seed-hover);
    }
  }
`;

export const NavButton = styled.button`
  all: unset;
  box-sizing: border-box;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  color: var(--seed-text-secondary);
  transition: background-color 0.15s, color 0.15s;

  &:hover {
    background: var(--seed-hover);
    color: var(--seed-text);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const WeekWrapper = styled.ul`
  display: grid;
  grid-template-columns: repeat(7, ${CELL}px);
  width: ${CALENDAR_WIDTH}px !important;
  margin: 0 auto 2px;

  & li {
    height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    color: var(--seed-text-muted);
  }
  & li:first-of-type {
    color: var(--seed-danger);
  }
`;

export const DayGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(7, ${CELL}px);
  grid-auto-rows: ${ROW_HEIGHT}px;
  row-gap: 2px;
  width: ${CALENDAR_WIDTH}px !important;
  align-content: start;
  margin: 8px auto 0;
`;

// 오늘 표시(숫자 아래 점)
export const todayDot = css`
  &::after {
    content: '';
    position: absolute;
    bottom: 3px;
    left: 50%;
    width: 4px;
    height: 4px;
    margin-left: -2px;
    border-radius: 50%;
    background: currentColor;
  }
`;

