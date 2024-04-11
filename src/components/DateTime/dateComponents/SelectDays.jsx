import React from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import styled from '@emotion/styled';
import { addDays, addMonths } from '../timeComponents/PickerCommonFunc';

function SelectDays({ date, setDate, setDateViewed, startDate, endDate }) {
  const addDaysButton = day => {
    const changedDate = addDays(day, new Date(date));
    setChangeDate(changedDate);
  };

  const addMonthsButton = month => {
    const changedDate = addMonths(month, new Date(date));
    setChangeDate(changedDate);
  };

  const setChangeDate = changedDate => {
    if (changedDate < startDate) {
      setDateViewed(startDate);
      setDate(startDate);
      return;
    }

    if (changedDate > endDate) {
      setDateViewed(endDate);
      setDate(endDate);
      return;
    }

    setDateViewed(changedDate);
    setDate(changedDate);
  };

  return (
    <SelectDaysWrap>
      <div>
        10일
        <span onClick={() => addDaysButton(10)} role="button" aria-hidden>
          <FaPlus />
        </span>
        <span onClick={() => addDaysButton(-10)} role="button" aria-hidden>
          <FaMinus />
        </span>
      </div>
      <div>
        1개월
        <span onClick={() => addMonthsButton(1)} role="button" aria-hidden>
          <FaPlus />
        </span>
        <span onClick={() => addMonthsButton(-1)} role="button" aria-hidden>
          <FaMinus />
        </span>
      </div>
      <div>
        6개월
        <span onClick={() => addMonthsButton(6)} role="button" aria-hidden>
          <FaPlus />
        </span>
        <span onClick={() => addMonthsButton(-6)} role="button" aria-hidden>
          <FaMinus />
        </span>
      </div>
      <div>
        1년
        <span onClick={() => addMonthsButton(12)} role="button" aria-hidden>
          <FaPlus />
        </span>
        <span onClick={() => addMonthsButton(-12)} role="button" aria-hidden>
          <FaMinus />
        </span>
      </div>
    </SelectDaysWrap>
  );
}

const SelectDaysWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 8px;
  font-size: 14px;

  & div {
    width: 50px;
    height: 24px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background-color: #3e3e3e;
    border-radius: 3px;
    cursor: pointer;
  }

  & div:hover span {
    display: block;
  }

  & span {
    width: 50%;
    left: 0;
    position: absolute;
    display: none;
    text-align: center;
    background-color: #3e3e3e;
  }

  & span:nth-of-type(2) {
    left: 50%;
    border-left: 1px solid #ebebeb;
    box-sizing: border-box;
  }
`;

export default React.memo(SelectDays);
