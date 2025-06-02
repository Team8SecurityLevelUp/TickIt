import type { User } from './User';

export type AuthContextType = {
  user: User | null;
  loading: boolean;
};
