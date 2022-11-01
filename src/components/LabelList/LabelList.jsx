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
 * @param {String} params.direction
 * 라벨이 나열될 방향
 * default 값은 'left'
 * @param {Boolean} params.canCreate
 * 라벨이 생성 가능한 지에 대한 여부
 * 해당 값이 false면 생성 버튼이 사라짐
 * default 값은 true
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
  labelList = ['그룹 1', '그룹 2'],
  createLabel = null,
  direction = 'left',
  canCreate = true,
  unit = '그룹',
  valueArr = [],
  setValueArr = null,
  handleUpdate = () => {},
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
    handleUpdate();
    setIsSelectorOpen(!isSelectorOpen);
  }, [isSelectorOpen, handleUpdate]);

  const renderLabel = useCallback(() => {
    return valueArr.map((el, idx) => {
      return <Label key={`label-${el}`}>{el}</Label>;
    });
  }, [valueArr]);

  return (
    <Wrapper>
      <Section>
        {direction === 'left' ? (
          <LabelWrapper direction={direction} className="labels">
            {renderLabel()}
          </LabelWrapper>
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
          <LabelWrapper direction={direction} className="labels">
            {renderLabel()}
          </LabelWrapper>
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
