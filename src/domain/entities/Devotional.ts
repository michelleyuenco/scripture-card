import type { Result } from '@shared/result';
import { err, ok } from '@shared/result';
import { ValidationError } from '@domain/errors';
import type { DayKey } from '@domain/value-objects';

export interface DevotionalProps {
  readonly key: DayKey;
  readonly dateLabel: string;
  readonly dateEn: string;
  readonly title: string;
  readonly verseRef: string;
  readonly verseTrans: string;
  readonly verse: string;
  readonly body: readonly string[];
  readonly reflection: string;
  readonly updatedAt: Date;
}

const trim = (s: string) => s.trim();

export const Devotional = {
  create(input: {
    key: DayKey;
    dateLabel: string;
    dateEn: string;
    title: string;
    verseRef: string;
    verseTrans: string;
    verse: string;
    body: readonly string[];
    reflection: string;
    updatedAt?: Date;
  }): Result<DevotionalProps, ValidationError> {
    const required: Array<[string, string]> = [
      ['dateLabel', input.dateLabel],
      ['dateEn', input.dateEn],
      ['title', input.title],
      ['verseRef', input.verseRef],
      ['verse', input.verse],
    ];
    for (const [field, value] of required) {
      if (typeof value !== 'string' || trim(value).length === 0) {
        return err(new ValidationError(`Field "${field}" is required`));
      }
    }
    const body = input.body.map(trim).filter((p) => p.length > 0);
    if (body.length === 0) {
      return err(new ValidationError('Devotional body must contain at least one paragraph'));
    }
    return ok({
      key: input.key,
      dateLabel: trim(input.dateLabel),
      dateEn: trim(input.dateEn),
      title: trim(input.title),
      verseRef: trim(input.verseRef),
      verseTrans: trim(input.verseTrans),
      verse: trim(input.verse),
      body,
      reflection: trim(input.reflection),
      updatedAt: input.updatedAt ?? new Date(),
    });
  },
};

export type Devotional = DevotionalProps;
