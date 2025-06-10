import React from 'react';
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
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className='task-modal-title'>{formData.taskId ? 'Edit Task' : 'Create Task'}</h2>
        <label>
          Title:<br />
          <input
            name="title"
            type="text"
            value={formData.title || ''}
            onChange={onChange}
          />
        </label>

        <label>
          Description:<br />
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={onChange}
          />
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
        </label>
        <button className='save-button' onClick={onSave} style={{ marginRight: '0.5rem' }}>
          Save
        </button>
        <button className='cancel-task-button' onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
