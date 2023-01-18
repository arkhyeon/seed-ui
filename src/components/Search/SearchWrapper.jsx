import React, { useState } from 'react';
import styled from '@emotion/styled';
import { MdArrowDropDown } from 'react-icons/all';
import { BlackButton } from '../Button/Button';

function SearchWrapper({ props, children, detailSearchComp, search }) {
  const [detailView, setDetailView] = useState(true);

  const searchFunction = () => {
    setDetailView(false);
    search();
  };

  return (
    <SearchWrap>
      <DefaultSearchWrap>
        {children}
        {!detailView && <BlackButton onClick={searchFunction}>검색</BlackButton>}
        <p onClick={() => setDetailView(prevState => !prevState)}>
          <MdArrowDropDown />
          상세검색
        </p>
      </DefaultSearchWrap>
      {detailView && (
        <DetailSearchWrapper>
          {detailSearchComp}
          <BlackButton onClick={searchFunction}>검색</BlackButton>
        </DetailSearchWrapper>
      )}
    </SearchWrap>
  );
}

const SearchWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const DefaultSearchWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 2px 0 16px;

  & p:nth-of-type(n + 2) {
    margin-left: 15px;
  }
`;

const DetailSearchWrapper = styled.div`
  width: 100%;
  background-color: white;
  position: absolute;
  top: 96%;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 2px 0 16px;

  & p:nth-of-type(n + 2) {
    margin-left: 15px;
  }
`;

export default SearchWrapper;
