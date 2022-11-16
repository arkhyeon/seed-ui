import React from 'react';
import styled from '@emotion/styled';

function Article({ list = [{ subject: '', text: '', content: <input /> }] }) {
  return (
    <>
      {list.map(el => {
        return (
          <ArticleWrapper key={`line-${el.subject}`}>
            <TitleWrapper>
              <H2Wrapper>{el.subject}</H2Wrapper>
              <PWrapper>{el.text}</PWrapper>
            </TitleWrapper>
            <ContentWrapper>
              <ItemWrapper>{el.content}</ItemWrapper>
            </ContentWrapper>
          </ArticleWrapper>
        );
      })}
    </>
  );
}

const ArticleWrapper = styled.article`
  display: flex;
  padding: 0.3em;
  background-color: #eee;
  border-radius: 0.5em;
  font-size: 1.2em;
  gap: 1em;
  margin-bottom: 0.5em;
`;

const TitleWrapper = styled.div`
  width: 30%;
  justify-content: left;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 70%;
  margin: 0.7rem;
  align-items: center;
  justify-content: right;
`;

const ItemWrapper = styled.div`
  display: flex;
  width: 10rem;
  min-width: 330px;
`;

const H2Wrapper = styled.h2`
  margin: 0.7rem;
  font-size: 0.8em;
`;

const PWrapper = styled.p`
  margin: 0.7rem;
  font-size: 0.8em;
`;

export default Article;
