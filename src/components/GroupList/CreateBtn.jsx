import React from 'react';
import styled from '@emotion/styled';
import { AiOutlineUserAdd } from 'react-icons/ai';

function CreateBtn({ clickCreate, unit }) {
  return (
    <Button onClick={clickCreate}>
      <AiOutlineUserAdd />
      <Text>{unit} 추가</Text>
    </Button>
  );
}

const Button = styled.button`
  border: none;
  outline: none;
  background: rgb(236, 239, 241);
  border-radius: 4px;
  width: calc(100% - 16px);
  display: flex;
  align-items: center;
  padding-left: 8px;
  padding-top: 6px;
  padding-bottom: 6px;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Text = styled.span`
  margin-left: 4px;
`;

export default CreateBtn;
