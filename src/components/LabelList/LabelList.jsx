import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { MdLabelOutline } from 'react-icons/md';
import { css } from '@emotion/react';
import _ from 'lodash';
import LabelWrapper from './LabelWrapper';

/**
 * @param {String[]} params.labelList
 * 생성된 라벨의 리스트
 * default 값은 ['그룹 1', '그룹 2']
 * @param {Function} params.createFunction
 * '그룹 만들기' 버튼을 눌렀을 때 실행되는 이벤트
 * default 값은 null
 * @param {String} params.direction
 * 라벨이 나열될 방향
 * default 값은 'left'
 * @param {String} params.unit
 * 현재 LabelList의 단위
 * default 값은 '그룹'
 * @param {Function} params.handleUpdate
 * 라벨 선택 창이 열리고 닫힐 때, 실행 되는 함수
 * 현재 컴포넌트의 외부에서 labelList 값이 변경되었을 때, 해당 값을 업데이트 시키기 위해 사용
 * default 값은 () => {}
 * @returns {JSX.Component} LabelList Component
 */

function LabelList({
  labelList = [],
  valueList = [],
  selectedValueList = [],
  setSelectedValueList = null,
  createFunction = null,
  direction = 'left',
  unit = '그룹',
  handleUpdate = () => {},
  disabled = false,
}) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const selectorRef = useRef(null);
  const dataList = valueList.map((value, i) => {
    return { value, label: labelList[i] || value };
  });

  const handleOut = useCallback(
    e => {
      if (isSelectorOpen && !selectorRef.current.contains(e.target) && e.target.tagName !== 'svg') {
        setIsSelectorOpen(false);
      }
    },
    [isSelectorOpen],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleOut);
    return () => {
      document.removeEventListener('mousedown', handleOut);
    };
  }, [handleOut]);

  const handleOpen = useCallback(() => {
    handleUpdate();
    setIsSelectorOpen(!isSelectorOpen);
  }, [isSelectorOpen, handleUpdate]);

  const renderLabel = useCallback(() => {
    const LabelViewList = [];
    for (let i = 0; i < selectedValueList.length; i++) {
      dataList.forEach(data => {
        if (selectedValueList[i] === data.value) {
          LabelViewList.push(data);
        }
      });
    }

    return LabelViewList.map(data => {
      return <LabelView key={`label-${data.value}`}>{data.label}</LabelView>;
    });
  }, [selectedValueList, labelList, valueList]);

  return (
    <Section disabled={disabled}>
      {direction === 'left' && (
        <LabelViewWrapper direction={direction} className="labels">
          {renderLabel()}
        </LabelViewWrapper>
      )}
      <SelectorWrap direction={direction} ref={selectorRef}>
        {disabled || <MdLabelOutline onClick={handleOpen} />}
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
        <LabelViewWrapper direction={direction} className="labels">
          {renderLabel()}
        </LabelViewWrapper>
      )}
    </Section>
  );
}

const Section = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ disabled }) => (disabled ? '0px' : '5px')};
`;

const SelectorWrap = styled.div`
  position: relative;
  height: 28px;
  svg {
    font-size: 28px;
    cursor: pointer;
  }

  & .label-selector {
    ${({ direction }) => {
      if (direction === 'left') {
        return css`
          top: 45px;
          left: -220px;
        `;
      }
    }}
  }
`;

const LabelViewWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: ${({ direction }) => (direction === 'left' ? 'flex-end' : 'flex-start')};
`;

const LabelView = styled.div`
  display: flex;
  border-radius: 15px;
  font-size: 13px;
  padding: 3px 20px 4px;
  background: #78909c;
  color: white;
  cursor: default;
`;

export default LabelList;
