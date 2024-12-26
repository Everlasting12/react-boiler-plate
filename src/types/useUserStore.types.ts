import { Data, Query } from './common.types';

export type User = {
  id: number;
  userId: string;
  name: string;
  email: string;
  firebaseTokens?: string[];
  profilePic?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
};

export interface UserQuery extends Query {}

export interface UserStoreType {
  users: Data<User>;
  fetchUsers: (query: UserQuery) => void;
  addUser: (payload: User) => Promise<undefined | boolean>;
}
