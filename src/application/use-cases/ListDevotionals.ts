import type { Result } from '@shared/result';
import { map } from '@shared/result';
import type { DomainError } from '@domain/errors';
import type { DevotionalRepository, DevotionalSummary } from '@domain/repositories';
import type { DevotionalSummaryDTO } from '@application/dto';
import { toSummaryDTO } from '@application/mappers/devotionalMapper';
import type { UseCase } from './UseCase';

export class ListDevotionals implements UseCase<void, DevotionalSummaryDTO[]> {
  private readonly repo: DevotionalRepository;

  constructor(repo: DevotionalRepository) {
    this.repo = repo;
  }

  async execute(): Promise<Result<DevotionalSummaryDTO[], DomainError>> {
    const result = await this.repo.list();
    return map(result, (items: DevotionalSummary[]) => items.map(toSummaryDTO));
  }
}
