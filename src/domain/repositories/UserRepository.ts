import type { Result } from '@shared/result';
import type { AuthenticatedUser, UserId } from '@domain/entities';
import type { DomainError } from '@domain/errors';

export interface UserProfileInput {
  readonly id: UserId;
  readonly email: string | null;
  readonly displayName: string | null;
}

export interface UserRepository {
  findById(id: UserId): Promise<Result<AuthenticatedUser | null, DomainError>>;
  ensureProfile(input: UserProfileInput): Promise<Result<AuthenticatedUser, DomainError>>;
}
