import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import LabelWrapper from './LabelWrapper';
import { MdLabelOutline } from 'react-icons/md';
import { css } from '@emotion/react';
import _ from 'lodash';

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
 * @param {String[]} params.valueArr
 * 선택된 라벨들을 관리하는 배열
 * 상위 컴포넌트에서 생성된 state 값
 * default 값은 []
 * @param {Funtion} params.setValueArr
 * valueArr을 관리하는 setState 함수
 * default 값은 null
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
  }, [selectedValueList]);

  return (
    <Section>
      {direction === 'left' && (
        <LabelViewWrapper className="labels">{renderLabel()}</LabelViewWrapper>
      )}
      <SelectorWrap direction={direction} ref={selectorRef}>
        <MdLabelOutline onClick={handleOpen} />
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
        <LabelViewWrapper className="labels">{renderLabel()}</LabelViewWrapper>
      )}
    </Section>
  );
}

const Section = styled.div`
  display: flex;
  align-items: center;
  gap: 17px;
`;

const SelectorWrap = styled.div`
  position: relative;
  svg {
    font-size: 33px;
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
`;

const LabelView = styled.div`
  display: flex;
  border-radius: 15px;
  font-size: 13px;
  padding: 8px 20px;
  background: #78909c;
  color: white;
  cursor: default;
`;

export default LabelList;
