import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '@shared/result';
import { DayKey } from '@domain/value-objects';
import { Devotional } from './Devotional';

const validKey = (() => {
  const result = DayKey.create(8, 7);
  if (!isOk(result)) throw new Error('precondition: DayKey.create failed');
  return result.value;
})();

const baseInput = {
  key: validKey,
  dateLabel: '八月七日',
  dateEn: 'August 7',
  title: '祝福那反對你的人',
  verseRef: '使徒行傳 2:44–45',
  verseTrans: '新譯本',
  verse: '所有信的人都聚在一處，凡物公用。',
  body: ['第一段。', '第二段。'],
  reflection: '今天你想對誰說一句祝福？',
};

describe('Devotional.create', () => {
  it('returns a frozen-shape entity from a valid input', () => {
    const result = Devotional.create(baseInput);
    if (!isOk(result)) throw new Error('expected Ok');
    expect(result.value.key).toBe(validKey);
    expect(result.value.title).toBe(baseInput.title);
    expect(result.value.body).toEqual(baseInput.body);
    expect(result.value.updatedAt).toBeInstanceOf(Date);
  });

  it('uses the supplied updatedAt when provided', () => {
    const fixed = new Date('2026-05-02T00:00:00Z');
    const result = Devotional.create({ ...baseInput, updatedAt: fixed });
    expect(isOk(result) && result.value.updatedAt).toEqual(fixed);
  });

  it.each(['dateLabel', 'dateEn', 'title', 'verseRef', 'verse'] as const)(
    'rejects empty %s',
    (field) => {
      const input = { ...baseInput, [field]: '   ' };
      expect(isErr(Devotional.create(input))).toBe(true);
    },
  );

  it('rejects an empty body array', () => {
    expect(isErr(Devotional.create({ ...baseInput, body: [] }))).toBe(true);
  });

  it('rejects a body containing only whitespace paragraphs', () => {
    expect(isErr(Devotional.create({ ...baseInput, body: ['   ', '\t'] }))).toBe(true);
  });

  it('trims surrounding whitespace from each field', () => {
    const result = Devotional.create({
      ...baseInput,
      title: '  祝福那反對你的人  ',
      verseRef: '  使徒行傳 2:44–45  ',
    });
    if (!isOk(result)) throw new Error('expected Ok');
    expect(result.value.title).toBe('祝福那反對你的人');
    expect(result.value.verseRef).toBe('使徒行傳 2:44–45');
  });

  it('filters out empty body paragraphs and trims the rest', () => {
    const result = Devotional.create({
      ...baseInput,
      body: ['  第一段。  ', '', '  ', '第二段。'],
    });
    if (!isOk(result)) throw new Error('expected Ok');
    expect(result.value.body).toEqual(['第一段。', '第二段。']);
  });

  it('allows an empty reflection (it is optional content)', () => {
    const result = Devotional.create({ ...baseInput, reflection: '' });
    expect(isOk(result) && result.value.reflection).toBe('');
  });
});
