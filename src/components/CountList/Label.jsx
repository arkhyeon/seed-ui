import React from 'react';
import styled from '@emotion/styled';

function Label({ children, color, textColor }) {
  return (
    <Wrapper className="label" color={color} textColor={textColor}>
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: ${({ color }) => color || 'var(--seed-chip-bg)'};
  color: ${({ textColor }) => textColor || 'var(--seed-chip-text)'};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;

  margin-left: 10px;
  font-size: 13px;
  padding: 8px 20px;
`;

export default Label;
