import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { AiOutlineUserAdd } from 'react-icons/ai';

function CreateBtn({ clickCreate, unit, setSelected }) {
  const handleClick = useCallback(() => {
    setSelected(-1);
    clickCreate();
  }, [clickCreate, setSelected]);

  return (
    <Button onClick={handleClick}>
      <AiOutlineUserAdd />
      <Text>{unit} 추가</Text>
    </Button>
  );
}

const Button = styled.button`
  border: none;
  outline: none;
  background: #eceff1;
  border-radius: 4px;
  width: 233px;
  height: 38px;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-left: 10px;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Text = styled.span`
  margin-left: 4px;
`;

export default CreateBtn;
