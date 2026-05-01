import type { Firestore } from 'firebase/firestore';
import type { AuthService } from '@application/ports';
import {
  CheckForUpdate,
  DeleteDevotional,
  GetDevotional,
  ListDevotionals,
  SaveDevotional,
  SignInWithEmail,
  SignInWithGoogle,
  SignOut,
  SignUpWithEmail,
  SubmitClaim,
} from '@application/use-cases';
import { firebaseAuth, firestore } from '@infrastructure/firebase';
import {
  FirestoreClaimRepository,
  FirestoreDevotionalRepository,
  FirestoreUserRepository,
} from '@infrastructure/repositories';
import { FirebaseAuthService } from '@infrastructure/auth';
import { InMemoryBuiltInDevotionalSource } from '@infrastructure/data/builtInDevotionals';
import { HttpVersionSource } from '@infrastructure/version/HttpVersionSource';

export interface UseCases {
  readonly getDevotional: GetDevotional;
  readonly listDevotionals: ListDevotionals;
  readonly saveDevotional: SaveDevotional;
  readonly deleteDevotional: DeleteDevotional;
  readonly signInWithGoogle: SignInWithGoogle;
  readonly signInWithEmail: SignInWithEmail;
  readonly signUpWithEmail: SignUpWithEmail;
  readonly signOut: SignOut;
  readonly submitClaim: SubmitClaim;
  readonly checkForUpdate: CheckForUpdate;
}

export interface Container {
  readonly firestore: Firestore;
  readonly authService: AuthService;
  readonly useCases: UseCases;
}

export const buildContainer = (): Container => {
  const devotionalRepo = new FirestoreDevotionalRepository(firestore);
  const userRepo = new FirestoreUserRepository(firestore);
  const claimRepo = new FirestoreClaimRepository(firestore);
  const authService: AuthService = new FirebaseAuthService(firebaseAuth, userRepo);
  const builtInDevotionals = new InMemoryBuiltInDevotionalSource();
  const versionSource = new HttpVersionSource();

  const useCases: UseCases = {
    getDevotional: new GetDevotional(devotionalRepo, builtInDevotionals),
    listDevotionals: new ListDevotionals(devotionalRepo),
    saveDevotional: new SaveDevotional(devotionalRepo),
    deleteDevotional: new DeleteDevotional(devotionalRepo),
    signInWithGoogle: new SignInWithGoogle(authService),
    signInWithEmail: new SignInWithEmail(authService),
    signUpWithEmail: new SignUpWithEmail(authService),
    signOut: new SignOut(authService),
    submitClaim: new SubmitClaim(claimRepo),
    checkForUpdate: new CheckForUpdate(versionSource, __APP_VERSION__),
  };

  return { firestore, authService, useCases };
};
