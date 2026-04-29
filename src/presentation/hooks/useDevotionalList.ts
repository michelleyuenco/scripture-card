import { useCallback, useEffect, useState } from 'react';
import type { DevotionalSummaryDTO } from '@application/dto';
import { useContainer } from './useContainer';

interface ListSnapshot {
  readonly tick: number;
  readonly items: DevotionalSummaryDTO[];
  readonly error: string | null;
}

interface ListState {
  readonly items: DevotionalSummaryDTO[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly refresh: () => void;
}

export const useDevotionalList = (): ListState => {
  const container = useContainer();
  const [tick, setTick] = useState(0);
  const [snapshot, setSnapshot] = useState<ListSnapshot | null>(null);

  useEffect(() => {
    let cancelled = false;
    container.useCases.listDevotionals.execute().then(
      (result) => {
        if (cancelled) return;
        if (result.ok) {
          setSnapshot({ tick, items: result.value, error: null });
        } else {
          setSnapshot({ tick, items: [], error: result.error.message });
        }
      },
      (error: unknown) => {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : '未知錯誤';
        setSnapshot({ tick, items: [], error: message });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [container, tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  if (!snapshot || snapshot.tick !== tick) {
    return { items: snapshot?.items ?? [], loading: true, error: null, refresh };
  }
  return { items: snapshot.items, loading: false, error: snapshot.error, refresh };
};
