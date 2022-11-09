import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import Icon from './Icon';
import LabelSelector from './LabelSelector';
import Label from './Label';

/**
 * @param {String[]} params.labelList
 * 생성된 라벨의 리스트
 * default 값은 []
 * @param {Function} params.createLabel
 * '생성' 버튼을 눌렀을 때 실행되는 이벤트
 * default 값은 null
 * null일 때, display 없음
 * @param {String} params.title
 * 라벨 리스트의 title 내용
 * default 값은 null
 * null일 때, display 없음
 * @param {String} params.labelListStyle
 * 라벨 리스트 style
 * default 값은 rgba(0, 0, 0, 0.3);
 * @returns {JSX.Component} LabelList Component
 */

function TmpLabelList({ labelList = [], createLabel = null, title = null, labelListStyle = null }) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [valueArr, setValueArr] = useState([]);

  /* handleOpen : open시에만 동작토록 (무조건 열기)
  const handleOpen = useCallback(() => {
    setIsSelectorOpen(!isSelectorOpen);
  }, [isSelectorOpen]);
  */

  const handleOpen = useCallback(() => {
    setIsSelectorOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsSelectorOpen(false);
  }, []);

  const renderLabel = useCallback(() => {
    return valueArr.map(el => {
      return <Label key={`label-${el}`}>{el}</Label>;
    });
  }, [valueArr]);

  return (
    <Wrapper>
      <BackGround
        onMouseDown={handleClose}
        style={isSelectorOpen ? { position: `absolute` } : { position: `relative` }}
      />
      <Section>
        {renderLabel()}
        <div>
          {/* <Icon onClick={handleOpen} /> */}
          <Icon onClick={handleOpen} />
          {isSelectorOpen && (
            <LabelSelector
              labelList={labelList}
              valueArr={valueArr}
              setValueArr={setValueArr}
              createLabel={createLabel}
              title={title}
              labelListStyle={labelListStyle}
              /* focusout event시 close됨 */
            />
          )}
        </div>
      </Section>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const BackGround = styled.div`
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  padding: 0;
`;

const Section = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 30px;
    height: 30px;
  }
`;

export default TmpLabelList;
