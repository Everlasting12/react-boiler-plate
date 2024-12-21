import { create } from 'zustand';
import Cookies from 'js-cookie';
import { UsernamePasswordPayload } from '../types/useLoginStore.types';
import API from '../common/api';
import { AUTH_LOGIN } from '../common/endpoints';
import { User } from '../types/user.types';

type initialAuthObjType = {
  isAuthenticated: boolean;
  authenticatedUserRoleId: string;
  user: User | undefined;
  token: string;
  feScopes: string[];
  loggedInUserId: string;
  permissionEntities: Record<string, string[]>;
};
let initialAuthObj: initialAuthObjType = {
  isAuthenticated: false,
  authenticatedUserRoleId: '',
  user: undefined,
  token: '',
  feScopes: [],
  loggedInUserId: '',
  permissionEntities: {},
};

export type LoginStoreType = typeof initialAuthObj & {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  setToken: (token: string) => void;
  loginWithEmail: (
    payload: UsernamePasswordPayload,
  ) => Promise<boolean | undefined>;
  logout: () => void;
  getAuthDetails: () => boolean;
};

export const useLoginStore = create<LoginStoreType>((set) => ({
  ...initialAuthObj,
  isLoading: false,
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setToken: (token: string) => {
    Cookies.set('token', token);
    set({ token, isAuthenticated: !!token });
  },

  loginWithEmail: async (payload: UsernamePasswordPayload) => {
    try {
      const { data } = await API.post(AUTH_LOGIN, payload);

      const {
        authentication: {
          accessToken,
          payload: { feScopes, roleId, permissionEntities },
        },
        user,
      } = data;

      if (accessToken && feScopes?.length) {
        Cookies.set('token', accessToken);
        Cookies.set('user', JSON.stringify(user));
        Cookies.set('loggedInUserId', user?.userId);
        Cookies.set('feScopes', JSON.stringify(feScopes));
        Cookies.set('authenticatedUserRoleId', roleId);
        Cookies.set('permissionEntities', JSON.stringify(permissionEntities));
        Cookies.set('isAuthenticated', 'true');
        set({
          feScopes,
          authenticatedUserRoleId: roleId,
          loggedInUserId: user?.userId,
          isAuthenticated: true,
          token: accessToken,
          user,
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.log('Error in getting OTP:', error);
      return false;
    }
  },

  logout: async () => {
    try {
      Cookies.remove('token');
      Cookies.remove('user');
      Cookies.remove('loggedInUserId');
      Cookies.remove('feScopes');
      Cookies.remove('isAuthenticated');
      Cookies.remove('authenticatedUserRoleId');
      Cookies.remove('permissionEntities');
      set({ ...initialAuthObj });
    } catch (error: any) {
      console.log('Error in logging out:', error?.message);
    }
  },

  getAuthDetails: () => {
    const getAuthStatus = Cookies.get('isAuthenticated');
    const getFeScopes = Cookies.get('feScopes');
    const authenticatedUserRoleId = Cookies.get('authenticatedUserRoleId');
    const getPermissionEntities = Cookies.get('permissionEntities');
    const isAuthenticated = getAuthStatus === 'true';
    const feScopes = getFeScopes ? JSON.parse(getFeScopes) : [];
    const permissionEntities = getPermissionEntities
      ? JSON.parse(getPermissionEntities)
      : {};
    const user = Cookies.get('user')
      ? JSON.parse(Cookies.get('user')!)
      : undefined;
    const loggedInUserId = Cookies.get('loggedInUserId');

    set(() => ({
      user,
      feScopes,
      authenticatedUserRoleId,
      loggedInUserId,
      permissionEntities,
      isAuthenticated,
    }));
    return isAuthenticated;
  },
}));
