import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { MdLabelOutline } from 'react-icons/md';
import { css } from '@emotion/react';
import LabelWrapper from './LabelWrapper';

function LabelList({
  labelList = [],
  valueList = [],
  selectedValueList = [],
  setSelectedValueList = () => {},
  createFunction = null,
  direction = 'left',
  unit = '그룹',
  handleUpdate = () => {},
  disabled = false,
}) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const selectorRef = useRef(null);

  const dataList = valueList.map((value, i) => ({
    value,
    label: labelList[i] || value,
  }));

  const handleOutsideClick = useCallback(
    e => {
      if (isSelectorOpen && selectorRef.current && !selectorRef.current.contains(e.target)) {
        setIsSelectorOpen(false);
      }
    },
    [isSelectorOpen],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const toggleSelector = useCallback(() => {
    handleUpdate();
    setIsSelectorOpen(prev => !prev);
  }, [handleUpdate]);

  const selectedLabels = dataList.filter(data => selectedValueList.includes(data.value));

  return (
    <Section disabled={disabled}>
      {direction === 'left' && (
        <LabelViewWrapper direction={direction}>
          {selectedLabels.map(data => (
            <LabelView key={`label-${data.value}`}>{data.label}</LabelView>
          ))}
        </LabelViewWrapper>
      )}

      <SelectorWrap direction={direction} ref={selectorRef}>
        {!disabled && <MdLabelOutline onClick={toggleSelector} />}
        {isSelectorOpen && (
          <LabelWrapper
            dataList={dataList}
            setSelectedValueList={setSelectedValueList}
            selectedValueList={selectedValueList}
            createFunction={createFunction}
            unit={unit}
          />
        )}
      </SelectorWrap>

      {direction === 'right' && (
        <LabelViewWrapper direction={direction}>
          {selectedLabels.map(data => (
            <LabelView key={`label-${data.value}`}>{data.label}</LabelView>
          ))}
        </LabelViewWrapper>
      )}
    </Section>
  );
}

const Section = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ disabled }) => (disabled ? '0' : '5px')};
`;

const SelectorWrap = styled.div`
  position: relative;
  height: 28px;
  svg {
    font-size: 28px;
    cursor: pointer;
  }

  .label-selector {
    ${({ direction }) =>
      direction === 'left' &&
      css`
        top: 45px;
        left: -220px;
      `}
  }
`;

const LabelViewWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: ${({ direction }) => (direction === 'left' ? 'flex-end' : 'flex-start')};
`;

const LabelView = styled.div`
  border-radius: 15px;
  font-size: 13px;
  padding: 3px 20px 4px;
  background: #78909c;
  color: white;
`;

export default LabelList;
