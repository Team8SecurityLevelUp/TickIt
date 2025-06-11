import React, { useState } from 'react';
import './TaskCard.css';
import type { Task } from '../types/Task';
import { ConfirmationModal } from './ConfirmationModal';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: number) => void;
  onClick: (task: Task) => void;
  onDelete: (taskId: number) => void;
  participants: { user_id: number; username: string }[];
  ableToDelete: boolean;
}

export default function TaskCard({task, onDragStart, onClick, onDelete, participants, ableToDelete}: TaskCardProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const assignedUser = participants.find(p => p.user_id === task.assignedTo);
  const assignedName = assignedUser ? assignedUser.username : 'Unassigned';

  const truncatedTitle = task.title.length > 15 ? task.title.substring(0, 15) + '...' : task.title;
  const truncatedDescription = task.description.length > 25 ? task.description.substring(0, 25) + '...' : task.description;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task.taskId); 
  };


  return (
    <div
      className="kanban-task"
      draggable
      onDragStart={(e) => onDragStart(e, task.taskId)}
      onClick={() => onClick(task)}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      {ableToDelete && (
      <button
        className="delete-btn"
        onClick={handleDeleteClick}
        aria-label="Delete task"
        title="Delete task"
      >
        x
      </button>
      )}
      <div className="task-title">{truncatedTitle}</div>
      <div className="task-desc">{truncatedDescription}</div>
      <div className="task-meta">
        <span>Assigned to: {assignedName}</span><br />
        <span>Due: {task.dueDate.toDateString()}</span>
      </div>

      <ConfirmationModal
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete the task: "${task.title}"?`}
      />
    </div>
  );
}
