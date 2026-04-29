import type { Result } from '@shared/result';
import type { DomainError } from '@domain/errors';
import type { AuthenticatedUser } from '@domain/entities';
import type { EmailCredentialsDTO } from '@application/dto';

export type AuthSubscriber = (user: AuthenticatedUser | null) => void;
export type Unsubscribe = () => void;

export interface AuthService {
  signInWithGoogle(): Promise<Result<AuthenticatedUser, DomainError>>;
  signInWithEmail(
    credentials: EmailCredentialsDTO,
  ): Promise<Result<AuthenticatedUser, DomainError>>;
  signUpWithEmail(
    credentials: EmailCredentialsDTO,
  ): Promise<Result<AuthenticatedUser, DomainError>>;
  signOut(): Promise<Result<void, DomainError>>;
  subscribe(callback: AuthSubscriber): Unsubscribe;
}
