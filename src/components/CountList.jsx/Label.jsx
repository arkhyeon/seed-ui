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
  border-radius: 15px;

  margin-left: 10px;
  font-size: 13px;
  padding: 8px 20px;
  background: #78909c;
`;

export default Label;
