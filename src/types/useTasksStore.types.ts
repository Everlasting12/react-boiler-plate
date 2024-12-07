import { Data, Query } from './common.types';

export type Task = {
  id: number;
  taskId: string;
  title: string;
  drawingTitle: string;
  description: string;
  status: string;
  priority: string;
  dueTime: number;
  projectId: string;
  assignedToId: string;
  createdById: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  assignedTo?: AssignedTo;
  createdBy?: CreatedBy;
  project?: Project;
};

export type AssignedTo = {
  userId: string;
  email: string;
  name: string;
};

export type CreatedBy = {
  userId: string;
  email: string;
  name: string;
};

export interface Project {
  name: string;
}

export interface TaskQuery extends Query {
  name?: string[];
  isDefault?: boolean;
  relation?: boolean;
  projectId?: string;
}

export interface TaskStoreType {
  tasks: Data<Task>;
  fetchTasks: (query: TaskQuery) => void;
  addTask: (payload: Task) => void;
}
