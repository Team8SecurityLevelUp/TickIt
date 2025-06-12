import { useEffect, useState } from 'react';
import { fetcher } from '../utils/fetcher';
import './UpdateUserRoleModal.css';

type Role = 'ToDoUser' | 'TeamLead' | 'AccessAdmin' | 'Creator';

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
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [creatorUserId, setCreatorUserId] = useState<number | null>(null);

  useEffect(() => {
    fetcher(`/teams/team-members?teamId=${teamId}`)
      .then((res) => {
        setMembers(res.data.members || []);
        setJoinRequests(res.data.joinRequests || []);
        setCurrentUserId(res.data.currentUserId);
        const creator = res.data.members.find((m: Member) =>
          m.roles.includes('Creator')
        );
        setCreatorUserId(creator?.user_id ?? null);
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
    if (roles.includes('Creator')) return 'Creator';
    if (roles.includes('AccessAdmin')) return 'AccessAdmin';
    if (roles.includes('TeamLead')) return 'TeamLead';
    return 'ToDoUser';
  };

  return (
    <section className="modal-content update-role-modal">
      <h2 className="update-role-title">Manage Team Roles</h2>

      <section>
        <h3>Current Team Members</h3>
        <ul className="role-list">
          {members
          .map((user) => (
            <li key={user.user_id} className="role-item">
              <label>{user.username}</label>
            {user.user_id === currentUserId || user.user_id === creatorUserId ? (
              <span className="readonly-role">{getPrimaryRole(user.roles)}</span>
            ) : (
              <select
                value={getPrimaryRole(user.roles)}
                onChange={async (e) => {
                  const newRoleName = e.target.value;

                  try {
                    await fetcher('/teams/update-role', {
                      method: 'PUT',
                      body: {
                        teamId,
                        targetUserId: user.user_id,
                        newRoleName,
                      },
                    });

                    const updated = await fetcher(`/teams/team-members?teamId=${teamId}`);
                    setMembers(updated.data.members || []);
                  } catch (err) {
                    console.error('Failed to update role:', err);
                    alert('Failed to update role. You might not have access.');
                  }
                }}
              >
                <option value="ToDoUser">To-do User</option>
                <option value="AccessAdmin">Access Admin</option>
                <option value="TeamLead">Team Lead</option>
              </select>
            )}
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
                  <button className='join-btn' onClick={() => handleJoinRequest(req.user_id, 'accept')}>Accept</button>
                  <button className='reject-btn' onClick={() => handleJoinRequest(req.user_id, 'reject')}>Reject</button>
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
