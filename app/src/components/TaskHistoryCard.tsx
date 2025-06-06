import './TaskHistoryCard.css';
import './KanbanColumn.css'

export type TaskHistory = {
  id: number;
  taskTitle: string;
  oldStatus: string;
  newStatus: string;
  ChangedBy: string;
  ChangedAt: string;
};

type Props = {
  history: TaskHistory[];
};

export default function TaskHistoryCard({ history }: Props) {
  return (
    
    <div className="task-history-card">
      <div className="kanban-column-header">
        <h2 className="kanban-column-title">Project History</h2>
      </div>

      <div className="kanban-task-list">
        {history.length === 0 ? (
          <p>No task history available.</p>
        ) : (
          history.map(entry => (
            <div key={entry.id} className="task-history-entry">
              <strong>{entry.taskTitle}</strong><br />
              Status changed from <em>{entry.oldStatus}</em> to <em>{entry.newStatus}</em><br />
              by <b>{entry.ChangedBy}</b> on <span>{new Date(entry.ChangedAt).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
