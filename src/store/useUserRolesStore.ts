import { create } from 'zustand';
import API from '../common/api';
import { USER_ROLES, USERS } from '../common/endpoints';
import {
  UserQuery,
  UserRoles,
  UserRolesQuery,
  UserRolesStoreType,
} from '../types/useUserRolesStore.types';
import toast from 'react-hot-toast';

export const useUserRolesStore = create<UserRolesStoreType>((set) => ({
  userRoles: { data: [], limit: 10, skip: 0, total: 0 },
  fetchUserRoles: async (query: UserRolesQuery) => {
    try {
      const res = await API.get(USER_ROLES, { params: query });
      set({ userRoles: res.data });
    } catch (error) {
      // console.log('fetchUserRoless: ~ error:', error);
    }
  },
  fetchUsers: async (query: UserQuery) => {
    try {
      const { data } = await API.get(USERS, {
        params: query,
      });
      return data;
    } catch (error) {
      // console.log('fetchUsers: ~ error:', error);
      return { data: [], limit: query.limit, skip: query.skip, total: 0 };
    }
  },
  addUserRoles: async (payload: UserRoles) => {
    try {
      const res = await API.post(USER_ROLES, payload);
      if (res.status == 201) {
        toast.success('User role assignment successful!');
        return true;
      }
      toast.error('User role assignment failed!');
      return false;
    } catch (error) {
      toast.error('User role assignment failed!');
      // console.log('fetchUsers: ~ error:', error);
      return false;
    }
  },
}));
