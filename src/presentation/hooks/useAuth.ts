import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from '@presentation/providers/AuthContext';

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
};
