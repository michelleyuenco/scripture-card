import type { Result } from '@shared/result';
import { map } from '@shared/result';
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
    return map(result, toAuthUserDTO);
  }
}

export class SignUpWithEmail implements UseCase<EmailCredentialsDTO, AuthUserDTO> {
  private readonly auth: AuthService;

  constructor(auth: AuthService) {
    this.auth = auth;
  }

  async execute(input: EmailCredentialsDTO): Promise<Result<AuthUserDTO, DomainError>> {
    const result = await this.auth.signUpWithEmail(input);
    return map(result, toAuthUserDTO);
  }
}
