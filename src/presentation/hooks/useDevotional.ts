import { useEffect, useState } from 'react';
import type { DevotionalDTO } from '@application/dto';
import { useContainer } from './useContainer';

interface DevotionalSnapshot {
  readonly key: string;
  readonly entry: DevotionalDTO | null;
  readonly error: string | null;
}

interface DevotionalState {
  readonly entry: DevotionalDTO | null;
  readonly loading: boolean;
  readonly error: string | null;
}

const keyOf = (month: number, day: number) => `${String(month)}-${String(day)}`;

export const useDevotional = (month: number, day: number): DevotionalState => {
  const container = useContainer();
  const [snapshot, setSnapshot] = useState<DevotionalSnapshot | null>(null);
  const requestKey = keyOf(month, day);

  useEffect(() => {
    let cancelled = false;
    container.useCases.getDevotional.execute({ month, day }).then(
      (result) => {
        if (cancelled) return;
        if (result.ok) {
          setSnapshot({ key: requestKey, entry: result.value, error: null });
        } else {
          setSnapshot({ key: requestKey, entry: null, error: result.error.message });
        }
      },
      (error: unknown) => {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : '未知錯誤';
        setSnapshot({ key: requestKey, entry: null, error: message });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [container, month, day, requestKey]);

  if (!snapshot || snapshot.key !== requestKey) {
    return { entry: null, loading: true, error: null };
  }
  return { entry: snapshot.entry, loading: false, error: snapshot.error };
};
