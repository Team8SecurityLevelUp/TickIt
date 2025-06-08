import React from 'react';
import './TaskCard.css';
import type { Task } from '../types/Task';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: number) => void;
  onClick: (task: Task) => void;
  onDelete: (taskId: number) => void;
  participants: { user_id: number; username: string }[];
}

export default function TaskCard({task, onDragStart, onClick, onDelete, participants}: TaskCardProps) {
  const assignedUser = participants.find(p => p.user_id === task.assignedTo);
  const assignedName = assignedUser ? assignedUser.username : 'Unassigned';

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
          e.stopPropagation();
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
        <span>Assigned to: {assignedName}</span><br />
        <span>Due: {task.dueDate.toDateString()}</span>
      </div>
    </div>
  );
}
