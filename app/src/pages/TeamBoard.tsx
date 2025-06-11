import { useParams } from 'react-router-dom';
import KanbanBoard from '../components/KanbanBoard';
import { useTeamAccess } from '../hooks/useTeamAccess';

export const TeamBoard = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const allowed = useTeamAccess(teamId);

  if (allowed === null) return <p>Checking access...</p>;
  if (!allowed) return null;

  return <KanbanBoard />;
};