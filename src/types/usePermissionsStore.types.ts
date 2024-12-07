import { Data, Query } from './common.types';

export type Permission = {
  name: string;
  apiScopes: string[];
  feScopes: string[];
  permissionEntities: Record<string, string>;
  isDefault: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface PermissionQuery extends Query {
  name?: string[];
  isDefault?: boolean;
}

export interface PermissionStoreType {
  permissions: Data<Permission>;
  fetchPermissions: (query: PermissionQuery) => void;
  addPermission: (payload: Permission) => void;
}
