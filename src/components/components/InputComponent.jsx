import React from 'react';
import styled from '@emotion/styled';

export function DataListInput(props) {
  return <DataListInputComp ref={props.inputref} {...props} />;
}

const DataListInputComp = styled.input`
  background-color: #fff;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3E%3C/svg%3E");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 16px 12px;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  color: #212529;
  font-size: 1rem;
  font-weight: 400;
  padding: 0.375rem 2.25rem 0.375rem 0.75rem;
  outline: none;
`;

export function TextInput(props) {
  return <TextInputComp {...props} />;
}

const TextInputComp = styled.input`
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  color: #212529;
  font-size: 1rem;
  font-weight: 400;
  padding: 0.375rem 2.25rem 0.375rem 0.75rem;
`;
