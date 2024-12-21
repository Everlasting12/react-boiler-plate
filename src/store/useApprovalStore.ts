import { create } from 'zustand';
import { ApprovalStoreType } from '../types/useApprovalStore.types';
import API from '../common/api';
import { TASKS } from '../common/endpoints';
import { TaskQuery } from '../types/useTasksStore.types';

export const useApprovalStore = create<ApprovalStoreType>((set) => ({
  approvals: { data: [], limit: 10, skip: 0, total: 0 },
  fetchApprovalResquests: async (query: TaskQuery) => {
    try {
      const res = await API.get(TASKS, { params: query });
      set({ approvals: res.data });
    } catch (error) {
      console.log('🚀 ~ fetchApprovalResquests: ~ error:', error);
    }
  },
}));

