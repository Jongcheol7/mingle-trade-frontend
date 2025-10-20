export type User = {
  token: string | null;
  email: string | null;
  name: string | null;
  picture: string | null;
  provider: string | null;
  nickname: string | null;
  profileImage: string | null;
  setUser: (data: Partial<User>) => void;
  clearUser: () => void;
};
