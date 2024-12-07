import { Data, Query } from './common.types';

export type Roles = {
  id: number;
  name: string;
  roleId: string;
  permissionIds: string[];
  permissionEntities: Record<string, string>;
  isDefault: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface RolesQuery extends Query {
  name?: string[];
  isDefault?: boolean;
}

export interface RolesStoreType {
  roles: Data<Roles>;
  fetchRoles: (query: RolesQuery) => void;
}
