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
 * @returns {JSX.Component} LabelList Component
 */

function LabelList({
  labelList = ['그룹 1', '그룹 2'],
  createLabel = null,
  direction = 'left',
  canCreate = true,
  unit = '그룹',
}) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [valueArr, setValueArr] = useState([]);
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
    return valueArr.map((el, idx) => {
      return <Label key={`label-${el}`}>{el}</Label>;
    });
  }, [valueArr]);

  return (
    <Wrapper>
      <Section>
        {direction === 'left' ? (
          <LabelWrapper direction={direction}> {renderLabel()}</LabelWrapper>
        ) : (
          <></>
        )}
        <div>
          <Icon onClick={handleOpen} />
          {isSelectorOpen && (
            <LabelSelector
              labelList={labelList}
              valueArr={valueArr}
              setValueArr={setValueArr}
              createLabel={createLabel}
              ref={selectorRef}
              canCreate={canCreate}
              unit={unit}
            />
          )}
        </div>
        {direction === 'right' ? (
          <LabelWrapper direction={direction}> {renderLabel()}</LabelWrapper>
        ) : (
          <></>
        )}
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

  margin-left: ${({ direction }) => {
    if (direction === 'right') {
      return '10px';
    }
    return 0;
  }};
`;

export default LabelList;
