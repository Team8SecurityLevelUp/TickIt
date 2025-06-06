import { useContext, useState } from 'react';
import './HomePage.css';
import { ModalContext } from '../components/ModalContext';
import { FilterTeamsModal } from '../components/FilterTeamsModal';
import { CreateTeam } from '../components/CreateTeam';
import { useNavigate } from 'react-router-dom';
import { JoinTeamModal } from '../components/JoinTeamModal';
import { useAuth } from '../auth/useAuth';

type Team = {
  id: number;
  name: string;
  creator: string;
  members: number;
  role: 'Creator' | 'Collaborator' | 'Joinable' | 'Requested';
};

const mockTeams: Team[] = [
  { id: 1, name: 'Alpha Squad', creator: 'Alice', members: 5, role: 'Creator' },
  { id: 2, name: 'Beta Builders', creator: 'Bob', members: 3, role: 'Collaborator' },
  { id: 3, name: 'Gamma Group', creator: 'Gina', members: 4, role: 'Joinable' },
  { id: 4, name: 'Delta Devs', creator: 'Derek', members: 2, role: 'Requested' },
  { id: 5, name: 'Echo Engineers', creator: 'Eli', members: 6, role: 'Collaborator' },
  { id: 6, name: 'Foxtrot Force', creator: 'Farah', members: 7, role: 'Creator' },
  { id: 7, name: 'Giga Geeks', creator: 'Grace', members: 5, role: 'Joinable' },
  { id: 8, name: 'Hyper Hackers', creator: 'Hank', members: 3, role: 'Requested' },
  { id: 9, name: 'Ivy Innovators', creator: 'Iris', members: 8, role: 'Creator' },
  { id: 10, name: 'Jetpack Junkies', creator: 'Jude', members: 2, role: 'Collaborator' },
  { id: 11, name: 'Kilo Knights', creator: 'Kara', members: 6, role: 'Joinable' },
  { id: 12, name: 'Logic League', creator: 'Leo', members: 9, role: 'Requested' },
  { id: 13, name: 'Mega Minds', creator: 'Mira', members: 4, role: 'Creator' },
  { id: 14, name: 'Nova Nexus', creator: 'Nate', members: 7, role: 'Collaborator' },
  { id: 15, name: 'Omega Ops', creator: 'Olive', members: 3, role: 'Joinable' },
  { id: 16, name: 'Pixel Pioneers', creator: 'Paula', members: 2, role: 'Requested' },
  { id: 17, name: 'Quantum Quest', creator: 'Quinn', members: 5, role: 'Collaborator' },
  { id: 18, name: 'Rocket Rebels', creator: 'Ray', members: 6, role: 'Creator' },
  { id: 19, name: 'Syntax Squad', creator: 'Sage', members: 4, role: 'Joinable' },
  { id: 20, name: 'Turbo Techies', creator: 'Tara', members: 3, role: 'Requested' },
  { id: 21, name: 'Unity Unit', creator: 'Uri', members: 7, role: 'Collaborator' },
  { id: 22, name: 'Vertex Vanguard', creator: 'Vera', members: 6, role: 'Joinable' },
  { id: 23, name: 'Warp Wolves', creator: 'Wade', members: 5, role: 'Creator' },
  { id: 24, name: 'Xeno Xperts', creator: 'Xena', members: 4, role: 'Collaborator' }
];

export const HomePage = () => {
  const { show, hide } = useContext(ModalContext)!;
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [filters, setFilters] = useState({
    teamName: '',
    creatorName: '',
    role: ''
  });

  const filteredTeams = mockTeams.filter(team => {
    return (
      team.name.toLowerCase().includes(filters.teamName.toLowerCase()) &&
      team.creator.toLowerCase().includes(filters.creatorName.toLowerCase()) &&
      (filters.role === '' || team.role === filters.role)
    );
  });

  const handleTeamClick = (team: Team) => {
    if (team.role === 'Joinable') {
      show(
        <JoinTeamModal
          team={team}
          onConfirm={() => {
            console.log('Joining team:', team.name);
            hide();
            navigate('/team-board');
          }}
          onCancel={hide}
        />
      );
    } else {
      navigate('/team-board');
    }
  };

  const openFilterModal = () => {
    show(<FilterTeamsModal onApply={(values) => {
      setFilters(values);
      hide();
    }} />);
  };

  const openCreateTeamModal = () => {
    show(<CreateTeam onCreate={(teamName) => {
      console.log('Would create team:', teamName);
      navigate('/team-board ')
      hide();
    }} />);
  };

  return (
    <main>
      <section className="container">
        <header className="top-bar">
          <h1>TickIt</h1>
          <nav className="top-bar-actions">
              <button type="button" onClick={openCreateTeamModal}>+ Create Team</button>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  window.location.href = '/login';
                }}
              >
                Logout
              </button>
            </nav>
        </header>

        <section>
          <button type="button" className="filter-button" onClick={openFilterModal}>
            Filter options
          </button>
        </section>

        <section className="team-list">
          {filteredTeams.map(team => (
            <article
              key={team.id}
              className="team-card"
              onClick={() => handleTeamClick(team)}
              tabIndex={0}
              role="button"
              aria-label={`Open ${team.name} board`}
            >
              <header className="card-header">
                <h3>{team.name}</h3>
                <strong className="team-role">
                  {team.role === 'Joinable'
                    ? 'Join Team'
                    : team.role === 'Requested'
                    ? '*Join Team'
                    : team.role}
                </strong>
              </header>
              <footer className="card-footer">
                <p>Creator: {team.creator}</p>
                <p className="member-count">{team.members} member{team.members !== 1 && 's'}</p>
              </footer>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
};
