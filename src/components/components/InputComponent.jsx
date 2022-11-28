import React from 'react';
import styled from '@emotion/styled';

export function TextInput(props) {
  const enterEvent = e => {
    if (e.key === 'Enter' && props.enterEvent) {
      props.enterEvent();
    }
  };
  return (
    <TextInputWrap>
      <TextInputComp
        ref={props.inputRef}
        {...props}
        onKeyDown={e => {
          enterEvent(e);
        }}
      />
    </TextInputWrap>
  );
}

const TextInputWrap = styled.div`
  width: 100%;
  display: flex;
`;

const TextInputComp = styled.input`
  width: 100%;
  border: 1px solid #bdbdbd;
  border-radius: 5px;
  color: #212529;
  font-size: 14px;
  padding: 8px 0px 6px 12px;
`;

export function DataListInput(props) {
  return <DataListInputComp ref={props.inputRef} {...props} />;
}

const DataListInputComp = styled(TextInputComp)`
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3E%3C/svg%3E");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 16px 12px;
  outline: none;
  padding: 8px 36px 6px 12px;
`;

export function LabelCheckBox(props) {
  return (
    <CheckBoxWrap>
      <label htmlFor={props.id}>
        <input id={props.id} type="checkbox" {...props} />
        {props.label}
      </label>
    </CheckBoxWrap>
  );
}

const CheckBoxWrap = styled.div`
  width: 100%;
  display: flex;

  & label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 14px;

    & input {
      width: 18px;
      height: 18px;
      -webkit-appearance: none;
      appearance: none;
      border-radius: 0.15em;
      border: 0.15em solid #545454;
      outline: none;
      cursor: pointer;

      &:checked {
        background-color: #545454;

        &::before {
          content: '\\2714';
          color: #fff;
          font-size: 14px;
          position: relative;
          left: 1px;
          top: -3px;
        }
      }
    }
  }
`;
