import { type Firestore, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { Result } from '@shared/result';
import { err, ok } from '@shared/result';
import type { DomainError } from '@domain/errors';
import type { AuthenticatedUser, UserId, UserRole } from '@domain/entities';
import type { UserProfileInput, UserRepository } from '@domain/repositories';
import { mapFirestoreError } from '@infrastructure/firebase/errors';

const COLLECTION = 'users';

interface UserDoc {
  readonly email: string | null;
  readonly displayName: string | null;
  readonly role: UserRole;
}

const isRole = (value: unknown): value is UserRole => value === 'admin' || value === 'reader';

export class FirestoreUserRepository implements UserRepository {
  private readonly db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async findById(id: UserId): Promise<Result<AuthenticatedUser | null, DomainError>> {
    try {
      const snap = await getDoc(doc(this.db, COLLECTION, id));
      if (!snap.exists()) return ok(null);
      const data = snap.data() as UserDoc;
      return ok({
        id,
        email: data.email,
        displayName: data.displayName,
        role: isRole(data.role) ? data.role : 'reader',
      });
    } catch (error) {
      return err(mapFirestoreError(error));
    }
  }

  async ensureProfile(input: UserProfileInput): Promise<Result<AuthenticatedUser, DomainError>> {
    try {
      const ref = doc(this.db, COLLECTION, input.id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as UserDoc;
        return ok({
          id: input.id,
          email: data.email ?? input.email,
          displayName: data.displayName ?? input.displayName,
          role: isRole(data.role) ? data.role : 'reader',
        });
      }
      const initial: UserDoc = {
        email: input.email,
        displayName: input.displayName,
        role: 'reader',
      };
      await setDoc(ref, { ...initial, createdAt: serverTimestamp() });
      return ok({
        id: input.id,
        email: input.email,
        displayName: input.displayName,
        role: 'reader',
      });
    } catch (error) {
      return err(mapFirestoreError(error));
    }
  }
}
