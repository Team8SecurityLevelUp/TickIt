import React from 'react';
import './EditTaskModal.css';
import type { Task } from '../types/Task';

interface EditTaskModalProps {
  task: Task;
  formData: Partial<Task>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditTaskModal({formData, onChange, onSave, onCancel }: EditTaskModalProps) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{formData.taskId ? 'Edit Task' : 'Create Task'}</h2>
        <label>
          Title:<br />
          <input
            name="title"
            type="text"
            value={formData.title || ''}
            onChange={onChange}
          />
        </label>
        <br />
        <label>
          Description:<br />
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={onChange}
          />
        </label>
        <br />
        <label>
          Assigned To:<br />
          <input
            name="assignedTo"
            type="number"
            value={formData.assignedTo || 0}
            onChange={onChange}
          />
        </label>
        <br />
        <label>
          Due Date:<br />
          <input
            name="dueDate"
            type="date"
            value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
            onChange={onChange}
          />
        </label>
        <br />
        <label>
          Status:<br />
          <select
            name="statusId"
            value={formData.statusId || 1}
            onChange={onChange}
          >
            <option value={1}>To Do</option>
            <option value={2}>In Progress</option>
            <option value={3}>Done</option>
          </select>
        </label>
        <br /><br />
        <button onClick={onSave} style={{ marginRight: '0.5rem' }}>
          Save
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
