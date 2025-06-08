import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetcher } from '../utils/fetcher';

interface Member {
  user_id: number;
  username: string;
  roles: string[];
}

export const useTeamAccess = (teamId: string | undefined) => {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!teamId) return;

    fetcher(`/teams/team-members?teamId=${teamId}`)
      .then((res) => {
        const currentUserId = res.data.currentUserId;
        const isMember = res.data.members.some((m: Member) => m.user_id === currentUserId);
        setAllowed(isMember);
        if (!isMember) navigate('/');
      })
      .catch(() => navigate('/'));
  }, [teamId, navigate]);

  return allowed;
};
