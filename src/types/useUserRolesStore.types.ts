import { Data, Query } from './common.types';
import { User } from './user.types';
import { Roles } from './useRoleStore.types';

export type UserRoles = {
  id: number;
  roleId: string;
  userId: string;
  permissionEntities: Record<string, string>;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  role?: Pick<Roles, 'name' | 'permissionIds' | 'roleId'>;
  user?: Pick<User, 'name' | 'email'>;
};

export interface UserRolesQuery extends Query {
  name?: string[];
  isDefault?: boolean;
  relation?: boolean;
}

export interface UserRolesStoreType {
  userRoles: Data<UserRoles>;
  fetchUserRoless: (query: UserRolesQuery) => void;
}
