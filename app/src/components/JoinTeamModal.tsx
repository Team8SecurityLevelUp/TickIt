import './JoinTeamModal.css';

interface Props {
  team: { team_id: number; team_name: string };
  onConfirm: (roleType: 'TeamLead' | 'ToDoUser') => void;
  onCancel: () => void;
}

export const JoinTeamModal = ({ team, onConfirm, onCancel }: Props) => {
  return (
    <section className="join-modal">
      <h2 className="join-modal-title">Join Team</h2>
      <p className="join-modal-text">
        Do you want to join <strong>{team.team_name}</strong>?
      </p>
      <footer className="join-modal-actions">
        <button type="button" className="join-button" onClick={() => onConfirm('ToDoUser')}>
          Yes, Join
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </footer>
    </section>
  );
};
