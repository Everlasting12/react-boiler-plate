import { create } from 'zustand';
import API from '../common/api';
import { ROLES } from '../common/endpoints';
import { RolesQuery, RolesStoreType } from '../types/useRoleStore.types';

export const useRoleStore = create<RolesStoreType>((set) => ({
  roles: { data: [], limit: 10, skip: 0, total: 0 },
  fetchRoles: async (query: RolesQuery) => {
    try {
      const res = await API.get(ROLES, { params: query });
      set({ roles: res.data });
    } catch (error) {
      // console.log('fetchRoles: ~ error:', error);
    }
  },
}));
