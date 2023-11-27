import React from 'react';
import { Modal } from './components';

function ModalTestTemplate({
  modalState,
  handleClose,
  width,
  height,
  modalTitle,
  buttonList,
  children,
}) {
  return (
    <Modal
      modalTitle={modalTitle}
      modalState={modalState}
      handleClose={handleClose}
      width={width}
      height={height}
      buttonList={buttonList}
    >
      {children}
    </Modal>
  );
}

export default ModalTestTemplate;
