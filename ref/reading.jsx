/* global React */
const { useState: useStateR, useEffect: useEffectR, useMemo } = React;

/* ─────────────────────────────────────────────────────────────
   ReadingView — emulates an open page from the book.
   Centered, generous margins, like a printed devotional.
   ───────────────────────────────────────────────────────────── */
function ReadingView({ entry, onBack, onShare }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        zIndex: 1,
        padding: "28px 40px 80px",
      }}
    >
      {/* Top bar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1100,
          margin: "0 auto 48px",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--ink-3)",
            fontSize: 13,
            letterSpacing: "0.22em",
            fontFamily: "inherit",
            padding: "6px 0",
          }}
        >
          ← &nbsp;另選日期
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            aria-hidden
            style={{
              width: 24, height: 24, borderRadius: "50%",
              border: "1px solid var(--gold)",
              display: "grid", placeItems: "center",
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 11, color: "var(--gold)",
            }}
          >365</span>
          <span style={{ fontSize: 12, letterSpacing: "0.3em", color: "var(--ink-3)" }}>全年靈修</span>
        </div>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-theme"))}
          style={{
            background: "transparent",
            border: "1px solid var(--rule)",
            color: "var(--ink-3)",
            borderRadius: 999,
            padding: "6px 14px",
            fontSize: 11,
            letterSpacing: "0.18em",
            fontFamily: "inherit",
          }}
        >
          深 / 淺
        </button>
      </header>

      {/* Page */}
      <article
        style={{
          maxWidth: 720,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Date tag */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 56 }}>
          <DateTag label={entry.dateLabel} />
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(34px, 4.6vw, 52px)",
            fontWeight: 500,
            lineHeight: 1.25,
            letterSpacing: "0.02em",
            color: "var(--ink)",
            margin: "0 0 36px",
          }}
        >
          {entry.title}
        </h1>

        {/* Verse */}
        <div style={{ position: "relative", padding: "28px 0 32px" }}>
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0, left: "50%", transform: "translateX(-50%)",
              width: 1, height: 22,
              background: "var(--gold)",
            }}
          />
          <p
            style={{
              fontSize: "clamp(17px, 1.4vw, 19px)",
              lineHeight: 2.0,
              color: "var(--ink-2)",
              fontStyle: "normal",
              margin: 0,
              maxWidth: 560,
              marginInline: "auto",
              textWrap: "pretty",
            }}
          >
            『{entry.verse}』
          </p>
          <p
            style={{
              marginTop: 18,
              fontSize: 13,
              letterSpacing: "0.16em",
              color: "var(--gold-deep)",
              fontWeight: 500,
            }}
          >
            {entry.verseRef} <span style={{ color: "var(--ink-mute)", fontWeight: 400 }}>（{entry.verseTrans}）</span>
          </p>
        </div>

        <hr style={{
          width: 40, margin: "12px auto 48px",
          height: 1, border: 0, background: "var(--rule)",
        }} />

        {/* Body — 2 columns at desktop, 1 column on narrow screens */}
        <div
          style={{
            textAlign: "left",
            columnCount: "var(--col-count, 2)",
            columnGap: 48,
            columnRule: "1px solid var(--rule)",
            fontSize: 15.5,
            lineHeight: 1.95,
            color: "var(--ink-2)",
          }}
          className="reading-body"
        >
          {entry.body.map((p, i) => (
            <p key={i} style={{ margin: "0 0 1em", textWrap: "pretty", breakInside: "avoid-column" }}>
              {p}
            </p>
          ))}
        </div>

        {/* Reflection */}
        {entry.reflection && (
          <div
            style={{
              marginTop: 56,
              padding: "32px 32px 36px",
              border: "1px solid var(--rule)",
              background: "var(--paper-2)",
              textAlign: "center",
              position: "relative",
            }}
          >
            <span
              className="serif-en"
              style={{
                position: "absolute",
                top: -12, left: "50%", transform: "translateX(-50%)",
                background: "var(--paper)",
                padding: "0 14px",
                fontSize: 11,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "var(--gold)",
              }}
            >
              Reflect
            </span>
            <p style={{
              fontSize: 17, lineHeight: 1.85, margin: 0,
              fontStyle: "italic", color: "var(--ink-2)",
            }}>
              {entry.reflection}
            </p>
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            marginTop: 64,
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={onShare}
            style={{
              background: "var(--ink)",
              color: "var(--paper)",
              border: "none",
              padding: "16px 36px",
              fontSize: 13,
              letterSpacing: "0.32em",
              fontFamily: "inherit",
              transition: "background 200ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold-deep)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--ink)"; }}
          >
            分享這一日 &nbsp;→
          </button>
          <CopyVerseButton verse={entry.verse} ref_={entry.verseRef} trans={entry.verseTrans} />
        </div>

        {entry.isPlaceholder && (
          <p style={{
            marginTop: 40, fontSize: 12, letterSpacing: "0.2em",
            color: "var(--ink-mute)", textAlign: "center",
          }}>
            ※ 示範頁面 · 完整 365 日內容陸續推出
          </p>
        )}
      </article>
    </div>
  );
}

function DateTag({ label, large = false }) {
  return (
    <div
      style={{
        background: "var(--gold-deep)",
        color: "#FBF3DD",
        fontFamily: '"Noto Serif TC", serif',
        fontSize: large ? 22 : 16,
        letterSpacing: "0.18em",
        padding: large ? "16px 56px" : "12px 40px",
        position: "relative",
        clipPath: "polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)",
        paddingBottom: large ? 28 : 22,
      }}
    >
      {label}
    </div>
  );
}

function CopyVerseButton({ verse, ref_, trans }) {
  const [copied, setCopied] = useStateR(false);
  const handleCopy = () => {
    const text = `「${verse}」\n— ${ref_}（${trans}）`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      style={{
        background: "transparent",
        color: "var(--ink-2)",
        border: "1px solid var(--ink-2)",
        padding: "16px 32px",
        fontSize: 13,
        letterSpacing: "0.32em",
        fontFamily: "inherit",
        transition: "all 200ms ease",
      }}
    >
      {copied ? "已複製 ✓" : "複製經文"}
    </button>
  );
}

window.ReadingView = ReadingView;
window.DateTag = DateTag;
window.CopyVerseButton = CopyVerseButton;
