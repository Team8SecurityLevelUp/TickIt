export interface User {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  two_factor_authentication_secret?: string | null;
}

export interface UserVerification {
  id: number;
  user_id: number;
  token: string;
  expiration_date: Date;
  is_used: boolean;
}

export interface SafeUser {
  id: number;
  email: string;
  username: string;
}