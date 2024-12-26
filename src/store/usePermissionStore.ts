import { create } from 'zustand';
import {
  Permission,
  PermissionQuery,
  PermissionStoreType,
} from '../types/usePermissionsStore.types';
import API from '../common/api';
import { PERMISSIONS } from '../common/endpoints';

export const usePermissionStore = create<PermissionStoreType>((set) => ({
  permissions: { data: [], limit: 10, skip: 0, total: 0 },
  fetchPermissions: async (query: PermissionQuery) => {
    try {
      const res = await API.get(PERMISSIONS, { params: query });
      set({ permissions: res.data });
    } catch (error) {
      // console.log('fetchPermissions: ~ error:', error);
    }
  },
  addPermission: async (payload: Permission) => {
    try {
      await API.post(PERMISSIONS, payload);
    } catch (error) {
      // console.log('fetchPermissions: ~ error:', error);
    }
  },
}));
