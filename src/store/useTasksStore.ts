import { create } from 'zustand';
import { Task, TaskQuery, TaskStoreType } from '../types/useTasksStore.types';
import API from '../common/api';
import { TASKS } from '../common/endpoints';
import { replaceUrlParams } from '../common/utils';
import toast from 'react-hot-toast';
import { useLoginStore } from './useLoginStore';

export const useTaskStore = create<TaskStoreType>((set) => ({
  tasks: { data: [], limit: 10, skip: 0, total: 0 },
  fetchTasks: async (query: TaskQuery) => {
    try {
      const roleId = useLoginStore.getState().authenticatedUserRoleId;
      if (!['TEAM_LEAD', 'DIRECTOR'].includes(roleId)) {
        query.createdById = useLoginStore.getState().loggedInUserId;
      }
      console.log('🚀 ~ fetchTasks: ~ query:', query);
      const res = await API.get(replaceUrlParams(TASKS, query), {
        params: query,
      });
      set({ tasks: res.data });
    } catch (error) {
      console.log('🚀 ~ fetchTasks: ~ error:', error);
    }
  },
  addTask: async (projectId: string, payload: Task) => {
    try {
      const res = await API.post(
        replaceUrlParams(TASKS, { projectId }),
        payload,
      );
      if (res.status == 201) {
        toast.success('Task created successfully');
        return true;
      }
      toast.error('Task could not be created!');
      return false;
    } catch (error) {
      toast.error('Task could not be created!');
      console.log('🚀 ~ addTask: ~ error:', error);
      return false;
    }
  },
  editTask: async (
    taskId: string,
    projectId: string,
    payload: Partial<Task>,
  ) => {
    try {
      const res = await API.patch(
        replaceUrlParams(`${TASKS}/:taskId`, { projectId, taskId }),
        payload,
      );
      if (res.status == 201) {
        toast.success('Task edited successfully');
        return true;
      }
      toast.error('Task could not be edited!');
      return false;
    } catch (error) {
      toast.error('Task could not be edited!');
      console.log('🚀 ~ editTask: ~ error:', error);
      return false;
    }
  },
  sendTaskToTeamLead: async (taskId: string, projectId: string) => {
    try {
      const res = await API.patch(
        replaceUrlParams(`${TASKS}/:taskId/status`, { projectId, taskId }),
      );
    } catch (error) {
      console.log('🚀 ~ sendTaskToTeamLead: ~ error:', error);
    }
  },
}));
