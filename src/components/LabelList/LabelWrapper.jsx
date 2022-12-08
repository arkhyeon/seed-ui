import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { MdOutlineNewLabel } from 'react-icons/md';
import Label from './Label';
import DividingLine from '../Line/DividingLine';

function LabelWrapper({
  dataList,
  valueArr,
  setSelectedValueList,
  createFunction,
  unit,
  selectedValueList,
}) {
  const renderOptions = useCallback(() => {
    return (
      <>
        {dataList.map(data => (
          <Label
            key={`label-${data.value}`}
            data={data}
            setSelectedValueList={setSelectedValueList}
            selectedValueList={selectedValueList}
            LabelButton={LabelButton}
          />
        ))}
      </>
    );
  }, [dataList, selectedValueList, setSelectedValueList, valueArr]);

  return (
    <LabelSelectorWrap className="label-selector">
      <Title className="label-selector-title">{unit} 관리</Title>
      <DividingLine className="label-selector-divide" />
      <LabelWrap>{renderOptions()}</LabelWrap>
      {createFunction && (
        <>
          <DividingLine className="label-selector-divide" />
          <LabelButton onClick={createFunction} className="label-selector-create">
            <MdOutlineNewLabel />
            {unit} 추가
          </LabelButton>
        </>
      )}
    </LabelSelectorWrap>
  );
}
const LabelSelectorWrap = styled.div`
  position: absolute;
  width: 250px;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background: white;
  z-index: 998;

  svg {
    margin-right: 8px;
  }
`;

const Title = styled.div`
  padding: 12.5px 0 12.5px 15px;
  font-size: 14px;
`;

const LabelWrap = styled.div`
  height: 320px;
  overflow: auto;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: white;
    border: 1px solid #eee;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #d3d3d3;
  }
`;

const LabelButton = styled.div`
  cursor: pointer;
  padding: 8px 0 8px 15px;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  align-items: center;

  svg {
    font-size: 15px;
    position: relative;
    top: 2px;
  }

  :hover {
    background: #3e3e3e;
    color: white;
  }
`;

export default LabelWrapper;
