import { useEffect, useRef } from 'react';

export interface DrumPickerProps<T extends number | string> {
  readonly items: readonly T[];
  readonly value: T;
  readonly onChange: (next: T) => void;
  readonly width?: number;
  readonly itemHeight?: number;
  readonly formatter?: (item: T) => string;
  readonly ariaLabel?: string;
}

export const DrumPicker = <T extends number | string>({
  items,
  value,
  onChange,
  width = 88,
  itemHeight = 48,
  formatter,
  ariaLabel,
}: DrumPickerProps<T>) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const idx = items.indexOf(value);
    if (idx >= 0 && Math.round(node.scrollTop / itemHeight) !== idx) {
      node.scrollTop = idx * itemHeight;
    }
  }, [value, items, itemHeight]);

  const handleScroll = () => {
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      const node = ref.current;
      if (!node) return;
      const idx = Math.round(node.scrollTop / itemHeight);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      const target = items[clamped];
      if (target !== undefined) {
        node.scrollTo({ top: clamped * itemHeight, behavior: 'smooth' });
        if (target !== value) onChange(target);
      }
    }, 90);
  };

  const containerHeight = itemHeight * 5;

  return (
    <div
      role="listbox"
      aria-label={ariaLabel}
      style={{
        position: 'relative',
        width,
        height: containerHeight,
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Center band */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: itemHeight * 2,
          height: itemHeight,
          pointerEvents: 'none',
          borderTop: '1px solid var(--rule)',
          borderBottom: '1px solid var(--rule)',
          zIndex: 2,
        }}
      />
      {/* Top + bottom fades */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 3,
          background:
            'linear-gradient(to bottom, var(--paper-2) 0%, rgba(245,241,234,0) 28%, rgba(245,241,234,0) 72%, var(--paper-2) 100%)',
        }}
      />
      <div
        ref={ref}
        onScroll={handleScroll}
        style={{
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          paddingTop: itemHeight * 2,
          paddingBottom: itemHeight * 2,
        }}
      >
        {items.map((item) => {
          const active = item === value;
          return (
            <button
              type="button"
              key={String(item)}
              onClick={() => onChange(item)}
              style={{
                background: 'transparent',
                border: 'none',
                width: '100%',
                height: itemHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                scrollSnapAlign: 'center',
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: active ? 30 : 24,
                fontWeight: active ? 500 : 400,
                color: active ? 'var(--ink)' : 'var(--ink-mute)',
                letterSpacing: '0.02em',
                transition: 'color 200ms, font-size 200ms',
              }}
            >
              {formatter ? formatter(item) : String(item)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
