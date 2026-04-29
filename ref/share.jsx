/* global React */

/* ─────────────────────────────────────────────────────────────
   ShareModal — fullscreen overlay with two card formats:
     1:1 (IG post)    1080×1080
     9:16 (IG story)  1080×1920
   Renders the actual card at its natural size inside a scaled
   wrapper so what you see = what gets exported.
   ───────────────────────────────────────────────────────────── */
function ShareModal({ entry, onClose }) {
  const [format, setFormat] = React.useState("post"); // "post" | "story"
  const [scale, setScale] = React.useState(1);
  const [downloading, setDownloading] = React.useState(false);
  const cardRef = React.useRef(null);
  const wrapRef = React.useRef(null);

  const dims = format === "post"
    ? { w: 1080, h: 1080 }
    : { w: 1080, h: 1920 };

  // Scale to fit available preview area
  React.useEffect(() => {
    const fit = () => {
      if (!wrapRef.current) return;
      const W = wrapRef.current.clientWidth;
      const H = wrapRef.current.clientHeight;
      const s = Math.min(W / dims.w, H / dims.h, 1) * 0.94;
      setScale(s);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [format, dims.w, dims.h]);

  // ESC to close
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      // Use html2canvas via dynamic import; fallback to dom-to-image
      const dataUrl = await captureCardAsPng(cardRef.current, dims);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `devotional-${entry.dateLabel}-${format}.png`;
      a.click();
    } catch (e) {
      console.error(e);
      alert("下載失敗，請再試一次。");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(20, 14, 8, 0.78)",
        backdropFilter: "blur(12px)",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        animation: "fadeIn 240ms ease",
      }}
    >
      {/* Top */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px 32px",
        color: "#F1E8D8",
      }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span className="serif-en" style={{
            fontSize: 12,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--gold-soft)",
          }}>Share Your Day</span>
        </div>

        <div style={{
          display: "inline-flex",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(217, 186, 130, 0.3)",
          borderRadius: 999,
          padding: 4,
        }}>
          {[
            { id: "post", label: "正方", sub: "1:1" },
            { id: "story", label: "直版", sub: "9:16" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFormat(opt.id)}
              style={{
                background: format === opt.id ? "var(--gold-deep)" : "transparent",
                color: format === opt.id ? "#FBF3DD" : "#D9BA82",
                border: "none",
                borderRadius: 999,
                padding: "8px 22px",
                fontSize: 13,
                letterSpacing: "0.18em",
                fontFamily: "inherit",
                transition: "all 200ms",
              }}
            >
              {opt.label} <span className="serif-en" style={{
                opacity: 0.7, marginLeft: 4, fontSize: 11,
              }}>{opt.sub}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            background: "transparent",
            color: "#F1E8D8",
            border: "1px solid rgba(217, 186, 130, 0.4)",
            borderRadius: 999,
            padding: "8px 18px",
            fontSize: 12,
            letterSpacing: "0.22em",
            fontFamily: "inherit",
          }}
        >
          關閉 ✕
        </button>
      </div>

      {/* Stage */}
      <div ref={wrapRef} style={{
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        padding: "8px 24px",
      }}>
        <div style={{
          width: dims.w,
          height: dims.h,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          flexShrink: 0,
        }}>
          <div ref={cardRef} style={{ width: dims.w, height: dims.h }}>
            {format === "post"
              ? <PostCard entry={entry} />
              : <StoryCard entry={entry} />}
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 14,
        padding: "20px 32px 32px",
      }}>
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            background: "var(--gold-deep)",
            color: "#FBF3DD",
            border: "none",
            padding: "16px 40px",
            fontSize: 13,
            letterSpacing: "0.32em",
            fontFamily: "inherit",
            opacity: downloading ? 0.6 : 1,
          }}
        >
          {downloading ? "生成中…" : "下載 PNG  ↓"}
        </button>
        <CopyVerseButton verse={entry.verse} ref_={entry.verseRef} trans={entry.verseTrans} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Capture helper — uses html2canvas (loaded lazily from CDN)
   ───────────────────────────────────────────────────────────── */
async function captureCardAsPng(node, dims) {
  if (!window.html2canvas) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      s.integrity = "sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA==";
      s.crossOrigin = "anonymous";
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  const canvas = await window.html2canvas(node, {
    width: dims.w,
    height: dims.h,
    backgroundColor: null,
    scale: 2,
    useCORS: true,
  });
  return canvas.toDataURL("image/png");
}

/* ─────────────────────────────────────────────────────────────
   PostCard (1080×1080) — IG post format
   ───────────────────────────────────────────────────────────── */
