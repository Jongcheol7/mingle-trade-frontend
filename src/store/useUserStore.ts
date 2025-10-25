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
        set((state) => ({
          ...state,
          //넘어온 값이 있을 때만 덮어쓰기 (undefined면 기존값 유지)
          email: data.email ?? state.email,
          name: data.name ?? state.name,
          picture: data.picture ?? state.picture,
          provider: data.provider ?? state.provider,
          nickname: data.nickname ?? state.nickname,
          profileImage: data.profileImage ?? state.profileImage,
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
