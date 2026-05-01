import type { DevotionalProps } from '@domain/entities';
import type { DevotionalSummary } from '@domain/repositories';
import type { DayKey } from '@domain/value-objects';

export interface BuiltInDevotionalSource {
  findByKey(key: DayKey): DevotionalProps | null;
  has(key: DayKey): boolean;
  list(): readonly DevotionalSummary[];
}
