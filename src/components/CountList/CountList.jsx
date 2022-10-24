import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import Icon from './Icon';
import LabelSelector from './LabelSelector';
import Label from './Label';

/**
 * @param {String[]} params.labelList
 * 현재 라벨의 리스트
 * useState로 생성된 상태 값
 * default 값은 ['000.000.000.000', '000.000.000.001']
 * @param {Function} params.setLabelList
 * 라벨의 리스트를 변화시키는 상태 변화 함수
 * default 값은 null
 * @param {Function} params.createLabel
 * 라벨 생성 버튼을 클릭 했을 때에 실행되는 함수
 * default 값은 null
 * @param {Function} params.modifyLabel
 * 첫번째 인자로 해당 라벨의 값을 가짐
 * 라벨 수정 버튼을 클릭 했을 때에 실행되는 함수
 * default 값은 null
 * @returns {JSX.Component} CountList Component
 */

function CountList({
  labelList = ['000.000.000.000', '000.000.000.001'],
  setLabelList = null,
  createLabel = null,
  modifyLabel = null,
}) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const selectorRef = useRef(null);

  const handleOut = useCallback(
    e => {
      if (isSelectorOpen && !selectorRef.current.contains(e.target)) {
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
    setIsSelectorOpen(!isSelectorOpen);
  }, [isSelectorOpen]);

  const renderLabel = useCallback(() => {
    if (labelList.length === 0) {
      return null;
    }
    return <Label>{labelList[0]}</Label>;
  }, [labelList]);

  return (
    <Wrapper>
      <Section>
        <div>
          <Icon onClick={handleOpen} />
          {isSelectorOpen && (
            <LabelSelector
              labelList={labelList}
              createLabel={createLabel}
              ref={selectorRef}
              modifyLabel={modifyLabel}
              setLabelList={setLabelList}
            />
          )}
        </div>
        <LabelWrapper>
          <Count>{labelList.length}개</Count> {renderLabel()}
        </LabelWrapper>
      </Section>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const Section = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 30px;
    height: 30px;
  }
`;

const LabelWrapper = styled.div`
  display: flex;
  & > div:last-of-type {
    margin-right: 17px;
  }
  align-items: center;
`;

const Count = styled.div`
  margin-left: 10px;
`;

export default CountList;
