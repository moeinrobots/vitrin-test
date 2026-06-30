import { create } from 'zustand';

import { createCartSlice, type CartSlice } from './cart.slice';
import { createUserSlice, type UserSlice } from './user.slice';

export type StoreState = UserSlice & CartSlice;

export const useAppStore = create<StoreState>()((...args) => ({
    ...createUserSlice(...args),
    ...createCartSlice(...args),
}));

export const useStore = useAppStore;

export type { CartSlice, CartSyncStatus } from './cart.slice';
export type { UserSlice } from './user.slice';
