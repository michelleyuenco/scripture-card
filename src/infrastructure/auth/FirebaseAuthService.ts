import {
  type Auth,
  GoogleAuthProvider,
  type User as FirebaseUser,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import type { Result } from '@shared/result';
import { err, isErr, ok } from '@shared/result';
import { AuthenticationError, type DomainError } from '@domain/errors';
import type { AuthenticatedUser, UserId } from '@domain/entities';
import type { UserRepository } from '@domain/repositories';
import type { AuthService, AuthSubscriber, Unsubscribe } from '@application/ports';
import type { EmailCredentialsDTO } from '@application/dto';
import { mapFirebaseAuthError } from '@infrastructure/firebase/errors';

export class FirebaseAuthService implements AuthService {
  private readonly googleProvider = new GoogleAuthProvider();
  private readonly auth: Auth;
  private readonly users: UserRepository;

  constructor(auth: Auth, users: UserRepository) {
    this.auth = auth;
    this.users = users;
  }

  async signInWithGoogle(): Promise<Result<AuthenticatedUser, DomainError>> {
    try {
      const credential = await signInWithPopup(this.auth, this.googleProvider);
      return this.resolveUser(credential.user);
    } catch (error) {
      return err(mapFirebaseAuthError(error));
    }
  }

  async signInWithEmail(
    credentials: EmailCredentialsDTO,
  ): Promise<Result<AuthenticatedUser, DomainError>> {
    try {
      const credential = await signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password,
      );
      return this.resolveUser(credential.user);
    } catch (error) {
      return err(mapFirebaseAuthError(error));
    }
  }

  async signUpWithEmail(
    credentials: EmailCredentialsDTO,
  ): Promise<Result<AuthenticatedUser, DomainError>> {
    try {
      const credential = await createUserWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password,
      );
      return this.resolveUser(credential.user);
    } catch (error) {
      return err(mapFirebaseAuthError(error));
    }
  }

  async signOut(): Promise<Result<void, DomainError>> {
    try {
      await firebaseSignOut(this.auth);
      return ok(undefined);
    } catch (error) {
      return err(mapFirebaseAuthError(error));
    }
  }

  subscribe(callback: AuthSubscriber): Unsubscribe {
    return onAuthStateChanged(this.auth, (firebaseUser) => {
      if (!firebaseUser) {
        callback(null);
        return;
      }
      void this.resolveUser(firebaseUser).then((result) => {
        callback(result.ok ? result.value : null);
      });
    });
  }

  private async resolveUser(
    firebaseUser: FirebaseUser,
  ): Promise<Result<AuthenticatedUser, DomainError>> {
    const profile = await this.users.ensureProfile({
      id: firebaseUser.uid as UserId,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
    });
    if (isErr(profile)) {
      return err(new AuthenticationError(profile.error.message, { cause: profile.error }));
    }
    return ok(profile.value);
  }
}
