import { useState } from 'react';
import { fetcher } from '../utils/fetcher';
import './UpdateUserRole.css';

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

const teamId = '1234';

export const UpdateUserRole = ({ onClose }: { onClose: () => void }) => {
  const [members, setMembers] = useState<User[]>([
    { email: 'alice@example.com', username: 'alice', role: 'todo_user' },
    { email: 'bob@example.com', username: 'bob', role: 'team_lead' },
    { email: 'carla@example.com', username: 'carla', role: 'access_admin' },
  ]);

  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([
    { email: 'dave@example.com', username: 'dave' },
    { email: 'eva@example.com', username: 'eva' },
  ]);

  const handleRoleChange = async (email: string, newRole: Role) => {
    try {
      await fetcher('/team/update-role', {
        method: 'POST',
        body: {
          teamId,
          email,
          role: newRole
        },
      });

      setMembers((prev) =>
        prev.map((user) =>
          user.email === email ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleJoinRequest = async (email: string, action: 'accept' | 'reject') => {
    try {
      await fetcher('/team/join-request', {
        method: 'POST',
        body: {
          teamId,
          email,
          action
        },
      });

      setJoinRequests((prev) => prev.filter((req) => req.email !== email));

      if (action === 'accept') {
        const acceptedUser = joinRequests.find((req) => req.email === email);
        if (acceptedUser) {
          setMembers((prev) => [
            ...prev,
            { ...acceptedUser, role: 'todo_user' as Role },
          ]);
        }
      }
    } catch (err) {
      console.error('Failed to process join request:', err);
    }
  };

  return (
    <>
      <h2>Manage Team Roles</h2>

      <section className="members">
        <h3>Current Team Members</h3>
        <ul>
          {members.map((user) => (
            <li key={user.email} className="member-item">
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

      <section className="join-requests">
        <h3>Join Requests</h3>
        <ul>
          {joinRequests.map((req) => (
            <li key={req.email} className="join-request">
              <label>{req.username}</label>
              <section>
                <button onClick={() => handleJoinRequest(req.email, 'accept')}>
                  Accept
                </button>
                <button onClick={() => handleJoinRequest(req.email, 'reject')}>
                  Reject
                </button>
              </section>
            </li>
          ))}
        </ul>
      </section>

      <button onClick={onClose}>Close</button>
    </>
  )
};
