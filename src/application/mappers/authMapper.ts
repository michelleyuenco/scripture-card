import type { AuthenticatedUser } from '@domain/entities';
import type { AuthUserDTO } from '@application/dto';

export const toAuthUserDTO = (user: AuthenticatedUser): AuthUserDTO => ({
  id: user.id,
  email: user.email,
  displayName: user.displayName,
  role: user.role,
  isAdmin: user.role === 'admin',
});
