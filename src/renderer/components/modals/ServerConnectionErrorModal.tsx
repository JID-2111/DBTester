import Modal from '../utils/Modal';

interface IServerConnectionErrorModalProps {
  show: boolean;
  alertMsg: string;
  handleClose: () => void;
}
const ServerConnectionErrorModal = ({
  show,
  alertMsg,
  handleClose,
}: IServerConnectionErrorModalProps) => {
  return (
    <Modal
      show={show}
      handleClose={handleClose}
      title="Error"
      modalBody={alertMsg}
    />
  );
};

export default ServerConnectionErrorModal;
