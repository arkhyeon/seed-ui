import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import Icon from './Icon';
import LabelSelector from './LabelSelector';
import Label from './Label';

/**
 * @param {String[]} params.labelList
 * 생성된 라벨의 리스트
 * default 값은 ['그룹 1', '그룹 2']
 * @param {Function} params.createLabel
 * '그룹 만들기' 버튼을 눌렀을 때 실행되는 이벤트
 * default 값은 null
 * @returns {JSX.Component} UniqueLabelList Component
 */

function UniqueLabelList({
  labelList = ['그룹 1', '그룹 2'],
  createLabel = null,
  unit = '그룹',
  valueStr,
  setValueStr,
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
    if (valueStr === '') {
      return <Label>미지정</Label>;
    }
    return <Label>{valueStr}</Label>;
  }, [valueStr]);

  return (
    <Wrapper>
      <Section>
        <LabelWrapper>{renderLabel()}</LabelWrapper>
        <div>
          <Icon onClick={handleOpen} />
          {isSelectorOpen && (
            <LabelSelector
              labelList={labelList}
              valueStr={valueStr}
              setValueStr={setValueStr}
              createLabel={createLabel}
              ref={selectorRef}
              unit={unit}
            />
          )}
        </div>
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
`;

export default UniqueLabelList;
