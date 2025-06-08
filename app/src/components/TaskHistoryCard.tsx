import { useState } from 'react';
import './TaskHistoryCard.css';
import './KanbanColumn.css';

export interface TaskHistory {
  id: number;
  taskTitle: string;
  oldStatus: string | null;
  newStatus: string;
  ChangedBy: string;
  ChangedAt: string;
  assignedTo: string | null;
  previousAssignee: string | null;
}

type Props = {
  history: TaskHistory[];
};

export default function TaskHistoryCard({ history }: Props) {
  const [filters, setFilters] = useState({
    showStatusChanges: true,
    showAssignmentChanges: true,
    timeRange: { unit: 'weeks', value: 2 },
  });

  const now = new Date();
  const threshold = new Date();
  switch (filters.timeRange.unit) {
    case 'days':
      threshold.setDate(now.getDate() - filters.timeRange.value);
      break;
    case 'weeks':
      threshold.setDate(now.getDate() - filters.timeRange.value * 7);
      break;
    case 'months':
      threshold.setMonth(now.getMonth() - filters.timeRange.value);
      break;
    case 'years':
      threshold.setFullYear(now.getFullYear() - filters.timeRange.value);
      break;
  }

  const filteredHistory = history.filter(entry => {
    const entryDate = new Date(entry.ChangedAt);
    const statusChanged = entry.oldStatus !== entry.newStatus;
    const reassigned =
      entry.previousAssignee !== entry.assignedTo &&
      (entry.previousAssignee || entry.assignedTo);

    const inRange = entryDate >= threshold;

    return (
      inRange &&
      ((filters.showStatusChanges && statusChanged) ||
        (filters.showAssignmentChanges && reassigned))
    );
  });

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    return new Date(b.ChangedAt).getTime() - new Date(a.ChangedAt).getTime();
  });

  return (
    <section className="task-history-card">
      <header>
        <h2>Project History</h2>
      </header>

      {}
      <section aria-label="History filters">
        <fieldset>
          <legend>Filter Changes</legend>
          <label>
            <input
              type="checkbox"
              checked={filters.showStatusChanges}
              onChange={() =>
                setFilters(prev => ({
                  ...prev,
                  showStatusChanges: !prev.showStatusChanges,
                }))
              }
            />
            Status changes
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.showAssignmentChanges}
              onChange={() =>
                setFilters(prev => ({
                  ...prev,
                  showAssignmentChanges: !prev.showAssignmentChanges,
                }))
              }
            />
            Assignment changes
          </label>
        </fieldset>

        <fieldset>
          <legend>Time Range</legend>
          <label>
            Show entries from the last{' '}
            <input
              type="number"
              min={1}
              value={filters.timeRange.value}
              onChange={e =>
                setFilters(prev => ({
                  ...prev,
                  timeRange: {
                    ...prev.timeRange,
                    value: parseInt(e.target.value),
                  },
                }))
              }
            />
          </label>
          <label>
            <select
              value={filters.timeRange.unit}
              onChange={e =>
                setFilters(prev => ({
                  ...prev,
                  timeRange: {
                    ...prev.timeRange,
                    unit: e.target.value as 'days' | 'weeks' | 'months' | 'years',
                  },
                }))
              }
            >
              <option value="days">days</option>
              <option value="weeks">weeks</option>
              <option value="months">months</option>
              <option value="years">years</option>
            </select>
          </label>
        </fieldset>
      </section>

      {}
      <section aria-label="Task history timeline" style={{ overflowY: 'auto', flexGrow: 1 }}>
        {sortedHistory.length === 0 ? (
          <p>No task history available.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sortedHistory.map(entry => {
              const formattedDate = new Date(entry.ChangedAt).toLocaleString();
              const statusChanged = entry.oldStatus !== entry.newStatus;
              const reassigned =
                entry.previousAssignee !== entry.assignedTo &&
                (entry.previousAssignee || entry.assignedTo);

              const descriptionParts: string[] = [];

              if (statusChanged) {
                descriptionParts.push(
                  `Status changed from ${entry.oldStatus ?? 'N/A'} to ${entry.newStatus}`
                );
              }

              if (reassigned) {
                if (entry.previousAssignee && entry.assignedTo) {
                  descriptionParts.push(
                    `Reassigned from ${entry.previousAssignee} to ${entry.assignedTo}`
                  );
                } else if (!entry.assignedTo && entry.previousAssignee) {
                  descriptionParts.push(`Unassigned from ${entry.previousAssignee}`);
                } else if (entry.assignedTo && !entry.previousAssignee) {
                  descriptionParts.push(`Assigned to ${entry.assignedTo}`);
                }
              }

              if (!statusChanged && !reassigned) {
                descriptionParts.push('No visible change');
              }

              return (
                <li key={entry.id}>
                  <article className="task-history-entry">
                    <header>
                      <h3>{entry.taskTitle}</h3>
                    </header>
                    <p>{descriptionParts.join('; ')}</p>
                    <footer>
                      <p>
                        by <strong>{entry.ChangedBy}</strong>{' '}
                        on <time dateTime={entry.ChangedAt}>{formattedDate}</time>
                      </p>
                    </footer>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </section>
  );
}
