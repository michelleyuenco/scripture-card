import { createContext } from 'react';
import type { AuthenticatedUser } from '@domain/entities';

export interface AuthContextValue {
  readonly user: AuthenticatedUser | null;
  readonly isAdmin: boolean;
  readonly isLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
