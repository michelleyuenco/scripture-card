import type { Result } from '@shared/result';
import { map } from '@shared/result';
import type { DomainError } from '@domain/errors';
import type { AuthService } from '@application/ports';
import type { AuthUserDTO } from '@application/dto';
import { toAuthUserDTO } from '@application/mappers/authMapper';
import type { UseCase } from './UseCase';

export class SignInWithGoogle implements UseCase<void, AuthUserDTO> {
  private readonly auth: AuthService;

  constructor(auth: AuthService) {
    this.auth = auth;
  }

  async execute(): Promise<Result<AuthUserDTO, DomainError>> {
    const result = await this.auth.signInWithGoogle();
    return map(result, toAuthUserDTO);
  }
}
