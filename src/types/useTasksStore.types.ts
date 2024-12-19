import { Data, Query } from './common.types';

export type Task = {
  id: number;
  taskId: string;
  drawingTitle: string;
  description: string;
  status: string;
  priority: string;
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
  category?: string;
}

export interface TaskQuery extends Query {
  name?: string[];
  isDefault?: boolean;
  relation?: boolean;
  projectId?: string;
  createdById?: string;
  priority?: string[];
}

export interface TaskStoreType {
  tasks: Data<Task>;
  fetchTasks: (query: TaskQuery) => void;
  addTask: (projectId: string, payload: Task) => Promise<boolean | undefined>;
  editTask: (
    taskId: string,
    projectId: string,
    payload: Partial<Task>,
  ) => Promise<boolean | undefined>;
  sendTaskToTeamLead: (taskId: string, projectId: string) => void;
  task: undefined | Task;
  fetchTaskByTaskId: (taskId: string) => void;
}
