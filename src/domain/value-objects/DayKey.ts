import type { Branded } from '@shared/types';
import type { Result } from '@shared/result';
import { err, ok } from '@shared/result';
import { ValidationError } from '@domain/errors';

export type DayKey = Branded<string, 'DayKey'>;

const MAX_DAYS_PER_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export const DayKey = {
  create(month: number, day: number): Result<DayKey, ValidationError> {
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      return err(new ValidationError(`Invalid month: ${String(month)}`));
    }
    const max = MAX_DAYS_PER_MONTH[month - 1] ?? 31;
    if (!Number.isInteger(day) || day < 1 || day > max) {
      return err(new ValidationError(`Invalid day for month ${String(month)}: ${String(day)}`));
    }
    return ok(`${pad(month)}-${pad(day)}` as DayKey);
  },

  parse(raw: string): Result<DayKey, ValidationError> {
    const match = /^(\d{2})-(\d{2})$/.exec(raw);
    if (!match) return err(new ValidationError(`Invalid day key format: ${raw}`));
    const month = Number(match[1]);
    const day = Number(match[2]);
    return DayKey.create(month, day);
  },

  monthOf(key: DayKey): number {
    return Number(key.slice(0, 2));
  },

  dayOf(key: DayKey): number {
    return Number(key.slice(3, 5));
  },

  allKeys(): DayKey[] {
    const keys: DayKey[] = [];
    for (let m = 1; m <= 12; m += 1) {
      const max = MAX_DAYS_PER_MONTH[m - 1] ?? 31;
      for (let d = 1; d <= max; d += 1) {
        keys.push(`${pad(m)}-${pad(d)}` as DayKey);
      }
    }
    return keys;
  },
};
