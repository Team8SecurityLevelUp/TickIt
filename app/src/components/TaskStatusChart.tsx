import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Task } from '../types/Task';

interface Props {
  tasks: Task[];
}

const COLORS = ['#8884d8', '#ffc658', '#82ca9d'];

const TaskStatusChart: React.FC<Props> = ({ tasks }) => {
  const statusData = [
    { name: 'To Do', value: tasks.filter(t => t.statusId === 1).length },
    { name: 'In Progress', value: tasks.filter(t => t.statusId === 2).length },
    { name: 'Done', value: tasks.filter(t => t.statusId === 3).length },
  ];

  const totalTasks = statusData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className='task-history-card'>
      <h3>Task Distribution</h3>
      {totalTasks === 0 ? (
        <p>No tasks to display. Add tasks to see distribution.</p>
      ) : (
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {statusData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TaskStatusChart;
