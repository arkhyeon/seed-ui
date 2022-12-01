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

const blockedDBClick = e => {
  e.target.setAttribute('disabled', true);

  setTimeout(() => {
    e.target.removeAttribute('disabled');
  }, 500);
};

export function SwitchButton(props) {
  return (
    <SwitchWrap>
      <input type="checkbox" id="switch" {...props} />
      <label htmlFor="switch" className="switch_label">
        <span className="onf_btn" />
      </label>
      <label htmlFor="switch" className="switch_text">
        {props.label}
      </label>
    </SwitchWrap>
  );
}

const Button = styled.button`
  font-size: 13px;
  border-radius: 5px;
  padding: 7.5px 13px;
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

const SwitchWrap = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;

  .switch_text {
    cursor: pointer;
    font-size: 14px;
  }

  #switch {
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
    border: 2px solid #545454;
    border-radius: 20px;
    transition: 0.2s;
  }
  .switch_label:hover {
    background: #efefef;
  }
  .onf_btn {
    position: relative;
    left: 4px;
    width: 12px;
    height: 12px;
    border-radius: 12px;
    background: #545454;
    transition: 0.2s;
  }

  /* checking style */
  #switch:checked + .switch_label {
    background: #545454;
  }

  /* move */
  #switch:checked + .switch_label .onf_btn {
    left: 22px;
    background: #fff;
  }
`;
