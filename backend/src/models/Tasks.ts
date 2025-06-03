export interface Task {
  taskId: number,
  teamId: number,
  title: string,
  description: string,
  statusId: number,
  createdBy: number,
  assignedTo: number,
  createdAt: Date,
  dueDate: Date,
  completedAt: Date;
}