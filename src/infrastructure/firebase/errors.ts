import { FirebaseError } from 'firebase/app';
import {
  AuthenticationError,
  type DomainError,
  UnauthorizedError,
  UnexpectedError,
  ValidationError,
} from '@domain/errors';

const AUTH_MESSAGES: Record<string, string> = {
  'auth/invalid-email': '電郵地址格式不正確。',
  'auth/user-disabled': '此帳戶已被停用。',
  'auth/user-not-found': '找不到此帳戶。',
  'auth/wrong-password': '密碼不正確。',
  'auth/invalid-credential': '帳戶或密碼不正確。',
  'auth/email-already-in-use': '此電郵已被註冊。',
  'auth/weak-password': '密碼強度不足，請至少使用 6 個字元。',
  'auth/popup-closed-by-user': '登入視窗已關閉。',
  'auth/cancelled-popup-request': '登入已取消。',
  'auth/popup-blocked': '瀏覽器封鎖了登入視窗，請允許彈出視窗。',
  'auth/network-request-failed': '網絡連線失敗，請稍後再試。',
};

export const mapFirebaseAuthError = (error: unknown): DomainError => {
  if (error instanceof FirebaseError) {
    const message = AUTH_MESSAGES[error.code] ?? '登入時發生錯誤，請再試一次。';
    return new AuthenticationError(message, { cause: error });
  }
  if (error instanceof Error) {
    return new AuthenticationError(error.message, { cause: error });
  }
  return new AuthenticationError('登入時發生未知錯誤。');
};

export const mapFirestoreError = (error: unknown): DomainError => {
  if (error instanceof FirebaseError) {
    if (error.code === 'permission-denied') {
      return new UnauthorizedError('沒有權限執行此操作。', { cause: error });
    }
    if (error.code === 'invalid-argument') {
      return new ValidationError(error.message, { cause: error });
    }
    return new UnexpectedError(error.message, { cause: error });
  }
  if (error instanceof Error) {
    return new UnexpectedError(error.message, { cause: error });
  }
  return new UnexpectedError('未知錯誤。');
};
