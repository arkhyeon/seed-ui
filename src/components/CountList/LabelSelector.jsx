import React, { useCallback, forwardRef } from 'react';
import styled from '@emotion/styled';
import { MdOutlineNewLabel } from 'react-icons/md';
import Option from './Option';

const LabelSelector = forwardRef(({ labelList, setLabelList, createLabel, modifyLabel }, ref) => {
  const renderOptions = useCallback(() => {
    return (
      <>
        {labelList.map((el, idx) => (
          <Option
            key={`label-${el}`}
            value={el}
            setLabelList={setLabelList}
            labelList={labelList}
            modifyLabel={modifyLabel}
          />
        ))}
      </>
    );
  }, [labelList, setLabelList, modifyLabel]);

  return (
    <Wrapper ref={ref}>
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
});

const Wrapper = styled.div`
  position: absolute;
  width: 250px;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background: white;
  z-index: 998;
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
  padding-left: 15px;
  height: 43px;
  font-size: 14px;
  display: flex;
  align-items: center;
`;

const DividingLine = styled.div`
  width: 100%;
  height: 1px;
  background: #d2d2d2;
  padding: 0px !important;
`;

const CreateBtn = styled.div`
  padding-left: 15px;
  height: 32px;
  font-size: 14px;

  :hover {
    background: rgb(62, 62, 62);
    color: white;
  }
  cursor: pointer;
  display: flex;
  align-items: center;

  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;

  svg {
    height: 15px;
    width: 15px;
  }
`;

export default LabelSelector;
