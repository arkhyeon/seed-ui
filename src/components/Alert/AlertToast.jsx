import React from 'react';
import styled from '@emotion/styled';
import { alertStore } from '../../R2wZustand';
import Toast from './Toast';

function AlertToast(props) {
  const { alertList } = alertStore();
  return (
    <>
      {alertList.length !== 0 && (
        <ToastContainer>
          {alertList.map(alert => {
            return (
              <Toast key={alert.id} aid={alert.id}>
                {alert.message}
              </Toast>
            );
          })}
        </ToastContainer>
      )}
    </>
  );
}

const ToastContainer = styled.div`
  width: 300px;
  position: fixed;
  left: calc(50% - 150px);
  z-index: 9999;
  background-color: darkslategrey;
`;

export default AlertToast;
