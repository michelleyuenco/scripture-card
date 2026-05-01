import type { Result } from '@shared/result';
import { err, isErr, ok } from '@shared/result';
import type { DomainError } from '@domain/errors';
import { ClaimRequest } from '@domain/entities';
import type { ClaimRepository } from '@domain/repositories';
import type { ClaimRequestDTO, ClaimRequestInputDTO } from '@application/dto';

export class SubmitClaim {
  private readonly repo: ClaimRepository;

  constructor(repo: ClaimRepository) {
    this.repo = repo;
  }

  async execute(input: ClaimRequestInputDTO): Promise<Result<ClaimRequestDTO, DomainError>> {
    const entity = ClaimRequest.create({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      month: input.month,
      day: input.day,
    });
    if (isErr(entity)) return err(entity.error);

    const saved = await this.repo.create(entity.value);
    if (isErr(saved)) return err(saved.error);

    return ok({
      name: saved.value.name,
      email: saved.value.email,
      phone: saved.value.phone,
      month: saved.value.month,
      day: saved.value.day,
      createdAt: saved.value.createdAt.toISOString(),
    });
  }
}
