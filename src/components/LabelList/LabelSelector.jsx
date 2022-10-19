import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { MdOutlineNewLabel } from 'react-icons/md';
import Option from './Option';

function LabelSelector({ labelList, valueArr, setValueArr, valueStr, setValueStr, createLabel }) {
  const renderOptions = useCallback(() => {
    if (valueStr !== undefined) {
      return (
        <>
          {labelList.map((el, idx) => (
            <Option key={`label-${el}`} value={el} valueStr={valueStr} setValueStr={setValueStr} />
          ))}
        </>
      );
    }

    return (
      <>
        {labelList.map((el, idx) => (
          <Option key={`label-${el}`} value={el} valueArr={valueArr} setValueArr={setValueArr} />
        ))}
      </>
    );
  }, [labelList, setValueArr, valueArr, valueStr, setValueStr]);

  return (
    <Wrapper>
      <Title>그룹 관리</Title>
      <DividingLine />
      {renderOptions()}
      <DividingLine />
      <CreateBtn onClick={createLabel}>
        <MdOutlineNewLabel />
        그룹 만들기
      </CreateBtn>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: absolute;
  width: 250px;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  /* margin-top: 4px; */

  & > div {
    padding-top: 4px;
    padding-bottom: 4px;
  }

  svg {
    margin-right: 8px;
  }
`;

const Title = styled.div`
  padding-left: 8px;
`;

const DividingLine = styled.div`
  width: 100%;
  height: 1px;
  background: #d2d2d2;
  padding: 0px !important;
`;

const CreateBtn = styled.div`
  padding-left: 12px;
  :hover {
    background: rgb(62, 62, 62);
    color: white;
  }
  cursor: pointer;
  display: flex;
  align-items: center;

  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

export default LabelSelector;
