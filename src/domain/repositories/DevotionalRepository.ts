import type { Result } from '@shared/result';
import type { DevotionalProps } from '@domain/entities';
import type { DayKey } from '@domain/value-objects';
import type { DomainError } from '@domain/errors';

export interface DevotionalSummary {
  readonly key: DayKey;
  readonly title: string;
  readonly verseRef: string;
  readonly updatedAt: Date;
}

export interface DevotionalRepository {
  findByKey(key: DayKey): Promise<Result<DevotionalProps | null, DomainError>>;
  list(): Promise<Result<DevotionalSummary[], DomainError>>;
  save(entry: DevotionalProps): Promise<Result<DevotionalProps, DomainError>>;
  delete(key: DayKey): Promise<Result<void, DomainError>>;
}
