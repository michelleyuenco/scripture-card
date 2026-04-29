import type { Result } from '@shared/result';
import { err, isErr, ok } from '@shared/result';
import type { DomainError } from '@domain/errors';
import type { AuthService } from '@application/ports';
import type { AuthUserDTO, EmailCredentialsDTO } from '@application/dto';
import { toAuthUserDTO } from '@application/mappers/authMapper';
import type { UseCase } from './UseCase';

export class SignInWithEmail implements UseCase<EmailCredentialsDTO, AuthUserDTO> {
  private readonly auth: AuthService;

  constructor(auth: AuthService) {
    this.auth = auth;
  }

  async execute(input: EmailCredentialsDTO): Promise<Result<AuthUserDTO, DomainError>> {
    const result = await this.auth.signInWithEmail(input);
    if (isErr(result)) return err(result.error);
    return ok(toAuthUserDTO(result.value));
  }
}

export class SignUpWithEmail implements UseCase<EmailCredentialsDTO, AuthUserDTO> {
  private readonly auth: AuthService;

  constructor(auth: AuthService) {
    this.auth = auth;
  }

  async execute(input: EmailCredentialsDTO): Promise<Result<AuthUserDTO, DomainError>> {
    const result = await this.auth.signUpWithEmail(input);
    if (isErr(result)) return err(result.error);
    return ok(toAuthUserDTO(result.value));
  }
}
