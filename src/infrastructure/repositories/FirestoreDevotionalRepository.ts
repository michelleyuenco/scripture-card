import {
  type Firestore,
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import type { Result } from '@shared/result';
import { err, ok } from '@shared/result';
import type { DomainError } from '@domain/errors';
import type { DevotionalProps } from '@domain/entities';
import type { DayKey } from '@domain/value-objects';
import type { DevotionalRepository, DevotionalSummary } from '@domain/repositories';
import { mapFirestoreError } from '@infrastructure/firebase/errors';

const COLLECTION = 'devotionals';

interface DevotionalDoc {
  readonly dateLabel: string;
  readonly dateEn: string;
  readonly title: string;
  readonly verseRef: string;
  readonly verseTrans: string;
  readonly verse: string;
  readonly body: string[];
  readonly reflection: string;
  readonly updatedAt: Timestamp;
}

const toEntity = (key: DayKey, raw: DevotionalDoc): DevotionalProps => ({
  key,
  dateLabel: raw.dateLabel,
  dateEn: raw.dateEn,
  title: raw.title,
  verseRef: raw.verseRef,
  verseTrans: raw.verseTrans ?? '',
  verse: raw.verse,
  body: raw.body,
  reflection: raw.reflection ?? '',
  updatedAt: raw.updatedAt.toDate(),
});

const toDoc = (entry: DevotionalProps): DevotionalDoc => ({
  dateLabel: entry.dateLabel,
  dateEn: entry.dateEn,
  title: entry.title,
  verseRef: entry.verseRef,
  verseTrans: entry.verseTrans,
  verse: entry.verse,
  body: [...entry.body],
  reflection: entry.reflection,
  updatedAt: Timestamp.fromDate(entry.updatedAt),
});

export class FirestoreDevotionalRepository implements DevotionalRepository {
  private readonly db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async findByKey(key: DayKey): Promise<Result<DevotionalProps | null, DomainError>> {
    try {
      const ref = doc(this.db, COLLECTION, key);
      const snap = await getDoc(ref);
      if (!snap.exists()) return ok(null);
      return ok(toEntity(key, snap.data() as DevotionalDoc));
    } catch (error) {
      return err(mapFirestoreError(error));
    }
  }

  async list(): Promise<Result<DevotionalSummary[], DomainError>> {
    try {
      const ref = collection(this.db, COLLECTION);
      const snap = await getDocs(query(ref, orderBy('__name__')));
      const items: DevotionalSummary[] = snap.docs.map((d) => {
        const data = d.data() as DevotionalDoc;
        return {
          key: d.id as DayKey,
          title: data.title,
          verseRef: data.verseRef,
          updatedAt: data.updatedAt.toDate(),
        };
      });
      return ok(items);
    } catch (error) {
      return err(mapFirestoreError(error));
    }
  }

  async save(entry: DevotionalProps): Promise<Result<DevotionalProps, DomainError>> {
    try {
      const ref = doc(this.db, COLLECTION, entry.key);
      const next: DevotionalProps = { ...entry, updatedAt: new Date() };
      await setDoc(ref, toDoc(next));
      return ok(next);
    } catch (error) {
      return err(mapFirestoreError(error));
    }
  }

  async delete(key: DayKey): Promise<Result<void, DomainError>> {
    try {
      await deleteDoc(doc(this.db, COLLECTION, key));
      return ok(undefined);
    } catch (error) {
      return err(mapFirestoreError(error));
    }
  }
}
