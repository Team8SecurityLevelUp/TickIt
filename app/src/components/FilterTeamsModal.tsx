import React, { useState } from 'react';
import './FilterTeamsModal.css';

interface FilterValues {
  teamName: string;
  creatorName: string;
  role: '' | 'Creator' | 'Collaborator' | 'Joinable' | 'Requested';
}

interface Props {
  onApply: (filters: FilterValues) => void;
  onClose: () => void;
}

export const FilterTeamsModal = ({ onApply, onClose }: Props) => {
  const [teamName, setTeamName] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [role, setRole] = useState<FilterValues['role']>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({ teamName, creatorName, role });
  };

  return (
     <form className="filter-teams-form" onSubmit={handleSubmit}>

      <h2 className="filter-teams-title">Filter Teams</h2>

      <label htmlFor="filter-team-name">Team Name</label>
      <input
        id="filter-team-name"
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Enter team name"
      />

      <label htmlFor="filter-creator-name">Creator Name</label>
      <input
        id="filter-creator-name"
        type="text"
        value={creatorName}
        onChange={(e) => setCreatorName(e.target.value)}
        placeholder="Enter creator name"
      />

      <label htmlFor="filter-role">Role</label>
      <select
        id="filter-role"
        value={role}
        onChange={(e) => setRole(e.target.value as FilterValues['role'])}
      >
        <option value="">Any</option>
        <option value="Creator">Creator</option>
        <option value="Access Admin">Access Admin</option>
        <option value="ToDoUser">To Do User</option>
        <option value="TeamLead">Team Lead</option>
      </select>
      <button className='submit-button' type="submit">Apply Filters</button>
      <button className="close-button" type="button" onClick={onClose}>Close</button>
    </form>
  );
};
