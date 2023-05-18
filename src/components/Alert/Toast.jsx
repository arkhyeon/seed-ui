import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { alertStore } from '../../R2wZustand';

function Toast({ children, aid }) {
  const toastRef = useRef();
  const progressRef = useRef();
  const { deleteAlert } = alertStore();

  useEffect(() => {
    toastRef.current.style.top = '50px';
    progressRef.current.style.width = '0%';
    const timer = setTimeout(() => {
      deleteAlert(aid);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastWrap ref={toastRef}>
      {children}
      <ProgressWrap>
        <ProgressBar ref={progressRef} />
      </ProgressWrap>
    </ToastWrap>
  );
}

export const toast = content => {
  const { setAlertList } = alertStore();
  setAlertList(content);
};

const ToastWrap = styled.div`
  width: 100%;
  position: relative;
  top: 0;
  transition: 0.3s;
  background-color: darkgreen;
`;

const ProgressWrap = styled.div`
  width: 100%;
  height: 6px;
  background-color: white;
  border: 1px solid black;
  box-sizing: border-box;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 100%;
  background-color: indianred;
  transition: 2.9s linear;
`;

export default Toast;
