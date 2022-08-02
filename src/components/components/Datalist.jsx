import React from 'react';
import styled from '@emotion/styled';
import { MdKeyboardArrowDown } from 'react-icons/all';

function Datalist() {
  return (
    <>
      <label htmlFor="icecream">라벨 이름 :</label>
      <input id="icecream" type="text" list="ice-cream-flavors" name="ice-cream-choice" />
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
