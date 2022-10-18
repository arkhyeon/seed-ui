import React, { useState, useCallback } from 'react';
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

function UniqueLabelList({ labelList = ['그룹 1', '그룹 2'], createLabel = null }) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [valueStr, setValueStr] = useState('');

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
        {renderLabel()}
        <div>
          <Icon onClick={handleOpen} />
          {isSelectorOpen && (
            <LabelSelector
              labelList={labelList}
              valueStr={valueStr}
              setValueStr={setValueStr}
              createLabel={createLabel}
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

export default UniqueLabelList;