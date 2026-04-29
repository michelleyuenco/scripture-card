export interface AuthUserDTO {
  readonly id: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly role: 'admin' | 'reader';
  readonly isAdmin: boolean;
}

export interface EmailCredentialsDTO {
  readonly email: string;
  readonly password: string;
}
