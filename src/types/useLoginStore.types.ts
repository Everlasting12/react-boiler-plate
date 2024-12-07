import { User } from './user.types';

export interface UsernamePasswordPayload {
  username: string;
  password: string;
}

export interface LoginType {
  user: Partial<User>;
  feScopes: string[];
  loggedInUserId: string;
  authenticatedUserRoleId: string;
  loaderState: boolean;
  isAuthenticated: boolean;
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
  loginWithEmail: (payload: UsernamePasswordPayload) => void;
  getUserDetails: (userid: string) => void;
  getAuthDetails: () => boolean;
}
