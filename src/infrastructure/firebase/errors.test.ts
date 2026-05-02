import { describe, expect, it } from 'vitest';
import { FirebaseError } from 'firebase/app';
import {
  AuthenticationError,
  UnauthorizedError,
  UnexpectedError,
  ValidationError,
} from '@domain/errors';
import { mapFirebaseAuthError, mapFirestoreError } from './errors';

describe('mapFirebaseAuthError', () => {
  it('maps a known auth code to an AuthenticationError with a friendly message', () => {
    const original = new FirebaseError('auth/invalid-credential', 'invalid');
    const mapped = mapFirebaseAuthError(original);
    expect(mapped).toBeInstanceOf(AuthenticationError);
    expect(mapped.message).toBe('帳戶或密碼不正確。');
    expect(mapped.cause).toBe(original);
  });

  it('falls back to a generic message for unknown auth codes', () => {
    const original = new FirebaseError('auth/something-new', 'whatever');
    const mapped = mapFirebaseAuthError(original);
    expect(mapped).toBeInstanceOf(AuthenticationError);
    expect(mapped.message).toBe('登入時發生錯誤，請再試一次。');
  });

  it('wraps a non-Firebase Error using its own message', () => {
    const original = new Error('boom');
    const mapped = mapFirebaseAuthError(original);
    expect(mapped).toBeInstanceOf(AuthenticationError);
    expect(mapped.message).toBe('boom');
    expect(mapped.cause).toBe(original);
  });

  it('handles non-Error values with the default message', () => {
    const mapped = mapFirebaseAuthError('something weird');
    expect(mapped).toBeInstanceOf(AuthenticationError);
    expect(mapped.message).toBe('登入時發生未知錯誤。');
  });
});

describe('mapFirestoreError', () => {
  it('maps permission-denied to UnauthorizedError', () => {
    const original = new FirebaseError('permission-denied', 'denied');
    const mapped = mapFirestoreError(original);
    expect(mapped).toBeInstanceOf(UnauthorizedError);
    expect(mapped.cause).toBe(original);
  });

  it('maps invalid-argument to ValidationError', () => {
    const original = new FirebaseError('invalid-argument', 'bad input');
    const mapped = mapFirestoreError(original);
    expect(mapped).toBeInstanceOf(ValidationError);
    expect(mapped.message).toBe('bad input');
  });

  it('maps other Firebase errors to UnexpectedError', () => {
    const original = new FirebaseError('unavailable', 'service down');
    const mapped = mapFirestoreError(original);
    expect(mapped).toBeInstanceOf(UnexpectedError);
    expect(mapped.message).toBe('service down');
  });

  it('wraps a non-Firebase Error as UnexpectedError', () => {
    const original = new Error('disk full');
    const mapped = mapFirestoreError(original);
    expect(mapped).toBeInstanceOf(UnexpectedError);
    expect(mapped.message).toBe('disk full');
    expect(mapped.cause).toBe(original);
  });

  it('handles non-Error values with the default message', () => {
    const mapped = mapFirestoreError(42);
    expect(mapped).toBeInstanceOf(UnexpectedError);
    expect(mapped.message).toBe('未知錯誤。');
  });
});
