import React from 'react';
import styled from '@emotion/styled';
import { useStore } from '../../R2wZustand';

export function BlackButton(props) {
  const { showComp } = useStore();
  return (
    <BlackBtn
      {...props}
      onClick={e => {
        blockedDBClick(e);
        props.onClick(e);
        useStore.setState({ showComp: true });
      }}
      className={showComp ? 'showComp' : ''}
    />
  );
}

export function WhiteButton(props) {
  return (
    <WhiteBtn
      {...props}
      onClick={e => {
        blockedDBClick(e);
        props.onClick(e);
      }}
    />
  );
}

export function RadioButton({ valueList = [], labelList = [], setValue, defaultValue }) {
  const dataList = valueList.map((value, i) => {
    return { value, label: labelList[i] || value };
  });

  return (
    <RadioButtonWrap>
      {dataList.map(({ value, label }) => {
        return (
          <SelectButton
            className={defaultValue === value && 'selected-radio'}
            value={value}
            onClick={() => setValue(value)}
            key={value}
          >
            {label}
          </SelectButton>
        );
      })}
    </RadioButtonWrap>
  );
}

const blockedDBClick = e => {
  e.target.setAttribute('disabled', true);

  setTimeout(() => {
    e.target.removeAttribute('disabled');
  }, 500);
};

export function SwitchButton(props) {
  return (
    <SwitchWrap>
      <input type="checkbox" id={props.id || 'switch'} {...props} />
      <label htmlFor={props.id || 'switch'} className="switch_label">
        <span className="onf_btn" />
      </label>
      <label htmlFor={props.id || 'switch'} className="switch_text">
        {props.label}
      </label>
    </SwitchWrap>
  );
}

const Button = styled.button`
  font-size: 13px;
  border-radius: 5px;
  padding: 7px 13px 8px;
  transition: 0.3s;
  cursor: pointer;
  border: 1px solid #d2d2d2;
  :hover {
    background-color: #455a64;
  }

  :active {
    outline: 3px solid #b0bec5;
  }
`;

const BlackBtn = styled(Button)`
  color: #ffffff;
  background: #3e3e3e;

  &.showComp {
    background-color: #6674fe !important;
  }
`;

const WhiteBtn = styled(Button)`
  color: #212529;
  background: #fff;
  :hover,
  :active {
    color: #fff;
  }
`;

const SelectButton = styled(Button)`
  min-width: 85px;
  background-color: white;
  &.selected-radio {
    background-color: black;
    color: white;
  }
  :first-of-type {
    border-radius: 5px 0 0 5px;
  }

  :not(:first-of-type, :last-of-type) {
    border-left: none;
    border-right: none;
    border-radius: 0;
  }

  :last-of-type {
    border-radius: 0 5px 5px 0;
  }

  :hover {
    background-color: #455a64;
    color: white;
  }
`;

const RadioButtonWrap = styled.div`
  display: flex;
  align-items: center;
`;

const SwitchWrap = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;

  .switch_text {
    cursor: pointer;
    font-size: 14px;
  }

  & input {
    position: absolute;
    /* hidden */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  .switch_label {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 38px;
    height: 16px;
    background: #fff;
    border: 1px solid #d2d2d2;
    border-radius: 20px;
    transition: 0.2s;
    :hover {
      background: #efefef;
    }
  }
  .onf_btn {
    position: relative;
    left: 4px;
    width: 12px;
    height: 12px;
    border-radius: 12px;
    transition: 0.2s;
    inset-inline-start: 2px;
    &::before {
      content: '';
      position: absolute;
      background-color: #3e3e3e;
      top: 0;
      bottom: 0;
      transition: 0.2s;
      border-radius: 6px;
      inset-inline-start: 0;
      inset-inline-end: 0;
    }
  }

  /* checking style */
  & input:checked + .switch_label {
    background: #3e3e3e;
  }

  /* move */
  & input:checked + .switch_label .onf_btn {
    left: 22px;

    ::before {
      background-color: white;
    }
  }

  & input:checked + .switch_label:active .onf_btn {
    ::before {
      inset-inline-end: 0;
      inset-inline-start: -30%;
    }
  }
  & input + .switch_label:active .onf_btn::before {
    inset-inline-end: -30%;
    inset-inline-start: 0;
  }
`;
