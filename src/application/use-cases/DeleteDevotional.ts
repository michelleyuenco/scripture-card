import type { Result } from '@shared/result';
import { andThenAsync } from '@shared/result';
import type { DomainError } from '@domain/errors';
import { DayKey } from '@domain/value-objects';
import type { DevotionalRepository } from '@domain/repositories';
import type { UseCase } from './UseCase';

export interface DeleteDevotionalInput {
  readonly month: number;
  readonly day: number;
}

export class DeleteDevotional implements UseCase<DeleteDevotionalInput, void> {
  private readonly repo: DevotionalRepository;

  constructor(repo: DevotionalRepository) {
    this.repo = repo;
  }

  async execute(input: DeleteDevotionalInput): Promise<Result<void, DomainError>> {
    return andThenAsync(DayKey.create(input.month, input.day), (key) => this.repo.delete(key));
  }
}
