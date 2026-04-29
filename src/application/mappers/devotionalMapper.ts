import type { DevotionalProps } from '@domain/entities';
import type { DevotionalSummary } from '@domain/repositories';
import type { DevotionalDTO, DevotionalSummaryDTO } from '@application/dto';
import { DayKey } from '@domain/value-objects';

export const toDevotionalDTO = (entry: DevotionalProps): DevotionalDTO => ({
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
  isPlaceholder: false,
});

export const toSummaryDTO = (summary: DevotionalSummary): DevotionalSummaryDTO => ({
  key: summary.key,
  month: DayKey.monthOf(summary.key),
  day: DayKey.dayOf(summary.key),
  title: summary.title,
  verseRef: summary.verseRef,
  updatedAt: summary.updatedAt.toISOString(),
});

const MONTH_CN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
const MONTH_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const DAY_CN = (n: number): string => {
  const ch = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  if (n <= 10) return ch[n] ?? String(n);
  if (n < 20) return `十${ch[n - 10] ?? ''}`;
  if (n === 20) return '二十';
  if (n < 30) return `二十${ch[n - 20] ?? ''}`;
  if (n === 30) return '三十';
  return `三十${ch[n - 30] ?? ''}`;
};

export const buildPlaceholderDTO = (month: number, day: number): DevotionalDTO => {
  const m = Math.max(1, Math.min(12, month));
  const monthLabel = MONTH_CN[m - 1] ?? String(m);
  const monthEn = MONTH_EN[m - 1] ?? String(m);
  return {
    key: `${m < 10 ? '0' : ''}${m}-${day < 10 ? '0' : ''}${day}`,
    month: m,
    day,
    dateLabel: `${monthLabel}月${DAY_CN(day)}日`,
    dateEn: `${monthEn} ${day}`,
    title: '為這一日感恩',
    verseRef: '詩篇 118:24',
    verseTrans: '新譯本',
    verse: '這是耶和華所定的日子，我們要在這一日歡喜快樂。',
    body: [
      '（此為示範頁面 — 完整 365 日內容將於正式版本載入。）',
      '每一日都是上帝精心預備的禮物。在你的生日這天，祂特別將這段話留給你——不是因為你做了什麼，而是因為祂愛你。',
      '今天，把這一日交還給祂。讓祂引導你的腳步，讓祂的話語成為你心中的指南。',
      '你不需要走得很快，只需要走得正確。一日有一日的恩典，一日有一日的話語。',
    ],
    reflection: '這一日，你想對上帝說什麼？',
    updatedAt: new Date(0).toISOString(),
    isPlaceholder: true,
  };
};
