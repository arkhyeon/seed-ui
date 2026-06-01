import React, { useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { arrayRange } from '../timeComponents/PickerCommonFunc';
import DataList from '../../InputComp/DataList';

export const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

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
      setData={changeYear}
      select
      defaultValue={viewedYear}
      height="200px"
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
      setData={changeMonth}
      select
      defaultValue={viewedMonth}
      height="200px"
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
}) {
  return (
    <PickerHeader>
      <NavButton onClick={onPrev}>
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
      <NavButton onClick={onNext}>
        <AiOutlineRight />
      </NavButton>
    </PickerHeader>
  );
}

export const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;

export const PickerHeader = styled.div`
  height: 40px;
  width: 100% !important;
  background: #3e3e3e;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const SelectWrapper = styled.div`
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

export const NavButton = styled.div`
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

export const WeekWrapper = styled.ul`
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
