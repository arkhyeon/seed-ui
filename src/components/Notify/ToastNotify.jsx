import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { cancelConfirm, deleteAlert, deleteConfirm, useNotifyStore } from '../../R2wZustand';
import { BlackButton, WhiteButton } from '../Button/Button';
import EscStack from '../../common/EscStack';

/**
 * CLM 알림 렌더러. 앱 최상단에 한 번만 렌더한다.
 * 토스트: CLM.alert / alertInfo / alertSuccess
 * 컨펌:   CLM.alertError / CLM.confirm(Promise 반환)
 */
function ToastNotify({ interval = 3000 }) {
  const { toastList, confirm } = useNotifyStore();

  return (
    <div id="toast-wrap">
      <ToastWrap>
        {toastList.map(({ id, content, type }) => (
          <ToastAlert key={id} id={id} content={content} interval={interval} type={type} />
        ))}
      </ToastWrap>
      {confirm && (
        <DimOverlay onClick={cancelConfirm}>
          <ToastConfirm {...confirm} />
        </DimOverlay>
      )}
    </div>
  );
}

export default ToastNotify;

function ToastAlert({ id, content, interval, type }) {
  useLayoutEffect(() => {
    const timer = setTimeout(() => deleteAlert(id), interval);
    const handler = () => deleteAlert(id);
    EscStack.push(handler);

    return () => {
      clearTimeout(timer);
      EscStack.remove(handler);
    };
  }, [id, interval]);

  return (
    <ToastAlertItem type={type} onClick={() => deleteAlert(id)}>
      {content}
    </ToastAlertItem>
  );
}

function ToastConfirm({ title, message = '', buttons = ['취소', '확인'], type = '' }) {
  const { responseHandler } = useNotifyStore();
  const focusRef = useRef();

  const handleConfirmClick = useCallback(() => {
    if (responseHandler) responseHandler(true);
    deleteConfirm();
  }, [responseHandler]);

  const handleCancelClick = useCallback(() => {
    if (responseHandler) responseHandler(false);
    deleteConfirm();
  }, [responseHandler]);

  useEffect(() => {
    focusRef.current?.focus();
    const handler = () => handleCancelClick();
    EscStack.push(handler);
    return () => EscStack.remove(handler);
  }, [handleCancelClick]);

  return (
    <ToastConfirmItem type={type} onClick={handleCancelClick} tabIndex={0}>
      {title && <ToastConfirmHeader>{title}</ToastConfirmHeader>}
      <ToastConfirmBody>{message}</ToastConfirmBody>
      <ToastConfirmFooter>
        {buttons[0] && (
          <WhiteButton onClick={handleCancelClick} tabIndex={0}>
            {buttons[0]}
          </WhiteButton>
        )}
        {buttons[1] && (
          <BlackButton onClick={handleConfirmClick} tabIndex={0} ref={focusRef}>
            {buttons[1]}
          </BlackButton>
        )}
        {buttons[2] && (
          <BlackButton onClick={handleConfirmClick} tabIndex={0}>
            {buttons[1]}
          </BlackButton>
        )}
      </ToastConfirmFooter>
    </ToastConfirmItem>
  );
}

const ToastWrap = styled.div`
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const DimOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: baseline;
  padding-top: 60px;
`;

const ToastDefault = styled.div`
  width: 400px;
  min-height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 20px;
  gap: 12px;
  background-color: var(--seed-surface);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: var(--x-000);
  font-size: 14px;
  border-radius: 6px;
  opacity: 1;
  transition: 0.3s all ease-in-out;
  pointer-events: all;
  position: relative;
  line-height: 1.3;
  user-select: none;

  animation: dash 0.3s linear both;
  @keyframes dash {
    0% {
      opacity: 0;
      bottom: -50px;
    }
    100% {
      opacity: 1;
      bottom: 0;
    }
  }
`;

const ToastAlertItem = styled(ToastDefault)`
  ${({ type }) => {
    let borderColor = '';
    switch (type) {
      case 'success':
        borderColor = '#03a7f1';
        break;
      case 'error':
        borderColor = 'var(--seed-primary)';
        break;
      default:
        borderColor = 'var(--x-e9e9e9)';
        break;
    }
    return css`
      border-left: 5px solid ${borderColor};
    `;
  }}
  box-sizing: border-box;
  overflow-y: auto;
  white-space: pre-wrap;
  overflow-x: hidden;
  word-wrap: break-word;
`;

const ToastConfirmItem = styled(ToastDefault)`
  flex-direction: column;
  & > div {
    width: 100%;
  }
  ${({ type }) => {
    if (type === 'error') {
      return css`
        border-left: 5px solid var(--seed-primary);
      `;
    }
    return '';
  }}
`;

const ToastConfirmHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const ToastConfirmBody = styled.div`
  padding: 6px 0 0;
  max-height: 200px;
  box-sizing: border-box;
  overflow-y: auto;
  white-space: pre-wrap;
  overflow-x: hidden;
  word-wrap: break-word;
`;

const ToastConfirmFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
`;
