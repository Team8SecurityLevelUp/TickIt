import React, { useState } from 'react';
import type { Task } from '../types/Task';
import './KanbanColumn.css';
import TaskCard from './TaskCard';
import EditTaskModal from './EditTaskModal';
import { fetcher } from '../utils/fetcher';
import type { Member } from './KanbanBoard';

interface KanbanColumnProps {
  statusId: number;
  title: string;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, taskId: number) => void;
  onDrop: (e: React.DragEvent, newStatusId: number) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onSaveTask: (task: Task) => void;
  teamId: number;
  participants: Member[];
  ableToDeleteTask: boolean;
}

export default function KanbanColumn({
  statusId,
  title,
  tasks,
  onDragStart,
  onDrop,
  onTaskClick,
  onDeleteTask,
  onSaveTask,
  teamId,
  participants,
  ableToDeleteTask,
}: KanbanColumnProps) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Task>>({ statusId });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'assignedTo' || name === 'statusId' ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    fetcher('/tasks', {
      method: 'POST',
      body: {
        teamId,
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
      },
    })
      .then((newTask) => {
        const parsedTask: Task = {
          taskId: newTask.taskId,
          teamId: teamId,
          title: newTask.title,
          description: newTask.description,
          statusId: statusId,
          createdBy: newTask.createdBy ?? 0,
          assignedTo: newTask.assignedTo ?? null,
          createdAt: new Date(newTask.createdAt),
          dueDate: new Date(newTask.dueDate),
          completedAt: newTask.completedAt ? new Date(newTask.completedAt) : null,
        };

        onSaveTask(parsedTask);
        setShowModal(false);
        setFormData({ statusId });
      })
      .catch((err) => {
        console.error('Failed to create task:', err);
      });
  };

  return (
    <div
      className="kanban-column"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, statusId)}
    >
      <div className="kanban-column-header">
        <h2 className="kanban-column-title">
          {title} <span className="task-count">({tasks.length})</span>
        </h2>
        {statusId === 1 &&
        <button className="create-task-btn" onClick={() => setShowModal(true)}>
          + Add Task
        </button>
        }
      </div>

      <div className="kanban-task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task.taskId}
            task={task}
            onDragStart={onDragStart}
            onClick={onTaskClick}
            onDelete={onDeleteTask}
            participants={participants}
            ableToDelete={ableToDeleteTask}
          />
        ))}
      </div>

      {showModal && (
        <EditTaskModal
          task={{} as Task}
          formData={formData}
          onChange={handleChange}
          onSave={handleSave}
          onCancel={() => {
            setShowModal(false);
            setFormData({ statusId });
          }}
          participants={participants}
        />
      )}
    </div>
  );
}
