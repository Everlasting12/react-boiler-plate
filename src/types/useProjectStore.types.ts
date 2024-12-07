import { Data, Query } from './common.types';

export type Project = {
  projectId: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  startDate: string;
  endDate?: string;
  createdById?: string;
  isActive?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
};

export type CreatedBy = {
  userId: string;
  email: string;
  name: string;
};

export interface ProjectQuery extends Query {
  name?: string[];
  isDefault?: boolean;
  relation?: boolean;
}

export interface ProjectStoreType {
  projects: Data<Project>;
  fetchProjects: (query: ProjectQuery) => void;
  addProject: (payload: Project) => void;
}
