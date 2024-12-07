import { create } from 'zustand';
import { Team, TeamQuery, TeamStoreType } from '../types/useTeamStore.types';
import API from '../common/api';
import { TEAMS } from '../common/endpoints';
import { replaceUrlParams } from '../common/utils';
import toast from 'react-hot-toast';

export const useTeamStore = create<TeamStoreType>((set) => ({
  teams: { data: [], limit: 10, skip: 0, total: 0 },
  fetchTeams: async (query: TeamQuery) => {
    try {
      const res = await API.get(replaceUrlParams(TEAMS, query), {
        params: query,
      });
      set({ teams: res.data });
    } catch (error) {
      console.log('🚀 ~ fetchTeams: ~ error:', error);
    }
  },
  addTeam: async (payload: Team) => {
    try {
      // TODO:
      // payload.createdById get the user id from sub or state
      const res = await API.post(TEAMS, payload);

      if (res.status == 201) {
        toast.success('Team added successfully');
        // return { message: 'Team added successfully', success: true };
      }
      // return { message: 'Team could not be added!', success: false };
    } catch (error) {
      toast.error('Team could not be added!');
      console.log('🚀 ~ addTeam: ~ error:', error);
      // return { message: 'Team could not be added!', success: false };
    }
  },
}));
