import { create } from 'zustand';
import API from '../common/api';
import { USER_ROLES } from '../common/endpoints';
import {
  UserRolesQuery,
  UserRolesStoreType,
} from '../types/useUserRolesStore.types';

export const useUserRolesStore = create<UserRolesStoreType>((set) => ({
  userRoles: { data: [], limit: 10, skip: 0, total: 0 },
  fetchUserRoless: async (query: UserRolesQuery) => {
    try {
      const res = await API.get(USER_ROLES, { params: query });
      set({ userRoles: res.data });
    } catch (error) {
      console.log('🚀 ~ fetchUserRoless: ~ error:', error);
    }
  },
}));
