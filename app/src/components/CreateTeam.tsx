import { useState } from 'react';
import './CreateTeam.css';

interface Props {
  onCreate: (teamName: string) => void;
  onClose: () => void;
}

export const CreateTeam = ({ onCreate, onClose  }: Props) => {
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!teamName.trim()) {
      setError('Team name is required.');
      return;
    }

    onCreate(teamName);
  };

  return (
    <form className="team-create-form" onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
      
      <h2 className="team-create-title">Create a New Team</h2>

      <label htmlFor="team-name">Team Name</label>
      <input
        value={teamName}
        onChange={(e) => {
          setTeamName(e.target.value);
          setError('');
        }}
        placeholder='Enter team name'
      />

      {error && <p className="team-create-error">{error}</p>}

      <button className='submit-button' type="submit">Create Team</button>
      <button className="close-button" type="button" onClick={onClose}>Close</button>
    </form>
  );
};
