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
  height: 22px;
  background-color: ${({ theme }) => theme.paginationStyle.backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.paginationStyle.borderColor};
  font-size: 12px;
`;

const PaginationItem = styled.li`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.paginationStyle.fontColor};
  transition: 0.3s;

  &:nth-of-type(n + 2) {
    border-left: 1px solid ${({ theme }) => theme.paginationStyle.divideLine};
  }

  &:hover {
    background-color: ${({ theme }) => theme.paginationStyle.hoverBackgroundColor};
    color: ${({ theme }) => theme.paginationStyle.hoverFontColor};
  }

  &:active {
    outline: 3px solid #b0bec5;
  }

  & svg {
    font-size: 20px;
  }

  &[aria-current] {
    background-color: ${({ theme }) => theme.paginationStyle.activeBackgroundColor};
    color: ${({ theme }) => theme.paginationStyle.activeFontColor};
    font-weight: bold;
    cursor: revert;
    transform: revert;
  }
`;

const ResultWrap = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  font-size: 12px;

  & select {
    width: 90px;
    height: 24px;
    margin-right: 15px;
    border: 1px solid #d2d2d2;
    border-radius: 5px;
    color: #212529;
    padding: 4px 18px 3px 6px;
  }
`;

export default Pagination;
