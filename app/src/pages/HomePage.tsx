import { useContext, useEffect, useState } from 'react';
import './HomePage.css';
import { ModalContext } from '../components/ModalContext';
import { FilterTeamsModal } from '../components/FilterTeamsModal';
import { CreateTeam } from '../components/CreateTeam';
import { useNavigate } from 'react-router-dom';
import { JoinTeamModal } from '../components/JoinTeamModal';
import { useAuth } from '../auth/useAuth';
import { fetcher } from '../utils/fetcher';
import TickItLogo from '../assets/TickItLogo.png';

type Team = {
  team_id: number;
  team_name: string;
  is_active: boolean;
  member_count: number;
  creator: { username: string };
  roles: { role_name: string; approval_status: string }[];
};

const rolePriority = ['Creator', 'AccessAdmin', 'TeamLead', 'ToDoUser'];

export const HomePage = () => {
  const { show, hide } = useContext(ModalContext)!;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [filters, setFilters] = useState({
    teamName: '',
    creatorName: '',
    role: ''
  });

  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetcher('/teams')
      .then((res) => setTeams(res.data))
      .catch((err) => console.error('Failed to load teams', err));
  }, []);

  const getHighestRole = (roles: Team['roles']): string => {
    const accepted = roles.filter(r => r.approval_status === 'Accepted');
    if (accepted.length > 0) {
      return accepted.sort((a, b) => rolePriority.indexOf(a.role_name) - rolePriority.indexOf(b.role_name))[0].role_name;
    }
    if (roles.some(r => r.approval_status === 'Pending')) return 'Pending';
    if (roles.some(r => r.approval_status === 'Declined')) return 'Declined';
    return 'Joinable';
  };

  const filteredTeams = teams.filter(team => {
    const role = getHighestRole(team.roles);
    return (
      team.team_name.toLowerCase().includes(filters.teamName.toLowerCase()) &&
      team.creator.username.toLowerCase().includes(filters.creatorName.toLowerCase()) &&
      (filters.role === '' || role === filters.role)
    );
  });

  const handleTeamClick = (team: Team) => {
    const role = getHighestRole(team.roles);

    if (role === 'Joinable') {
      show(
        <JoinTeamModal
          team={team}
          onConfirm={async (selectedRole) => {
            try {
              await fetcher('/teams/join', {
                method: 'POST',
                body: {
                  teamId: team.team_id,
                  roleType: selectedRole,
                },
              });

              hide();
              fetcher('/teams')
                .then((res) => setTeams(res.data))
                .catch((err) => console.error('Failed to load teams', err));
            } catch (err: unknown) {
              console.error('Failed to join team:', err);
            }
          }}
          onCancel={hide}
        />
      );
    } else if (role === 'Pending' || role === 'Declined') {
      // Do nothing
    } else {
      navigate(`/team-board/${team.team_id}`);
    }
  };

  const openFilterModal = () => {
    show(<FilterTeamsModal onApply={(values) => {
      setFilters(values);
      hide();
    }}
    onClose={hide} />);
  };

  const openCreateTeamModal = () => {
    show(
      <CreateTeam
        onCreate={async (teamName) => {
          try {
            const response = await fetcher('/teams/create', {
              method: 'POST',
              body: { teamName }
            });

            const newTeam = response.data;
            hide();
            navigate(`/team-board/${newTeam.id}`);
          } catch (err) {
            console.error('Create team failed', err);
          }
        }}
        onClose={hide}
      />
    );
  };

  return (
    <main>
      <section className="container">
        <header className="top-bar">
          <img
            src={TickItLogo}
            alt="App Logo"
            className="logo"
          />
          <nav className="top-bar-actions">
            <button type="button" onClick={openCreateTeamModal}>+ Create Team</button>
              <button type="button" onClick={openFilterModal}>
            Filter options
          </button>
            
          </nav>
        </header>

        <section className="logout-button-wrapper">
        <button type="button" className="logout-button" onClick={async () => {
              await logout();
              window.location.href = '/login';
            }}>
              Logout
            </button>
        </section>

        <section className="team-list">
          {filteredTeams.map(team => {
            const role = getHighestRole(team.roles);
            const roleDisplay = {
              Joinable: 'Join Team',
              Pending: 'Request Pending',
              Declined: 'Request Declined',
              AccessAdmin: 'Access Admin',
              TeamLead: 'Team Lead',
              ToDoUser: 'Collaborator',
            }[role] ?? role;

            return (
              <article
                key={team.team_id}
                className={`team-card ${role === 'Pending' || role === 'Declined' ? 'disabled' : ''}`}
                onClick={() => handleTeamClick(team)}
                tabIndex={0}
                role="button"
                aria-label={`Open ${team.team_name} board`}
              >
                <header className="card-header">
                  <h3>{team.team_name}</h3>
                  <strong className="team-role">{roleDisplay}</strong>
                </header>
                <footer className="card-footer">
                  <p>Creator: {team.creator.username}</p>
                  <p className="member-count">{team.member_count} member{team.member_count !== 1 && 's'}</p>
                </footer>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
};
