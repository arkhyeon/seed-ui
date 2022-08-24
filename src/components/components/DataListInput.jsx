import React from 'react';
import styled from '@emotion/styled';

function DataListInput(props) {
  return (
    <>
      <DataListLabel htmlFor={props.id}>
        {props.id} :
        <DataListInputComp ref={props.inputref} {...props} />
      </DataListLabel>
    </>
  );
}

const DataListLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DataListInputComp = styled.input`
  //appearance: none;
  //background-color: #fff;
  //background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3E%3C/svg%3E");
  //background-position: right 0.75rem center;
  //background-repeat: no-repeat;
  //background-size: 16px 12px;
  //border: 1px solid #ced4da;
  //border-radius: 0.25rem;
  //color: #212529;
  //font-size: 1rem;
  //font-weight: 400;
  //line-height: 1.5;
  //padding: 0.375rem 2.25rem 0.375rem 0.75rem;
  //transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  //width: 85%;
`;

export default DataListInput;
