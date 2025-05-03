import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

export type User = {
  id: string;
  name: string;
  email: string;
  phoneNumber: number;
  address: string;
  role: Role;
  localBody?: string;
  idCard?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

export enum Role {
  Citizen = 'citizen',
  Authority = 'authority',
}

interface UserState {
  user: User | null;
  role: Role | null;
  setUserRole: (role: Role | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

type UserPersist = (
  config: StateCreator<UserState>,
  options: PersistOptions<UserState>
) => StateCreator<UserState>;

export const useUserStore = create<UserState>(
  (persist as UserPersist)(
    (set): UserState => ({
      user: null,
      role: null,
      setUserRole: role => set({ role }),
      setUser: user => set({ user }),
      logout: () => set({ user: null, role: null }),
    }),
    {
      name: 'user-storage', // Unique name for the localStorage key
      // Optional: Specify storage (e.g., sessionStorage)
      // storage: createJSONStorage(() => sessionStorage),
      // Optional: Specify which parts of the state to persist
      // partialize: (state) => ({ user: state.user, role: state.role }), // Persist only user and role
    }
  )
);
