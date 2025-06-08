import React, { useState } from 'react';
import './FilterTeamsModal.css';

interface FilterValues {
  teamName: string;
  creatorName: string;
  role: '' | 'Creator' | 'Collaborator' | 'Joinable' | 'Requested';
}

interface Props {
  onApply: (filters: FilterValues) => void;
}

export const FilterTeamsModal = ({ onApply }: Props) => {
  const [teamName, setTeamName] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [role, setRole] = useState<FilterValues['role']>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({ teamName, creatorName, role });
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>Filter Teams</legend>

        <label>
          Team Name:
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </label>

        <label>
          Creator Name:
          <input
            type="text"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
          />
        </label>

        <label>
          Role:
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as FilterValues['role'])}
          >
            <option value="">Any</option>
            <option value="Creator">Creator</option>
            <option value="Access Admin">Access Admin</option>
            <option value="ToDoUser">Collaborator</option>
          </select>
        </label>

        <button type="submit">Apply Filters</button>
      </fieldset>
    </form>
  );
};
