import { useState } from 'react';
import './UpdateUserRoleModal.css';

type Role = 'todo_user' | 'team_lead' | 'access_admin';

interface User {
  email: string;
  username: string;
  role: Role;
}

interface JoinRequest {
  email: string;
  username: string;
}

interface Props {
  onClose: () => void;
}

export const UpdateUserRoleModal = ({ onClose }: Props) => {
  const [members, setMembers] = useState<User[]>([
    { email: 'alice@example.com', username: 'alice', role: 'todo_user' },
    { email: 'bob@example.com', username: 'bob', role: 'team_lead' },
    { email: 'carla@example.com', username: 'carla', role: 'access_admin' },
  ]);

  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([
    { email: 'dave@example.com', username: 'dave' },
    { email: 'eva@example.com', username: 'eva' },
  ]);

  const handleRoleChange = (email: string, newRole: Role) => {
    setMembers((prev) =>
      prev.map((user) =>
        user.email === email ? { ...user, role: newRole } : user
      )
    );
  };

  const handleJoinRequest = (email: string, action: 'accept' | 'reject') => {
    setJoinRequests((prev) => prev.filter((req) => req.email !== email));

    if (action === 'accept') {
      const accepted = joinRequests.find((r) => r.email === email);
      if (accepted) {
        setMembers((prev) => [...prev, { ...accepted, role: 'todo_user' }]);
      }
    }
  };

  return (
    <section className="modal-content update-role-modal">
      <h2 className="update-role-title">Manage Team Roles</h2>

      <section>
        <h3>Current Team Members</h3>
        <ul className="role-list">
          {members.map((user) => (
            <li key={user.email} className="role-item">
              <label>{user.username}</label>
              <select
                value={user.role}
                onChange={(e) =>
                  handleRoleChange(user.email, e.target.value as Role)
                }
              >
                <option value="todo_user">To-do User</option>
                <option value="team_lead">Team Lead</option>
                <option value="access_admin">Access Admin</option>
              </select>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Join Requests</h3>
        <ul className="role-list">
          {joinRequests.map((req) => (
            <li key={req.email} className="role-item">
              <label>{req.username}</label>
              <section className="join-actions">
                <button onClick={() => handleJoinRequest(req.email, 'accept')}>Accept</button>
                <button onClick={() => handleJoinRequest(req.email, 'reject')}>Reject</button>
              </section>
            </li>
          ))}
        </ul>
      </section>

      <button className="close-modal-button" onClick={onClose}>Close</button>
    </section>
  );
};
