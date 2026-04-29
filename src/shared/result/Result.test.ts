import { describe, expect, it } from 'vitest';
import { err, isErr, isOk, ok, type Result } from './Result';

describe('Result', () => {
  it('narrows to Ok via isOk', () => {
    const result: Result<number, string> = ok(42);
    if (isOk(result)) {
      expect(result.value).toBe(42);
    } else {
      throw new Error('expected Ok');
    }
  });

  it('narrows to Err via isErr', () => {
    const result: Result<number, string> = err('boom');
    if (isErr(result)) {
      expect(result.error).toBe('boom');
    } else {
      throw new Error('expected Err');
    }
  });
});
