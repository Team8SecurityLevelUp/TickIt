import React from 'react';
import './TaskCard.css';
import type { Task } from '../types/Task';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: number) => void;
  onClick: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskCard({ task, onDragStart, onClick, onDelete }: TaskCardProps) {
  return (
    <div
      className="kanban-task"
      draggable
      onDragStart={(e) => onDragStart(e, task.taskId)}
      onClick={() => onClick(task)}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      <button
        className="delete-btn"
        onClick={(e) => {
          e.stopPropagation(); // Prevent opening modal
          onDelete(task.taskId);
        }}
        aria-label="Delete task"
        title="Delete task"
      >
        x
      </button>
      <div className="task-title">{task.title}</div>
      <div className="task-desc">{task.description}</div>
      <div className="task-meta">
        <span>Assigned to: {task.assignedTo}</span><br />
        <span>Due: {task.dueDate.toDateString()}</span>
      </div>
    </div>
  );
}
