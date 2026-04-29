import type { Result } from '@shared/result';
import { err, isErr, ok } from '@shared/result';
import type { DomainError } from '@domain/errors';
import { DayKey } from '@domain/value-objects';
import type { DevotionalRepository } from '@domain/repositories';
import type { DevotionalDTO } from '@application/dto';
import { buildPlaceholderDTO, toDevotionalDTO } from '@application/mappers/devotionalMapper';
import type { UseCase } from './UseCase';

export interface GetDevotionalInput {
  readonly month: number;
  readonly day: number;
}

export class GetDevotional implements UseCase<GetDevotionalInput, DevotionalDTO> {
  private readonly repo: DevotionalRepository;

  constructor(repo: DevotionalRepository) {
    this.repo = repo;
  }

  async execute(input: GetDevotionalInput): Promise<Result<DevotionalDTO, DomainError>> {
    const keyResult = DayKey.create(input.month, input.day);
    if (isErr(keyResult)) return err(keyResult.error);

    const found = await this.repo.findByKey(keyResult.value);
    if (isErr(found)) return err(found.error);

    if (found.value === null) {
      return ok(buildPlaceholderDTO(input.month, input.day));
    }
    return ok(toDevotionalDTO(found.value));
  }
}
