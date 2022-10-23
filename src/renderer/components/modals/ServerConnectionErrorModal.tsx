import Modal from '../utils/Modal';

interface IServerConnectionErrorModalProps {
  show: boolean;
  handleClose: () => void;
}
const ServerConnectionErrorModal = ({
  show,
  handleClose,
}: IServerConnectionErrorModalProps) => {
  return (
    <Modal
      show={show}
      handleClose={handleClose}
      title="Error"
      modalBody="Could not connect to the server. Please check your configuration
            details."
    />
  );
};

export default ServerConnectionErrorModal;
