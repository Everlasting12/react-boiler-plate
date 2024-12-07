import { create } from 'zustand';
import {
  Project,
  ProjectQuery,
  ProjectStoreType,
} from '../types/useProjectStore.types';
import API from '../common/api';
import { PROJECTS } from '../common/endpoints';
import { replaceUrlParams } from '../common/utils';
import toast from 'react-hot-toast';

export const useProjectStore = create<ProjectStoreType>((set) => ({
  projects: { data: [], limit: 10, skip: 0, total: 0 },
  fetchProjects: async (query: ProjectQuery) => {
    try {
      const res = await API.get(replaceUrlParams(PROJECTS, query), {
        params: query,
      });
      set({ projects: res.data });
    } catch (error) {
      console.log('🚀 ~ fetchProjects: ~ error:', error);
    }
  },
  addProject: async (payload: Project) => {
    try {
      // TODO:
      // payload.createdById get the user id from sub or state
      const res = await API.post(PROJECTS, payload);

      if (res.status == 201) {
        toast.success('Project added successfully');
        // return { message: 'Project added successfully', success: true };
      }
      // return { message: 'Project could not be added!', success: false };
    } catch (error) {
      toast.error('Project could not be added!');
      console.log('🚀 ~ addProject: ~ error:', error);
      // return { message: 'Project could not be added!', success: false };
    }
  },
}));
