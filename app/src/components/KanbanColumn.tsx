import React, { useState } from 'react';
import type { Task } from '../types/Task';
import './KanbanColumn.css';
import TaskCard from './TaskCard';
import EditTaskModal from './EditTaskModal';

interface KanbanColumnProps {
  statusId: number;
  title: string;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, taskId: number) => void;
  onDrop: (e: React.DragEvent, newStatusId: number) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onSaveTask: (task: Task) => void;
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
  const newTask: Task = {
    taskId: Date.now(),
    title: formData.title || '',
    description: formData.description || '',
    assignedTo: formData.assignedTo || 0,
    dueDate: formData.dueDate ? new Date(formData.dueDate) : new Date(),
    statusId: formData.statusId ?? statusId,

   
    teamId: 1,              
    createdBy: 1,           
    createdAt: new Date(),  
    completedAt: null,     
  };

  onSaveTask(newTask);
  setShowModal(false);
  setFormData({ statusId });
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
        <button className="create-task-btn" onClick={() => setShowModal(true)}>
          + Add Task
        </button>
      </div>

      <div className="kanban-task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task.taskId}
            task={task}
            onDragStart={onDragStart}
            onClick={onTaskClick}
            onDelete={onDeleteTask}
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
        />
      )}
    </div>
  );
}
