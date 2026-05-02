import type { DevotionalProps } from '@domain/entities';
import type { DevotionalSummary } from '@domain/repositories';
import { DayKey } from '@domain/value-objects';
import { formatChineseDate, formatEnglishDate, pad2 } from '@shared/date';
import type { DevotionalDTO, DevotionalSource, DevotionalSummaryDTO } from '@application/dto';

export const toDevotionalDTO = (
  entry: DevotionalProps,
  source: DevotionalSource = 'firestore',
): DevotionalDTO => ({
  key: entry.key,
  month: DayKey.monthOf(entry.key),
  day: DayKey.dayOf(entry.key),
  dateLabel: entry.dateLabel,
  dateEn: entry.dateEn,
  title: entry.title,
  verseRef: entry.verseRef,
  verseTrans: entry.verseTrans,
  verse: entry.verse,
  body: entry.body,
  reflection: entry.reflection,
  updatedAt: entry.updatedAt.toISOString(),
  source,
});

export const toSummaryDTO = (summary: DevotionalSummary): DevotionalSummaryDTO => ({
  key: summary.key,
  month: DayKey.monthOf(summary.key),
  day: DayKey.dayOf(summary.key),
  title: summary.title,
  verseRef: summary.verseRef,
  updatedAt: summary.updatedAt.toISOString(),
});

// Stable placeholder shown for days with no Firestore or built-in entry.
// Coerces an out-of-range month to a valid one so the result type can stay
// narrow; the caller should usually have validated via DayKey first.
export const buildPlaceholderDTO = (month: number, day: number): DevotionalDTO => {
  const m = Math.max(1, Math.min(12, month));
  return {
    key: `${pad2(m)}-${pad2(day)}`,
    month: m,
    day,
    dateLabel: formatChineseDate(m, day),
    dateEn: formatEnglishDate(m, day),
    title: '為這一日感恩',
    verseRef: '詩篇 118:24',
    verseTrans: '新譯本',
    verse: '這是耶和華所定的日子，我們要在這一日歡喜快樂。',
    body: [
      '每一日都是上帝精心預備的禮物。在你的生日這天，祂特別將這段話留給你——不是因為你做了什麼，而是因為祂愛你。',
      '今天，把這一日交還給祂。讓祂引導你的腳步，讓祂的話語成為你心中的指南。',
      '你不需要走得很快，只需要走得正確。一日有一日的恩典，一日有一日的話語。',
    ],
    reflection: '這一日，你想對上帝說什麼？',
    updatedAt: new Date(0).toISOString(),
    source: 'placeholder',
  };
};
