import React, { useState } from 'react';
import styled from '@emotion/styled';
import { CgChevronDoubleLeft, CgChevronDoubleRight } from 'react-icons/cg';

import {
  MdOutlineFirstPage,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineLastPage,
} from 'react-icons/md';

function Pagination({ totalLength = 0, buttonLength = 10, pageEvent, currentPage = 1 }) {
  const [dataLength, setDataLength] = useState(20);
  const offset = Math.floor((currentPage - 1) / buttonLength) * buttonLength;
  const btnTotalLength = Math.ceil(totalLength / dataLength);
  const movePage = pageNum => {
    if (currentPage === pageNum || pageNum <= 0 || btnTotalLength < pageNum) {
      return;
    }
    pageEvent(pageNum, dataLength);
  };

  const changeDataLength = e => {
    const selectValue = parseInt(e.target.value, 10);
    setDataLength(selectValue);
    pageEvent(1, selectValue);
  };

  return (
    <>
      <PaginationWarp>
        <PaginationItem onClick={() => movePage(1)}>
          <MdOutlineFirstPage />
        </PaginationItem>
        <PaginationItem
          onClick={() => movePage(currentPage - buttonLength)}
          className="rowBackPass"
        >
          <CgChevronDoubleLeft />
        </PaginationItem>
        <PaginationItem onClick={() => movePage(currentPage - 1)}>
          <MdOutlineKeyboardArrowLeft />
        </PaginationItem>
        {Array.from(Array(btnTotalLength), (_, i) => i + 1)
          .slice(offset, offset + buttonLength)
          .map(arr => (
            <PaginationItem
              onClick={() => movePage(arr)}
              aria-current={currentPage === arr ? 'page' : null}
              key={arr}
            >
              {arr}
            </PaginationItem>
          ))}
        <PaginationItem onClick={() => movePage(currentPage + 1)}>
          <MdOutlineKeyboardArrowRight />
        </PaginationItem>
        <PaginationItem
          onClick={() => movePage(currentPage + buttonLength)}
          className="rowFrontPass"
        >
          <CgChevronDoubleRight />
        </PaginationItem>
        <PaginationItem onClick={() => movePage(btnTotalLength)}>
          <MdOutlineLastPage />
        </PaginationItem>
      </PaginationWarp>
      <ResultWrap>
        <select onChange={e => changeDataLength(e)}>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
          <option value="999999">전체</option>
        </select>
        Results: {btnTotalLength === currentPage ? totalLength : currentPage * dataLength} of{' '}
        {totalLength}
      </ResultWrap>
    </>
  );
}

const PaginationWarp = styled.ul`
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 0;
  margin: 0;
  font-size: 13px;
  list-style: none;
`;

const PaginationItem = styled.li`
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: var(--seed-text);
  background: var(--seed-surface);
  border: 1px solid var(--seed-border);
  border-radius: 8px;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease,
    transform 0.1s ease;
  user-select: none;

  &:hover {
    background-color: var(--seed-hover);
    border-color: var(--seed-border-strong);
  }

  &:active {
    transform: scale(0.92);
  }

  & svg {
    font-size: 18px;
  }

  &[aria-current] {
    background-color: var(--seed-primary);
    border-color: var(--seed-primary);
    color: #fff;
    font-weight: 700;
    cursor: default;
    &:hover {
      background-color: var(--seed-primary);
      border-color: var(--seed-primary);
    }
  }
`;

const ResultWrap = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  font-size: 12px;
  color: var(--seed-text);

  & select {
    width: 90px;
    height: 30px;
    margin-right: 15px;
    border: 1px solid var(--seed-border);
    border-radius: 8px;
    background: var(--seed-surface);
    color: var(--seed-text);
    padding: 4px 18px 3px 6px;
  }
`;

export default Pagination;
