import React, { useCallback } from 'react';
import _ from 'lodash';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

function Day({
  startYear,
  startMonth,
  startDay,
  endYear,
  endMonth,
  endDay,
  dateViewed,
  setDateViewed,
  date,
  setDate,
  setIsOpen,
}) {
  const handleDayClick = useCallback(
    e => {
      if (e.target.textContent === '') return;

      const changedDate = new Date(
        `${dateViewed.getFullYear()}-${dateViewed.getMonth() + 1}-${parseInt(
          e.target.textContent,
          10,
        )}`,
      );

      setDate(changedDate);
      setDateViewed(changedDate);

      setIsOpen(false);
    },
    [dateViewed, setDate, setDateViewed, setIsOpen],
  );

  const year = dateViewed.getFullYear();
  const month = dateViewed.getMonth();

  const dayRange = () => {
    const days = [];

    let startEmptyDays = new Date(year, month, 1).getDay();
    if (startEmptyDays === 7) {
      startEmptyDays = 0;
    }
    const mainDays = new Date(year, month + 1, 0).getDate();

    days.push(...Array(startEmptyDays).fill(''));
    days.push(..._.range(1, mainDays + 1));
    const endEmptyDays = 7 - (days.length % 7) === 7 ? 0 : 7 - (days.length % 7);
    days.push(...Array(endEmptyDays).fill(''));
    return days;
  };

  const isSameYM = date.getFullYear() === year && date.getMonth() === month;
  const isStartSameYM = startYear === year && startMonth === month + 1;
  const isEndSameYM = endYear === year && endMonth === month + 1;
  const selectedDate = date.getDate();

  return (
    <DayWrapper>
      {dayRange().map((day, idx) => {
        const cantSelected = (isStartSameYM && startDay > day) || (isEndSameYM && endDay < day);
        return (
          <Days
            className={
              isSameYM && day === selectedDate ? 'selected-day day' : 'non-selected-day day'
            }
            key={`day-${idx}`}
            onClick={cantSelected ? null : handleDayClick}
            day={day}
            date={date}
            dateViewed={dateViewed}
            sdt={cantSelected}
          >
            {day}
          </Days>
        );
      })}
    </DayWrapper>
  );
}

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

  ${({ day }) => {
    return (
      day &&
      css`
        &:hover {
          background-color: #eceff1;
        }
        cursor: pointer;
      `
    );
  }};

  ${({ sdt, day }) => {
    return (
      day &&
      sdt &&
      css`
        cursor: default;
        background-color: #ebebeb !important;
      `
    );
  }}
`;

export default Day;
