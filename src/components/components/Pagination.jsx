import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  BiArrowToLeft,
  BiArrowToRight,
  BiLeftArrowAlt,
  BiRightArrowAlt,
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from 'react-icons/all';

function Pagination({ totalLength = 0, buttonLength = 10, pageEvent }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataLength, setDataLength] = useState(20);
  const offset = Math.floor((currentPage - 1) / buttonLength) * buttonLength;
  const btnTotalLength = Math.ceil(totalLength / dataLength);
  const movePage = pageNum => {
    if (currentPage === pageNum || pageNum <= 0 || btnTotalLength < pageNum) {
      return;
    }
    pageEvent(pageNum, dataLength);
    setCurrentPage(pageNum);
  };

  const changeDataLength = e => {
    const selectValue = parseInt(e.target.value, 10);
    setDataLength(selectValue);
    pageEvent(1, selectValue);
    setCurrentPage(1);
  };

  return (
    <>
      <PaginationWarp>
        <PaginationItem onClick={() => movePage(1)}>
          <BiArrowToLeft />
        </PaginationItem>
        <DivideLine />
        <PaginationItem
          onClick={() => movePage(currentPage - buttonLength)}
          className="rowBackPass"
        >
          <MdOutlineArrowBackIosNew />
          <BiLeftArrowAlt />
        </PaginationItem>
        <DivideLine />
        <PaginationItem onClick={() => movePage(currentPage - 1)}>
          <BiLeftArrowAlt />
        </PaginationItem>
        <DivideLine />
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
        <DivideLine />
        <PaginationItem onClick={() => movePage(currentPage + 1)}>
          <BiRightArrowAlt />
        </PaginationItem>
        <DivideLine />
        <PaginationItem
          onClick={() => movePage(currentPage + buttonLength)}
          className="rowFrontPass"
        >
          <BiRightArrowAlt />
          <MdOutlineArrowForwardIos />
        </PaginationItem>
        <DivideLine />
        <PaginationItem onClick={() => movePage(btnTotalLength)}>
          <BiArrowToRight />
        </PaginationItem>
      </PaginationWarp>
      <ResultWrap>
        Results: {btnTotalLength === currentPage ? totalLength : currentPage * dataLength} of{' '}
        {totalLength}
        <select onChange={e => changeDataLength(e)}>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
          <option value="999999">전체</option>
        </select>
      </ResultWrap>
    </>
  );
}

const PaginationWarp = styled.ul`
  width: fit-content;
  height: 40px;
  background-color: ${({ theme }) => theme.paginationStyle.backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const PaginationItem = styled.li`
  width: 43px;
  height: 38px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;

  &:hover {
    background-color: ${({ theme }) => theme.paginationStyle.hoverBackgroundColor};
    font-color: ${({ theme }) => theme.paginationStyle.hoverFontColor};
  }

  & svg {
    font-size: 24px;
  }

  &[aria-current] {
    background-color: ${({ theme }) => theme.paginationStyle.hoverBackgroundColor};
    font-color: ${({ theme }) => theme.paginationStyle.hoverFontColor};
    font-weight: bold;
    cursor: revert;
    transform: revert;
  }

  &.rowBackPass svg {
    position: relative;

    &:first-of-type {
      left: 5px;
      font-size: 18px;
    }
    &:last-of-type {
      right: 5px;
    }
  }

  &.rowFrontPass svg {
    position: relative;

    &:first-of-type {
      left: 5px;
    }
    &:last-of-type {
      font-size: 18px;
      right: 5px;
    }
  }
`;

const DivideLine = styled.div`
  width: 1px;
  height: 38px;
  background-color: ${({ theme }) => theme.paginationStyle.divideLine};
`;

const ResultWrap = styled.div`
  margin-left: 5px;

  & select {
    margin-left: 5px;
    width: 90px;
  }
`;

export default Pagination;
