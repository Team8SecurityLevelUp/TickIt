import { Modal } from './Modal'; 
import './ConfirmationModal.css'; 

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }: ConfirmationModalProps) => {
  const handleConfirmClick = () => {
    onConfirm();
    onClose(); 
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="confirmation-modal-content">
        <p>{message}</p>
        <div className="confirmation-modal-actions">
          <button onClick={handleConfirmClick} className="confirm-button">Yes</button>
          <button onClick={onClose} className="cancel-button">No</button>
        </div>
      </div>
    </Modal>
  );
};