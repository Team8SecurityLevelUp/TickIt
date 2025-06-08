import React, { useState, useCallback } from 'react';
import './KanbanBoard.css';
import type { Task } from '../types/Task';
import KanbanColumn from './KanbanColumn';
import TaskHistoryCard from './TaskHistoryCard';
import type { TaskHistory } from './TaskHistoryCard';
import TaskStatusChart from './TaskStatusChart';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { ModalContext } from './ModalContext';
import { UpdateUserRoleModal } from './UpdateUserRoleModal';
import { fetcher } from '../utils/fetcher';
import EditTaskModal from './EditTaskModal';


export interface Member {
  user_id: number;
  username: string;
  roles: string[];
}

interface FetchedTask {
  taskId: number;
  teamId: number;
  title: string;
  description: string;
  statusId: number;
  createdBy: number;
  assignedTo: number | null;
  createdAt: string;
  dueDate: string;
  completedAt: string | null;
}

interface FetchedTaskHistory {
  taskId: number;
  title: string;
  oldStatus: string | null;
  newStatus: string;
  changedBy: string;
  changedAt: string;
  assignedTo: string;
  previousAssignee: string;
}


const columns = [
  { statusId: 1, title: 'To Do' },
  { statusId: 2, title: 'In Progress' },
  { statusId: 3, title: 'Done' },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({});
  const [isAccessAdmin, setIsAccessAdmin] = useState(false);
  const { show, hide } = useContext(ModalContext)!;
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const parsedTeamId = Number(teamId);
  const [participants, setParticipants] = useState<Member[]>([]);
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);

  const onDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData('text/plain', taskId.toString());
  };

  const onDrop = (e: React.DragEvent, newStatusId: number) => {
    const taskId = parseInt(e.dataTransfer.getData('text/plain'));

    const draggedTask = tasks.find((task) => task.taskId === taskId);
    if (!draggedTask || draggedTask.statusId === newStatusId) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.taskId === taskId ? { ...task, statusId: newStatusId } : task
      )
    );

    fetcher(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: { statusId: newStatusId },
    }).catch((err) => {
      console.error('Failed to update task status:', err);

      setTasks((prev) =>
        prev.map((task) =>
          task.taskId === taskId ? { ...task, statusId: draggedTask.statusId } : task
        )
      );
    });
  };

  const fetchTaskHistory = useCallback(async () => {
    if (!tasks.length) return;

    try {
      const taskIds = tasks.map(t => t.taskId);

      const histories = await Promise.all(
        taskIds.map(id =>
          fetcher(`/tasks/${id}/history`).catch(() => [])
        )
      );

      const flattened: TaskHistory[] = histories.flat().map((h: FetchedTaskHistory, index: number) => ({
        id: index + 1,
        taskTitle: h.title,
        oldStatus: h.oldStatus ?? 'N/A',
        newStatus: h.newStatus,
        ChangedBy: h.changedBy,
        ChangedAt: h.changedAt,
        assignedTo: h.assignedTo,
        previousAssignee: h.previousAssignee,
      }));

      setTaskHistory(flattened);
    } catch (err) {
      console.error('Failed to fetch task history:', err);
    }
  }, [tasks]);

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({ ...task });
  };

  const addTask = (newTask: Task) => {
    console.log(newTask);
    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = (taskId: number) => {
    setTasks(prev => prev.filter(task => task.taskId !== taskId));
  };

  React.useEffect(() => {
    fetchTaskHistory();
  }, [fetchTaskHistory]);

  React.useEffect(() => {
    if (!parsedTeamId) return;

    fetcher(`/teams/team-members?teamId=${parsedTeamId}`)
      .then((res) => {
        const currentUserId = res.data.currentUserId;
        const currentUser = res.data.members.find((m: Member) => m.user_id === currentUserId);
        setIsAccessAdmin(currentUser?.roles.includes('AccessAdmin') || false);
        setParticipants(res.data.members);
      })
      .catch((err) => {
        console.error('Failed to check access admin role', err);
      });

    fetcher(`/tasks/${parsedTeamId}`)
      .then((res) => {
        const parsedTasks = res.map((t: FetchedTask) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          dueDate: new Date(t.dueDate),
          completedAt: t.completedAt ? new Date(t.completedAt) : null,
        }));
        setTasks(parsedTasks);
      })
      .catch((err) => {
        console.error('Failed to fetch team tasks:', err);
      });
  }, [parsedTeamId]);



  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dueDate' || name === 'completedAt' || name === 'createdAt'
        ? new Date(value)
        : name === 'assignedTo' || name === 'createdBy' || name === 'statusId' || name === 'teamId' || name === 'taskId'
          ? parseInt(value)
          : value,
    }));
  };

  const saveChanges = () => {
    if (!editingTask) return;

    const promises: Promise<unknown>[] = [];

    if (
      formData.title !== editingTask.title ||
      formData.description !== editingTask.description ||
      (formData.dueDate && new Date(formData.dueDate).toISOString() !== new Date(editingTask.dueDate).toISOString())
    ) {
      promises.push(
        fetcher(`/tasks/${editingTask.taskId}`, {
          method: 'PATCH',
          body: {
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate,
          },
        })
      );
    }

    if (formData.statusId && formData.statusId !== editingTask.statusId) {
      promises.push(
        fetcher(`/tasks/${editingTask.taskId}/status`, {
          method: 'PATCH',
          body: {
            statusId: formData.statusId,
          },
        })
      );
    }

    const currentAssigned = editingTask.assignedTo ?? '';
    const newAssigned = formData.assignedTo ?? '';
    if (newAssigned !== currentAssigned) {
      promises.push(
        fetcher(`/tasks/${editingTask.taskId}/assign`, {
          method: 'PATCH',
          body: {
            assignedUserId: newAssigned || null,
          },
        })
      );
    }

    Promise.all(promises)
      .then(() => {
        fetcher(`/tasks/${editingTask.teamId}`)
          .then((res) => {
            const parsedTasks = res.map((t: FetchedTask) => ({
              ...t,
              createdAt: new Date(t.createdAt),
              dueDate: new Date(t.dueDate),
              completedAt: t.completedAt ? new Date(t.completedAt) : null,
            }));
            setTasks(parsedTasks);
          });

        setEditingTask(null);
        setFormData({});
      })
      .catch((err) => {
        console.error('Failed to update task:', err);
      });
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setFormData({});
  };


  return (
    <div className="kanban-container">
      <header className="kanban-header">
        <h1 onClick={() => navigate('/')}>TickIt</h1>
        {isAccessAdmin && parsedTeamId && (
          <button onClick={() => show(<UpdateUserRoleModal onClose={hide} teamId={parsedTeamId} />)}>
            Access Manager
          </button>
        )}
      </header>
      <div className="kanban-board">
      {columns.map(({ statusId, title }) => (
        <KanbanColumn
          key={statusId}
          statusId={statusId}
          title={title}
          tasks={tasks.filter(t => t.statusId === statusId)}
          onDragStart={onDragStart}
          onDrop={onDrop}
          onTaskClick={openEditModal}
          onDeleteTask={deleteTask}
          onSaveTask={addTask}
          teamId={parsedTeamId}
          participants={participants}
        />
      ))}
        <div className="dashboard-widgets">
          <div className="widget">
            <TaskHistoryCard history={taskHistory} />
          </div>
          <div className="widget">
            <TaskStatusChart tasks={tasks} />
          </div>
        </div>
      </div>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          formData={formData}
          onChange={onChange}
          onSave={saveChanges}
          onCancel={cancelEditing}
          participants={participants}
        />
      )}
    </div>
  );
}