function PostCard({ entry }) {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#F5F1EA",
      color: "#1A1410",
      position: "relative",
      padding: "84px 96px",
      display: "flex",
      flexDirection: "column",
      fontFamily: '"Noto Serif TC", serif',
      overflow: "hidden",
    }}>
      <CardTexture />
      <CardCornerOrnaments />

      {/* Top: brand */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative", zIndex: 2,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{
            width: 32, height: 32, borderRadius: "50%",
            border: "1.5px solid #B08D4E",
            display: "grid", placeItems: "center",
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 14, color: "#B08D4E",
          }}>365</span>
          <span style={{ fontSize: 14, letterSpacing: "0.32em", color: "#6B5B4A" }}>
            全年靈修
          </span>
        </div>
        <span className="serif-en" style={{
          fontSize: 13, letterSpacing: "0.32em",
          textTransform: "uppercase", color: "#B08D4E",
        }}>
          {entry.dateEn}
        </span>
      </div>

      {/* Center stack */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative", zIndex: 2,
      }}>
        <DateTag label={entry.dateLabel} />

        <h1 style={{
          fontSize: 64,
          fontWeight: 500,
          lineHeight: 1.25,
          letterSpacing: "0.02em",
          color: "#1A1410",
          margin: "56px 0 36px",
          textWrap: "balance",
        }}>
          {entry.title}
        </h1>

        <div style={{
          width: 1, height: 32, background: "#B08D4E", marginBottom: 28,
        }} />

        <p style={{
          fontSize: 26,
          lineHeight: 1.85,
          color: "#3A2F26",
          margin: 0,
          maxWidth: 760,
          textWrap: "pretty",
        }}>
          『{entry.verse}』
        </p>
        <p style={{
          marginTop: 26,
          fontSize: 18,
          letterSpacing: "0.18em",
          color: "#8B6B33",
          fontWeight: 500,
        }}>
          {entry.verseRef}　<span style={{ color: "#9A8B78", fontWeight: 400 }}>（{entry.verseTrans}）</span>
        </p>
      </div>

      {/* Bottom signature */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        position: "relative", zIndex: 2,
      }}>
        <span style={{
          fontSize: 13, letterSpacing: "0.28em", color: "#9A8B78",
        }}>
          VOL · MMXXVI
        </span>
        <span className="serif-en" style={{
          fontStyle: "italic", fontSize: 18, color: "#8B6B33",
        }}>
          One day. One word.
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   StoryCard (1080×1920) — IG / FB story format
   ───────────────────────────────────────────────────────────── */
function StoryCard({ entry }) {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#F5F1EA",
      color: "#1A1410",
      position: "relative",
      padding: "120px 96px",
      display: "flex",
      flexDirection: "column",
      fontFamily: '"Noto Serif TC", serif',
      overflow: "hidden",
    }}>
      <CardTexture />
      <CardCornerOrnaments tall />

      {/* Top: brand */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        position: "relative", zIndex: 2,
      }}>
        <span style={{
          width: 44, height: 44, borderRadius: "50%",
          border: "1.5px solid #B08D4E",
          display: "grid", placeItems: "center",
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 18, color: "#B08D4E",
        }}>365</span>
        <span style={{ fontSize: 16, letterSpacing: "0.4em", color: "#6B5B4A" }}>
          全年靈修
        </span>
        <span className="serif-en" style={{
          fontSize: 15, letterSpacing: "0.36em",
          textTransform: "uppercase", color: "#B08D4E",
        }}>
          {entry.dateEn}
        </span>
      </div>

      {/* Center */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative", zIndex: 2,
      }}>
        <DateTag label={entry.dateLabel} large />

        <h1 style={{
          fontSize: 78,
          fontWeight: 500,
          lineHeight: 1.22,
          letterSpacing: "0.02em",
          color: "#1A1410",
          margin: "72px 0 48px",
          textWrap: "balance",
        }}>
          {entry.title}
        </h1>

        <div style={{ width: 1, height: 44, background: "#B08D4E", marginBottom: 40 }} />

        <p style={{
          fontSize: 30,
          lineHeight: 1.85,
          color: "#3A2F26",
          margin: 0,
          maxWidth: 800,
          textWrap: "pretty",
        }}>
          『{entry.verse}』
        </p>
        <p style={{
          marginTop: 36,
          fontSize: 21,
          letterSpacing: "0.2em",
          color: "#8B6B33",
          fontWeight: 500,
        }}>
          {entry.verseRef}　<span style={{ color: "#9A8B78", fontWeight: 400 }}>（{entry.verseTrans}）</span>
        </p>
      </div>

      {/* Bottom */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        position: "relative", zIndex: 2,
      }}>
        <div style={{ width: 56, height: 1, background: "#B08D4E" }} />
        <span className="serif-en" style={{
          fontStyle: "italic", fontSize: 22, color: "#8B6B33",
        }}>
          One day. One word. One year.
        </span>
        <span style={{
          fontSize: 14, letterSpacing: "0.32em", color: "#9A8B78",
        }}>
          VOL · MMXXVI
        </span>
      </div>
    </div>
  );
}

function CardTexture() {
  return (
    <div aria-hidden style={{
      position: "absolute", inset: 0,
      backgroundImage:
        "radial-gradient(rgba(120, 90, 50, 0.05) 1px, transparent 1px)," +
        "radial-gradient(rgba(120, 90, 50, 0.03) 1px, transparent 1px)",
      backgroundSize: "4px 4px, 9px 9px",
      mixBlendMode: "multiply",
      pointerEvents: "none",
      zIndex: 1,
    }} />
  );
}

function CardCornerOrnaments({ tall = false }) {
  // Hairline gold L-shapes in each corner
  const inset = tall ? 56 : 44;
  const len = tall ? 70 : 58;
  const Corner = ({ top, right, bottom, left, rotate }) => (
    <div aria-hidden style={{
      position: "absolute",
      top, right, bottom, left,
      width: len, height: len,
      borderTop: "1px solid #B08D4E",
      borderLeft: "1px solid #B08D4E",
      transform: `rotate(${rotate}deg)`,
      zIndex: 1,
    }} />
  );
  return (
    <React.Fragment>
      <Corner top={inset} left={inset} rotate={0} />
      <Corner top={inset} right={inset} rotate={90} />
      <Corner bottom={inset} right={inset} rotate={180} />
      <Corner bottom={inset} left={inset} rotate={270} />
    </React.Fragment>
  );
}

window.ShareModal = ShareModal;
window.PostCard = PostCard;
window.StoryCard = StoryCard;
