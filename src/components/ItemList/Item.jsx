import React, { useRef, useCallback, useEffect } from 'react';
import styled from '@emotion/styled';

function Item({ children, idx, handleSelect, selected, click, id }) {
  const itemRef = useRef(null);

  const handleClick = useCallback(() => {
    handleSelect(idx);
    click(id);
  }, [idx, handleSelect, id, click]);

  useEffect(() => {
    if (selected === idx) {
      itemRef.current.classList.add('selected');
    } else {
      itemRef.current.classList.remove('selected');
    }
  }, [selected, idx]);

  return (
    <Wrapper onClick={handleClick} ref={itemRef}>
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 160px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  cursor: pointer;
  padding-left: 30px;
  padding-top: 4px;
  padding-bottom: 4px;
  font-weight: normal;
  font-size: 14px;
  :hover {
    background: #eee;
  }
`;

export default Item;
