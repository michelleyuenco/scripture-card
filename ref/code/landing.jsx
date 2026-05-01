/* global React */
const { useState, useEffect, useRef } = React;

/* ─────────────────────────────────────────────────────────────
   DrumPicker — vertical scrolling wheel for month / day
   ───────────────────────────────────────────────────────────── */
function DrumPicker({ items, value, onChange, width = 88, formatter }) {
  const ref = useRef(null);
  const ITEM_H = 48;
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScroll = useRef(0);
  const settleTimer = useRef(null);

  // Sync external value -> scroll position
  useEffect(() => {
    if (!ref.current) return;
    const idx = items.indexOf(value);
    if (idx >= 0) {
      ref.current.scrollTop = idx * ITEM_H;
    }
  }, [value, items]);

  const handleScroll = () => {
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      if (!ref.current) return;
      const idx = Math.round(ref.current.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      ref.current.scrollTo({ top: clamped * ITEM_H, behavior: "smooth" });
      if (items[clamped] !== value) onChange(items[clamped]);
    }, 90);
  };

  return (
    <div
      style={{
        position: "relative",
        width,
        height: ITEM_H * 5,
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* Center highlight band */}
      <div
        style={{
          position: "absolute",
          left: 0, right: 0,
          top: ITEM_H * 2,
          height: ITEM_H,
          pointerEvents: "none",
          borderTop: "1px solid var(--rule)",
          borderBottom: "1px solid var(--rule)",
          zIndex: 2,
        }}
      />
      {/* Top + bottom fades */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3,
          background:
            "linear-gradient(to bottom, var(--paper) 0%, rgba(245,241,234,0) 28%, rgba(245,241,234,0) 72%, var(--paper) 100%)",
        }}
        className="drum-fade"
      />
      <div
        ref={ref}
        onScroll={handleScroll}
        style={{
          height: "100%",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
          paddingTop: ITEM_H * 2,
          paddingBottom: ITEM_H * 2,
        }}
      >
        {items.map((item) => {
          const active = item === value;
          return (
            <div
              key={item}
              onClick={() => onChange(item)}
              style={{
                height: ITEM_H,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                scrollSnapAlign: "center",
                cursor: "pointer",
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: active ? 30 : 24,
                fontWeight: active ? 500 : 400,
                color: active ? "var(--ink)" : "var(--ink-mute)",
                letterSpacing: "0.02em",
                transition: "color 200ms, font-size 200ms",
              }}
            >
              {formatter ? formatter(item) : item}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LandingView — modern, minimalist, ceremonial
   ───────────────────────────────────────────────────────────── */
function LandingView({ month, day, setMonth, setDay, onOpen }) {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = (m) => new Date(2025, m, 0).getDate();
  const days = Array.from({ length: daysInMonth(month) }, (_, i) => i + 1);

  // Re-clamp day if month changes
  useEffect(() => {
    if (day > daysInMonth(month)) setDay(daysInMonth(month));
  }, [month]); // eslint-disable-line

  const monthCN = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        zIndex: 1,
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        padding: "32px 40px",
      }}
    >
      {/* Top bar */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            aria-hidden
            style={{
              width: 28, height: 28, borderRadius: "50%",
              border: "1px solid var(--gold)",
              display: "grid", placeItems: "center",
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 14, color: "var(--gold)",
            }}
          >365</span>
          <span style={{ fontSize: 14, letterSpacing: "0.32em", color: "var(--ink-3)" }}>
            全年靈修
          </span>
        </div>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-theme"))}
          aria-label="Toggle theme"
          style={{
            background: "transparent",
            border: "1px solid var(--rule)",
            color: "var(--ink-3)",
            borderRadius: 999,
            padding: "8px 16px",
            fontSize: 12,
            letterSpacing: "0.18em",
            fontFamily: "inherit",
          }}
        >
          深 / 淺
        </button>
      </header>

      {/* Center */}
      <main
        style={{
          display: "grid",
          placeItems: "center",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 720, width: "100%" }}>
          <p
            className="serif-en"
            style={{
              fontSize: 13,
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "var(--gold)",
              margin: 0,
            }}
          >
            A Word For Your Day
          </p>

          <h1
            style={{
              fontSize: "clamp(44px, 7vw, 88px)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "0.02em",
              margin: "28px 0 22px",
              color: "var(--ink)",
            }}
          >
            為你而留的<br />
            <span style={{ fontStyle: "italic", color: "var(--gold-deep)" }}>那一日</span>
          </h1>

          <hr className="gold-rule" style={{ margin: "0 auto 28px" }} />

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.9,
              color: "var(--ink-3)",
              maxWidth: 520,
              margin: "0 auto 56px",
            }}
          >
            告訴我們你的生日，我們將為你翻開那一日的<br />
            經文與靈修，將它定格成你的日常。
          </p>

          {/* Drum pickers */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 28px",
              background: "var(--paper-2)",
              border: "1px solid var(--rule)",
              borderRadius: 4,
              boxShadow: "var(--shadow)",
            }}
          >
            <DrumPicker
              items={months}
              value={month}
              onChange={setMonth}
              width={96}
              formatter={(m) => `${monthCN[m - 1]}月`}
            />
            <span style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 22,
              color: "var(--gold)",
              padding: "0 8px",
            }}>·</span>
            <DrumPicker
              items={days}
              value={day}
              onChange={setDay}
              width={80}
              formatter={(d) => String(d)}
            />
          </div>

          <div style={{ marginTop: 44 }}>
            <button
              onClick={onOpen}
              style={{
                background: "var(--ink)",
                color: "var(--paper)",
                border: "none",
                padding: "18px 44px",
                fontSize: 14,
                letterSpacing: "0.36em",
                fontFamily: "inherit",
                borderRadius: 0,
                position: "relative",
                transition: "transform 200ms ease, background 200ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold-deep)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--ink)"; }}
            >
              翻開那一日 &nbsp;→
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 12,
          letterSpacing: "0.22em",
          color: "var(--ink-mute)",
        }}
      >
        <span>VOL · MMXXVI</span>
        <span className="serif-en" style={{ fontStyle: "italic", letterSpacing: "0.08em" }}>
          One day. One word. One year.
        </span>
        <span>365 / 365</span>
      </footer>
    </div>
  );
}

window.DrumPicker = DrumPicker;
window.LandingView = LandingView;
