import { AuthUserEntity } from "@/src/types/auth/authUser.entity";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: AuthUserEntity | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  setUser: (user: AuthUserEntity | null) => void;
  setAuthReady: (ready: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAuthReady: false,
      setUser: (user: AuthUserEntity | null) => set({ user }),
      setAuthReady: (ready: boolean) => set({ isAuthReady: ready }),
      logout: () => {
        set({ user: null, isAuthenticated: false });
        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
