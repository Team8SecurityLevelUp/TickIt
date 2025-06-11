import type React from 'react';
import { useAuth } from './auth/useAuth';

export const PublicOnlyRoute = ({ children }: { children: React.JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) {
    window.location.href = '/';
    return null;
  }
  return children;
};