import React from 'react';
import styled from '@emotion/styled';

export function BlackButton(props) {
  return (
    <BlackBtn
      {...props}
      onClick={e => {
        blockedDBClick(e);
        props.onClick(e);
      }}
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

const Button = styled.button`
  font-size: 13px;
  border-radius: 5px;
  padding: 7.5px 13px;
  transition: 0.3s;
  cursor: pointer;
  border: 1px solid #bdbdbd;
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
`;

const WhiteBtn = styled(Button)`
  color: #212529;
  background: #fff;
  :hover,
  :active {
    color: #fff;
  }
`;

// const Button = styled.button`
//   font-size: 13px;
//   color: #ffffff;
//   background: #212529;
//   border-radius: 5px;
//   padding: 10px 15px;
//   border: none;
//   transition: 0.3s;
//   :hover {
//     background: #455a64;
//   }
//
//   :active {
//     background: #455a64;
//     outline: 2px solid #cfd8dc;
//   }
// `;
