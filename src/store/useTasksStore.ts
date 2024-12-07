import { create } from 'zustand';
import { Task, TaskQuery, TaskStoreType } from '../types/useTasksStore.types';
import API from '../common/api';
import { TASKS } from '../common/endpoints';
import { replaceUrlParams } from '../common/utils';

export const useTaskStore = create<TaskStoreType>((set) => ({
  tasks: { data: [], limit: 10, skip: 0, total: 0 },
  fetchTasks: async (query: TaskQuery) => {
    try {
      const res = await API.get(replaceUrlParams(TASKS, query), {
        params: query,
      });
      set({ tasks: res.data });
    } catch (error) {
      console.log('🚀 ~ fetchTasks: ~ error:', error);
    }
  },
  addTask: async (payload: Task) => {
    try {
      await API.post(TASKS, payload);
    } catch (error) {
      console.log('🚀 ~ fetchTasks: ~ error:', error);
    }
  },
}));
