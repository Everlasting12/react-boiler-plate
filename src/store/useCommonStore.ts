import { create } from 'zustand';
import { CommonStoreType } from '../types/useCommonStoreType.types';

export const useCommonStore = create<CommonStoreType>((set) => ({
  isDarkMode: false,
  setIsDarkMode: (isDarkMode: boolean) => {
    set({ isDarkMode });
  },
}));
