import './JoinTeamModal.css';

interface Props {
  team: { id: number; name: string };
  onConfirm: () => void;
  onCancel: () => void;
}

export const JoinTeamModal = ({ team, onConfirm, onCancel }: Props) => {
  return (
    <section className="join-modal">
      <h2 className="join-modal-title">Join Team</h2>
      <p className="join-modal-text">
        Do you want to join <strong>{team.name}</strong>?
      </p>
      <footer className="join-modal-actions">
        <button type="button" className="join-button" onClick={onConfirm}>
          Yes, Join
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </footer>
    </section>
  );
};
