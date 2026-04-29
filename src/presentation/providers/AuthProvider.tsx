import { type ReactNode, useEffect, useMemo, useState } from 'react';
import type { AuthenticatedUser } from '@domain/entities';
import { useContainer } from '@presentation/hooks/useContainer';
import { AuthContext, type AuthContextValue } from './AuthContext';

export interface AuthProviderProps {
  readonly children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const container = useContainer();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');

  useEffect(() => {
    const unsubscribe = container.authService.subscribe((next) => {
      setUser(next);
      setStatus('ready');
    });
    return unsubscribe;
  }, [container.authService]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAdmin: user?.role === 'admin',
      isLoading: status === 'loading',
    }),
    [user, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
