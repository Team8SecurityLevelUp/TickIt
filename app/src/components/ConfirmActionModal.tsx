import './ConfirmActionModal.css';

interface ConfirmActionModalProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmActionModal = ({
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}: ConfirmActionModalProps) => {
  return (
    <section className="modal-content confirm-action-modal">
      <p>{message}</p>
      <nav className="confirm-actions">
        <button onClick={onCancel} className="cancel-button">
          {cancelText}
        </button>
        <button onClick={onConfirm} className="confirm-button">
          {confirmText}
        </button>
      </nav>
    </section>
  );
};
