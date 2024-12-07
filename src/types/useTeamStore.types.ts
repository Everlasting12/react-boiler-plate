import { Data, Query } from './common.types';

export type Team = {
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

export interface TeamQuery extends Query {
  name?: string[];
  isDefault?: boolean;
  relation?: boolean;
}

export interface TeamStoreType {
  teams: Data<Team>;
  fetchTeams: (query: TeamQuery) => void;
  addTeam: (payload: Team) => void;
}
