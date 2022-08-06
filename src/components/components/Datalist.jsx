import React from 'react';
import styled from '@emotion/styled';
import { MdKeyboardArrowDown } from 'react-icons/all';
import TextInput from './TextInput';

function Datalist({ id, setData }) {
  return (
    <>
      <label htmlFor={id}>{id} : </label>
      <input id={id} type="text" onChange={e => setData(id, e.target.value)} />
      <TextInput title="hi" value="b" />
      <MdKeyboardArrowDown />

      <DataListWrap>
        <DataListItem value="Chocolate">Chocolate</DataListItem>
        <DataListItem value="Cookie">Cookie</DataListItem>
        <DataListItem value="Mint">Mint</DataListItem>
        <DataListItem value="Vanilla">Vanilla</DataListItem>
        <DataListItem value="Cake">Cake</DataListItem>
      </DataListWrap>
    </>
  );
}

const DataListWrap = styled.ul`
  width: 100%;
  background-color: darkolivegreen;
`;

const DataListItem = styled.li`
  width: 100%;
`;

export default Datalist;
