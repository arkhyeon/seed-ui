import React, { useCallback } from 'react';
import styled from '@emotion/styled';

/**
 * @param {String} param.border
 * 전체 그리드의 테두리 선 설정
 * default 값은 '2px solid #d2d2d2'
 * @param {String} param.lineHeight
 * 한 라인의 높이
 * default 값은 '2rem'
 * @param {String} param.subjectBorder
 * 한 라인 내에서 제목과 내용 사이의 테두리 선 설정
 * default 값은 '1px solid '#d2d2d2'
 * @param {String} param.subjectBg
 * 제목 칸의 배경 색
 * default 값은 '#eee'
 * @param {String} param.subjectadding
 * 제목 칸의 여백 값
 * default 값은 '12px'
 * @param {String} param.subjectWidth
 * 제목 칸의 너비
 * default 값은 '200px'
 * @param {String} param.subjectJustify
 * 제목 칸의 가로 정렬 속성
 * default 값은 'center'
 * @param {String} param.contentPadding
 * 내용 칸의 여백 값
 * default 값은 '12px'
 * @param {Array} param.list
 * 그리드 안에 들어갈 내용
 * 한 줄에 하나의 내용만 들어갈 경우,
 * Object 형태로 작성
 * { subject: {String} 넣고자 하는 제목, content: {Component} 내용 안에 들어갈 컴포넌트 }
 * 한 줄에 여러 내용이 들어갈 경우,
 * Array 형태로 작성
 * [
 *  {
 *    subject: {String} 넣고자 하는 제목, content: {Component} 내용 안에 들어갈 컴포넌트, flex: {Number} 1(생략 가능, default 값은 1)
 *  },
 *  {
 *    subject: {String} 넣고자 하는 제목, content: {Component} 내용 안에 들어갈 컴포넌트, flex: {Number} 1(생략 가능, default 값은 1)
 *  },
 * ]
 * @returns
 */

function InputGrid({
  border = '1px solid #d2d2d2',
  lineHeight = '2rem',
  subjectBorder = '1px solid #d2d2d2',
  subjectBg = '#eee',
  subjectPadding = '12px',
  subjectWidth = '200px',
  subjectJustify = 'center',
  contentPadding = '12px',
  list = [{ subject: '내용 없음', content: <input /> }],
  fullSize = true,
}) {
  const renderLine = useCallback(() => {
    return (
      <>
        {list.map((el, idx) => {
          if (Array.isArray(el)) {
            return (
              <FlexWrapper>
                {el.map((subEl, subIdx) => (
                  <LineWrapper
                    key={`subEl-${subIdx}`}
                    lineHeight={lineHeight}
                    border={border}
                    flex={subEl.flex}
                  >
                    <Subject
                      subjectBg={subjectBg}
                      border={border}
                      subjectPadding={subjectPadding}
                      subjectBorder={subjectBorder}
                      subjectWidth={subjectWidth}
                      subjectJustify={subjectJustify}
                    >
                      {subEl.subject}
                    </Subject>
                    <Content contentPadding={contentPadding}>{subEl.content}</Content>
                  </LineWrapper>
                ))}
              </FlexWrapper>
            );
          }
          if (typeof el === 'object') {
            return (
              <LineWrapper key={`line-${idx}`} lineHeight={lineHeight} border={border}>
                <Subject
                  subjectBg={subjectBg}
                  border={border}
                  subjectPadding={subjectPadding}
                  subjectBorder={subjectBorder}
                  subjectWidth={subjectWidth}
                  subjectJustify={subjectJustify}
                >
                  {el.subject}
                </Subject>
                <Content contentPadding={contentPadding}>{el.content}</Content>
              </LineWrapper>
            );
          }
          return null;
        })}
      </>
    );
  }, [
    list,
    border,
    contentPadding,
    lineHeight,
    subjectBg,
    subjectJustify,
    subjectPadding,
    subjectWidth,
    subjectBorder,
  ]);

  return (
    <Container>
      <Wrapper border={border} fullSize={fullSize}>
        {renderLine()}
      </Wrapper>
    </Container>
  );
}

const Container = styled.div``;

const Wrapper = styled.div`
  border: ${({ border }) => border};
  border-bottom: none;
  display: ${({ fullSize }) => {
    if (fullSize) {
      return 'block';
    }
    return 'inline-block';
  }};
`;

const LineWrapper = styled.div`
  display: flex;
  height: ${({ lineHeight }) => lineHeight};
  border-bottom: ${({ border }) => border};
  flex: ${({ flex }) => {
    if (flex) {
      return flex;
    }
    return 1;
  }};
`;

const Subject = styled.div`
  background: ${({ subjectBg }) => subjectBg};
  display: flex;
  align-items: center;
  padding: ${({ subjectPadding }) => subjectPadding};
  border-right: ${({ subjectBorder }) => subjectBorder};
  width: ${({ subjectWidth }) => subjectWidth};
  justify-content: ${({ subjectJustify }) => subjectJustify};
`;

const Content = styled.div`
  display: table-cell;
  display: flex;
  align-items: center;
  padding: ${({ contentPadding }) => contentPadding};
`;

const FlexWrapper = styled.div`
  display: flex;
`;

export default InputGrid;
