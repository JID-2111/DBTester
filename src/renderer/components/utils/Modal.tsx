/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/require-default-props */

import { Modal as BModal, Button } from 'react-bootstrap';

interface IModalProps {
  show: boolean;
  handleClose: () => void;
  title: string;
  modalBody: any;
  submit?: () => void;
  fullscreen?: boolean;
}

const Modal = ({
  show,
  handleClose,
  title,
  modalBody,
  submit,
  fullscreen,
}: IModalProps) => {
  return (
    <BModal
      show={show}
      onHide={handleClose}
      fullscreen={fullscreen || undefined}
    >
      <BModal.Header closeButton>
        <BModal.Title>{title}</BModal.Title>
      </BModal.Header>
      <BModal.Body>{modalBody}</BModal.Body>
      <BModal.Footer>
        {submit && (
          <Button variant="primary" onClick={submit}>
            Submit
          </Button>
        )}
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </BModal.Footer>
    </BModal>
  );
};

export default Modal;
