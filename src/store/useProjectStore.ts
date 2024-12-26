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
      //  console.log('fetchProjects: ~ error:', error);
    }
  },
  addProject: async (payload: Project) => {
    try {
      const res = await API.post(PROJECTS, payload);

      if (res.status == 201) {
        toast.success('Project added successfully');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Project could not be added!');
      //  console.log('addProject: ~ error:', error);
      return false;
    }
  },
  editProject: async (projectId: string, payload: Project) => {
    try {
      const res = await API.patch(`${PROJECTS}/${projectId}`, payload);

      if (res.status == 200) {
        toast.success('Project edited successfully');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Project could not be edited!');
      // console.log('editProject: ~ error:', error);
      return false;
    }
  },
}));
