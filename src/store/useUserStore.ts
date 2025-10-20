import { User } from "@/types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useUserStore = create<User>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      name: null,
      picture: null,
      provider: null,
      nickname: null,
      profileImage: null,

      setUser: (data) => set((state) => ({ ...state, ...data })),
      clearUser: () =>
        set({
          token: null,
          email: null,
          name: null,
          picture: null,
          provider: null,
          nickname: null,
          profileImage: null,
        }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
