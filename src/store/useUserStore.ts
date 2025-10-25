import { UserStore } from "@/types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      email: null,
      name: null,
      picture: null,
      provider: null,
      nickname: null,
      profileImage: null,

      setUser: (data) =>
        set(() => ({
          email: data.email ?? null,
          name: data.name ?? null,
          picture: data.picture ?? null,
          provider: data.provider ?? null,
          nickname: data.nickname ?? null,
          profileImage: data.profileImage ?? null,
        })),
      clearUser: () =>
        set({
          email: null,
          name: null,
          picture: null,
          provider: null,
          nickname: null,
          profileImage: null,
        }),
    }),
    {
      name: "mingle-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
