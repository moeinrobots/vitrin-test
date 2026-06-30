import { create } from 'zustand';

import { createThemeSlice, type ThemeSlice } from './theme.slice';
import { createUserSlice, type UserSlice } from './user.slice';

export type StoreState = UserSlice & ThemeSlice;

export const useAppStore = create<StoreState>()((...args) => ({
    ...createUserSlice(...args),
    ...createThemeSlice(...args),
}));

export const useStore = useAppStore;

export type { Theme, ResolvedTheme } from './theme.slice';
export type { UserSlice } from './user.slice';
