import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

/**
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
 * @param {String} location
 * 해당 컴포넌트가 여러개 들어갈 시 border 겹침으로 인한 Param
 * top : default 위 아래 border
 * bottom : 아래만 border
 * @param {String} contentPadding
 * 디자인에 따라 우측 padding 변화가 있으므로 padding-right의 값을 param으로 사용
 * default : 10%
 * @returns
 */

function InputGrid({
  list = [{ subject: '내용 없음', content: <input /> }],
  location = 'top',
  contentPadding = '10%',
}) {
  const renderLine = useCallback(() => {
    return (
      <>
        {list.map((el, idx) => {
          return (
            <LineWrapper key={`line-${idx}`}>
              <Subject className="input-grid-subject">{el.subject}</Subject>
              <Content contentPadding={contentPadding} className="input-grid-content">
                {el.content}
              </Content>
            </LineWrapper>
          );
        })}
      </>
    );
  }, [list, contentPadding]);

  return <Wrapper location={location}>{renderLine()}</Wrapper>;
}

const Wrapper = styled.div`
  ${({ location }) => {
    if (location === 'top') {
      return css`
        border-top: 1px solid #bdbdbd;
        border-bottom: 1px solid #bdbdbd;
      `;
    }
    if (location === 'bottom') {
      return css`
        border-bottom: 1px solid #bdbdbd;
      `;
    }
    return '';
  }}
`;

const LineWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid #bdbdbd;
  &:last-of-type {
    border-bottom: none;
  }
`;

const Subject = styled.div`
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #545454;
  padding: 17.5px 0;
`;

const Content = styled.div`
  width: 70%;
  padding: 8.5px ${({ contentPadding }) => contentPadding} 8.5px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export default InputGrid;
