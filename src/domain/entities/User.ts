import type { Branded } from '@shared/types';

export type UserId = Branded<string, 'UserId'>;

export type UserRole = 'admin' | 'reader';

export interface AuthenticatedUser {
  readonly id: UserId;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly role: UserRole;
}

export const isAdmin = (user: AuthenticatedUser | null): boolean => user?.role === 'admin';
