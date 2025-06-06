import React from 'react';
import { Modal } from './components/Modal';
import { UpdateUserRole } from './components/UpdateUserRole';
import { CreateTeam } from './components/CreateTeam';
import { TaskCreation } from './components/TaskCreation';
import { AuthContext } from './auth/AuthContext';

export const App = () => {
  const [showCreate, setShowCreate] = React.useState(false);
  const [showRoles, setShowRoles] = React.useState(false);
  const [showCreateTask, setShowCreateTask] = React.useState(false);
  const { logout } = React.useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <section>
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => setShowCreate(true)}>Create Team</button>
        <button onClick={() => setShowRoles(true)}>Manage Roles</button>
        <button onClick={() => setShowCreateTask(true)}>Create Task</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)}>
        <CreateTeam onClose={() => setShowCreate(false)} />
      </Modal>

      <Modal isOpen={showRoles} onClose={() => setShowRoles(false)}>
        <UpdateUserRole onClose={() => setShowRoles(false)} />
      </Modal>

      <Modal isOpen={showCreateTask} onClose={() => setShowCreateTask(false)}>
        <TaskCreation onClose={() => setShowCreateTask(false)} teamId="mocked-team-id" />
      </Modal>
    </section>
  );
};
