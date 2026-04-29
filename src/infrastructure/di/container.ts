import type { Firestore } from 'firebase/firestore';
import type { AuthService } from '@application/ports';
import {
  DeleteDevotional,
  GetDevotional,
  ListDevotionals,
  SaveDevotional,
  SignInWithEmail,
  SignInWithGoogle,
  SignOut,
  SignUpWithEmail,
} from '@application/use-cases';
import { firebaseAuth, firestore } from '@infrastructure/firebase';
import {
  FirestoreDevotionalRepository,
  FirestoreUserRepository,
} from '@infrastructure/repositories';
import { FirebaseAuthService } from '@infrastructure/auth';

export interface UseCases {
  readonly getDevotional: GetDevotional;
  readonly listDevotionals: ListDevotionals;
  readonly saveDevotional: SaveDevotional;
  readonly deleteDevotional: DeleteDevotional;
  readonly signInWithGoogle: SignInWithGoogle;
  readonly signInWithEmail: SignInWithEmail;
  readonly signUpWithEmail: SignUpWithEmail;
  readonly signOut: SignOut;
}

export interface Container {
  readonly firestore: Firestore;
  readonly authService: AuthService;
  readonly useCases: UseCases;
}

export const buildContainer = (): Container => {
  const devotionalRepo = new FirestoreDevotionalRepository(firestore);
  const userRepo = new FirestoreUserRepository(firestore);
  const authService: AuthService = new FirebaseAuthService(firebaseAuth, userRepo);

  const useCases: UseCases = {
    getDevotional: new GetDevotional(devotionalRepo),
    listDevotionals: new ListDevotionals(devotionalRepo),
    saveDevotional: new SaveDevotional(devotionalRepo),
    deleteDevotional: new DeleteDevotional(devotionalRepo),
    signInWithGoogle: new SignInWithGoogle(authService),
    signInWithEmail: new SignInWithEmail(authService),
    signUpWithEmail: new SignUpWithEmail(authService),
    signOut: new SignOut(authService),
  };

  return { firestore, authService, useCases };
};
