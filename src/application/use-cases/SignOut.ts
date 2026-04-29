import type { Result } from '@shared/result';
import type { DomainError } from '@domain/errors';
import type { AuthService } from '@application/ports';
import type { UseCase } from './UseCase';

export class SignOut implements UseCase<void, void> {
  private readonly auth: AuthService;

  constructor(auth: AuthService) {
    this.auth = auth;
  }

  async execute(): Promise<Result<void, DomainError>> {
    return this.auth.signOut();
  }
}
