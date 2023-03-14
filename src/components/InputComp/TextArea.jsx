import React from 'react';
import styled from '@emotion/styled';

function TextArea(props) {
  return <TextAreAComp {...props} />;
}

const TextAreAComp = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #d2d2d2;
  resize: vertical;
  box-sizing: border-box;
`;

export default TextArea;
