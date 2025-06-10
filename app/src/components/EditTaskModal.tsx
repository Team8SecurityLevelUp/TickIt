import React, { useState } from 'react';
import './EditTaskModal.css';
import type { Task } from '../types/Task';
import type { Member } from './KanbanBoard';

interface EditTaskModalProps {
  task: Task;
  formData: Partial<Task>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  participants: Member[];
}

export default function EditTaskModal({formData, onChange, onSave, onCancel, participants }: EditTaskModalProps) {
  const descriptionCharLimit = 512;
  const titleCharLimit = 128;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSave = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required.';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave();
    }
  };


  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-content-task" onClick={e => e.stopPropagation()}>
        <h2 className='task-modal-title'>{formData.taskId ? 'Edit Task' : 'Create Task'}</h2>
        <label>
          Title:<br />
          <input
            name="title"
            type="text"
            value={formData.title || ''}
            onChange={onChange}
            maxLength={titleCharLimit}
          />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </label>

        <label>
          Description:<br />
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={onChange}
            maxLength={descriptionCharLimit}
          />
          <div className="char-counter">
            {formData.description?.length || 0} / {descriptionCharLimit}
          </div>
        </label>

        {formData.taskId && (<label>
          Assigned To:<br />
          <select
            name="assignedTo"
            value={formData.assignedTo ?? ''}
            onChange={onChange}
          >
            <option value="">Unassigned</option>
            {participants.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.username}
              </option>
            ))}
          </select>
        </label>)}
      
        <label>
          Due Date:<br />
          <input
            name="dueDate"
            min={new Date().toISOString().split('T')[0]}
            type="date"
            value={
              formData.dueDate
                ? new Date(formData.dueDate).toISOString().split('T')[0]
                : ''
            }
            onChange={onChange}
          />
          {errors.dueDate && <p className="error-message">{errors.dueDate}</p>}
        </label>
        <button className='save-button' onClick={handleSave} style={{ marginRight: '0.5rem' }}>
          Save
        </button>
        <button className='cancel-task-button' onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}