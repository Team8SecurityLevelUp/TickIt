import 'express-session';

declare module 'express-session' {
  interface Session {
    twoFactorSecret?: string;
    loginToken?: string;
  }
}