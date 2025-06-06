import React, { useState } from 'react';
import './KanbanBoard.css';
import type { Task } from '../types/Task';
import KanbanColumn from './KanbanColumn';
import EditTaskModal from './EditTaskModal';
import TaskHistoryCard from './TaskHistoryCard';
import type { TaskHistory } from './TaskHistoryCard';
import TaskStatusChart from './TaskStatusChart';




//Mock data for now before we integrate
const initialTasks: Task[] = [
  {
    taskId: 1,
    teamId: 101,
    title: 'Setup project repo',
    description: 'Initialize repository on GitHub',
    statusId: 1,
    createdBy: 1,
    assignedTo: 2,
    createdAt: new Date(),
    dueDate: new Date('2025-06-10'),
    completedAt: new Date('2025-06-01')
  },
  {
    taskId: 2,
    teamId: 101,
    title: 'Design UI mockups',
    description: 'Create Figma wireframes for dashboard',
    statusId: 2,
    createdBy: 2,
    assignedTo: 3,
    createdAt: new Date(),
    dueDate: new Date('2025-06-12'),
    completedAt: new Date()
  },
  {
    taskId: 6,
    teamId: 101,
    title: 'Write API endpoints',
    description: 'Develop user authentication routes',
    statusId: 3,
    createdBy: 1,
    assignedTo: 2,
    createdAt: new Date(),
    dueDate: new Date('2025-06-08'),
    completedAt: new Date('2025-06-05')
  },
  {
    taskId: 7,
    teamId: 101,
    title: 'Write API endpoints',
    description: 'Develop user authentication routes',
    statusId: 1,
    createdBy: 1,
    assignedTo: 2,
    createdAt: new Date(),
    dueDate: new Date('2025-06-08'),
    completedAt: new Date('2025-06-05')
  },
  {
    taskId: 8,
    teamId: 101,
    title: 'Write API endpoints',
    description: 'Develop user authentication routes',
    statusId: 1,
    createdBy: 1,
    assignedTo: 2,
    createdAt: new Date(),
    dueDate: new Date('2025-06-08'),
    completedAt: new Date('2025-06-05')
  },
  {
    taskId: 9,
    teamId: 101,
    title: 'Write API endpoints',
    description: 'Develop user authentication routes',
    statusId: 1,
    createdBy: 1,
    assignedTo: 2,
    createdAt: new Date(),
    dueDate: new Date('2025-06-08'),
    completedAt: new Date('2025-06-05')
  },
  {
    taskId: 10,
    teamId: 101,
    title: 'Write API endpoints',
    description: 'Develop user authentication routes',
    statusId: 1,
    createdBy: 1,
    assignedTo: 2,
    createdAt: new Date(),
    dueDate: new Date('2025-06-08'),
    completedAt: new Date('2025-06-05')
  }
];

//Mock data for card history
const taskHistoryData: TaskHistory[] = [
  {
    id: 1,
    taskTitle: 'Setup project repo',
    oldStatus: 'To Do',
    newStatus: 'In Progress',
    ChangedBy: 'Alice',
    ChangedAt: '2025-06-03T10:30:00Z',
  },
  {
    id: 2,
    taskTitle: 'Write API endpoints',
    oldStatus: 'In Progress',
    newStatus: 'Done',
    ChangedBy: 'Bob',
    ChangedAt: '2025-06-04T14:45:00Z',
  },
  {
    id: 2,
    taskTitle: 'Write API endpoints',
    oldStatus: 'In Progress',
    newStatus: 'Done',
    ChangedBy: 'Bob',
    ChangedAt: '2025-06-04T14:45:00Z',
  },
  {
    id: 2,
    taskTitle: 'Write API endpoints',
    oldStatus: 'In Progress',
    newStatus: 'Done',
    ChangedBy: 'Bob',
    ChangedAt: '2025-06-04T14:45:00Z',
  },
  {
    id: 2,
    taskTitle: 'Write API endpoints',
    oldStatus: 'In Progress',
    newStatus: 'Done',
    ChangedBy: 'Bob',
    ChangedAt: '2025-06-04T14:45:00Z',
  },
  {
    id: 2,
    taskTitle: 'Write API endpoints',
    oldStatus: 'In Progress',
    newStatus: 'Done',
    ChangedBy: 'Bob',
    ChangedAt: '2025-06-04T14:45:00Z',
  },
  {
    id: 2,
    taskTitle: 'Write API endpoints',
    oldStatus: 'In Progress',
    newStatus: 'Done',
    ChangedBy: 'Bob',
    ChangedAt: '2025-06-04T14:45:00Z',
  },
  {
    id: 2,
    taskTitle: 'Write API endpoints',
    oldStatus: 'In Progress',
    newStatus: 'Done',
    ChangedBy: 'Bob',
    ChangedAt: '2025-06-04T14:45:00Z',
  },
];


export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({});

  const onDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData('text/plain', taskId.toString());
  };

  const onDrop = (e: React.DragEvent, newStatusId: number) => {
    const taskId = parseInt(e.dataTransfer.getData('text/plain'));
    setTasks(prev =>
      prev.map(task =>
        task.taskId === taskId ? { ...task, statusId: newStatusId } : task
      )
    );
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({ ...task });
  };

  const deleteTask = (taskId: number) => {
    setTasks(prev => prev.filter(task => task.taskId !== taskId));
  };


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

    setTasks(prev =>
      prev.map(task => (task.taskId === editingTask.taskId ? { ...task, ...formData } as Task : task))
    );
    setEditingTask(null);
    setFormData({});
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setFormData({});
  };

  return (
    <div className="kanban-container">
      <div className="kanban-board">
        <KanbanColumn
          statusId={1}
          title="To Do"
          tasks={tasks.filter(t => t.statusId === 1)}
          onDragStart={onDragStart}
          onDrop={onDrop}
          onTaskClick={openEditModal}
          onDeleteTask={deleteTask}
          onSaveTask={saveChanges}
        />
        <KanbanColumn
          statusId={2}
          title="In Progress"
          tasks={tasks.filter(t => t.statusId === 2)}
          onDragStart={onDragStart}
          onDrop={onDrop}
          onTaskClick={openEditModal}
          onDeleteTask={deleteTask}
          onSaveTask={saveChanges}
        />
        <KanbanColumn
          statusId={3}
          title="Done"
          tasks={tasks.filter(t => t.statusId === 3)}
          onDragStart={onDragStart}
          onDrop={onDrop}
          onTaskClick={openEditModal}
          onDeleteTask={deleteTask}
          onSaveTask={saveChanges}
        />

        <div className="dashboard-widgets">
          <div className="widget">
            <TaskHistoryCard history={taskHistoryData} />
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
        />
      )}
    </div>
  );
}

