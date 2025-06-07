import { useEffect, useState } from 'react';
import { fetcher } from '../utils/fetcher';
import './UpdateUserRoleModal.css';

type Role = 'todo_user' | 'team_lead' | 'access_admin';

interface Member {
  user_id: number;
  username: string;
  roles: string[];
}

interface JoinRequest {
  user_id: number;
  username: string;
}

interface Props {
  onClose: () => void;
  teamId: number;
}

export const UpdateUserRoleModal = ({ onClose, teamId }: Props) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);

  useEffect(() => {
    fetcher(`/teams/team-members?teamId=${teamId}`)
      .then((res) => {
        setMembers(res.data.members || []);
        setJoinRequests(res.data.joinRequests || []);
      })
      .catch((err) => {
        console.error('Failed to load team members:', err);
      });
  }, [teamId]);

  const handleJoinRequest = async (userId: number, action: 'accept' | 'reject') => {
    try {
      await fetcher('/teams/respond', {
        method: 'POST',
        body: {
          teamId,
          userId,
          action
        }
      });

      setJoinRequests((prev) => prev.filter((req) => req.user_id !== userId));

      if (action === 'accept') {
        const updated = await fetcher(`/teams/team-members?teamId=${teamId}`);
        setMembers(updated.data.members || []);
      }
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
    }
  };

  const getPrimaryRole = (roles: string[]): Role => {
    if (roles.includes('AccessAdmin')) return 'access_admin';
    if (roles.includes('TeamLead')) return 'team_lead';
    return 'todo_user';
  };

  return (
    <section className="modal-content update-role-modal">
      <h2 className="update-role-title">Manage Team Roles</h2>

      <section>
        <h3>Current Team Members</h3>
        <ul className="role-list">
          {members.map((user) => (
            <li key={user.user_id} className="role-item">
              <label>{user.username}</label>
              <select
                value={getPrimaryRole(user.roles)}
                onChange={() => {}}
                disabled
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
          {joinRequests.length === 0 ? (
            <li className="role-item">
              <label>No pending requests</label>
            </li>
          ) : (
            joinRequests.map((req) => (
              <li key={req.user_id} className="role-item">
                <label>{req.username}</label>
                <section className="join-actions">
                  <button onClick={() => handleJoinRequest(req.user_id, 'accept')}>Accept</button>
                  <button onClick={() => handleJoinRequest(req.user_id, 'reject')}>Reject</button>
                </section>
              </li>
            ))
          )}
        </ul>
      </section>

      <button className="close-modal-button" onClick={onClose}>Close</button>
    </section>
  );
};
