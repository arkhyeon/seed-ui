import React from 'react';
import styled from '@emotion/styled';

function Label({ children }) {
  return <Wrapper>{children}</Wrapper>;
}

const Wrapper = styled.div`
  background: rgb(120, 144, 156);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  border-radius: 8px;

  margin-right: 4px;
  margin-left: 4px;
`;

export default Label;
