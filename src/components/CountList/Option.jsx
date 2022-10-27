import React, { useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import { MdLabelOutline, MdDeleteOutline, MdEditCalendar } from 'react-icons/md';

function Option({ value, modifyLabel, setLabelList, labelList }) {
  const optionRef = useRef(null);

  const handleModify = useCallback(() => {
    modifyLabel(value);
  }, [value, modifyLabel]);

  const handleDelete = useCallback(() => {
    setLabelList(labelList.filter(el => el !== value));
  }, [setLabelList, value, labelList]);

  return (
    <Wrapper ref={optionRef} className="label-selector-option">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <MdLabelOutline />
        {value}
      </div>
      <ButtonWrapper>
        <MdDeleteOutline onClick={handleDelete} />
        <MdEditCalendar onClick={handleModify} />
      </ButtonWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  cursor: pointer;
  padding-left: 15px;
  display: flex;
  align-items: center;
  height: 32px;
  font-size: 14px;
  justify-content: space-between;

  svg {
    width: 15px;
    height: 15px;
  }

  :hover {
    background: rgb(62, 62, 62);
    color: white;
  }

  :first-of-type {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:hover {
    & > div > svg {
      visibility: visible;
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  visibility: hidden;

  svg {
    width: 21px;
    height: 21px;
    &:hover {
      fill: #e91e63;
    }
  }
`;

export default Option;
