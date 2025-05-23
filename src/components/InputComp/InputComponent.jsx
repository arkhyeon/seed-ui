import React, { forwardRef, useState } from 'react';
import styled from '@emotion/styled';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const TextInput = forwardRef((props, ref) => {
  const enterEvent = e => {
    if (e.key === 'Enter' && props.enterEvent) {
      props.enterEvent();
    }
  };
  return (
    <TextInputWrap>
      <TextInputComp
        ref={ref}
        {...props}
        maxLength={props?.maxLength || 100}
        onKeyDown={e => {
          enterEvent(e);
        }}
      />
    </TextInputWrap>
  );
});

export const PasswordInput = forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  return (
    <TextInputWrap>
      <TextInputComp
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        {...props}
        maxLength={props?.maxLength || 100}
      />
      <EyeToggle onClick={toggleShowPassword} type="button">
        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
      </EyeToggle>
    </TextInputWrap>
  );
});

const TextInputWrap = styled.div`
  width: 100%;
  display: flex;
  position: relative;
`;

const TextInputComp = styled.input`
  width: 100%;
  border: 1px solid #d2d2d2;
  border-radius: 5px;
  color: #212529;
  font-size: 13px;
  padding: 8px 0 7px 12px;

  &::placeholder {
    font-size: 13px;
  }
`;

const EyeToggle = styled.button`
  position: absolute;
  right: 10px;
  top: calc(50% - 8px);
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
`;

export const DataListInput = forwardRef((props, ref) => {
  return <DataListInputComp ref={ref} {...props} />;
});

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
      border: 1px solid #545454;
      outline: none;
      cursor: pointer;

      &:disabled {
        border: 1px solid #d1d1d1;
        background-color: #f9f9f9;
      }

      &:checked {
        background-color: #545454;

        &::before {
          content: '\\2714';
          color: #fff;
          font-size: 14px;
          position: relative;
          left: 2px;
          top: -2px;
        }
      }
    }
  }
`;
