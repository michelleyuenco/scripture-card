export interface DevotionalDTO {
  readonly key: string;
  readonly month: number;
  readonly day: number;
  readonly dateLabel: string;
  readonly dateEn: string;
  readonly title: string;
  readonly verseRef: string;
  readonly verseTrans: string;
  readonly verse: string;
  readonly body: readonly string[];
  readonly reflection: string;
  readonly updatedAt: string;
  readonly isPlaceholder: boolean;
}

export interface DevotionalSummaryDTO {
  readonly key: string;
  readonly month: number;
  readonly day: number;
  readonly title: string;
  readonly verseRef: string;
  readonly updatedAt: string;
}

export interface DevotionalInputDTO {
  readonly month: number;
  readonly day: number;
  readonly dateLabel: string;
  readonly dateEn: string;
  readonly title: string;
  readonly verseRef: string;
  readonly verseTrans: string;
  readonly verse: string;
  readonly body: readonly string[];
  readonly reflection: string;
}
