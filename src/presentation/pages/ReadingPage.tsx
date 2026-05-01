import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Check, Compass, Copy } from 'lucide-react';
import { DateTag, PageFooter, PageHeader } from '@presentation/components';
import { useDevotional } from '@presentation/hooks';

const parseDate = (rawMonth: string | undefined, rawDay: string | undefined) => {
  const m = Number(rawMonth);
  const d = Number(rawDay);
  if (!Number.isInteger(m) || m < 1 || m > 12) return null;
  if (!Number.isInteger(d) || d < 1 || d > 31) return null;
  return { month: m, day: d };
};

export const ReadingPage = () => {
  const { month: rawMonth, day: rawDay } = useParams<{ month: string; day: string }>();
  const parsed = useMemo(() => parseDate(rawMonth, rawDay), [rawMonth, rawDay]);

  if (!parsed) {
    return <InvalidDate />;
  }

  return <ReadingContent month={parsed.month} day={parsed.day} />;
};

const InvalidDate = () => (
  <main className="page page-fit">
    <PageHeader />
    <section className="section-message">
      <p className="kicker">Not Found</p>
      <h1 className="section-title">這不是一個有效的日期</h1>
      <Link to="/" className="btn-solid">
        回到首頁 →
      </Link>
    </section>
    <PageFooter />
  </main>
);

const ReadingContent = ({ month, day }: { month: number; day: number }) => {
  const { entry, loading, error } = useDevotional(month, day);
  const [copied, setCopied] = useState(false);
  const [showCondensed, setShowCondensed] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lastScrollY = useRef(0);

  // Reveal a condensed sticky header once the original title has scrolled
  // out of the viewport. Default root = window, since the page now scrolls
  // naturally (actions + footer live at the end of the document).
  useEffect(() => {
    const titleNode = titleRef.current;
    if (!titleNode) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const ent = entries[0];
        if (ent) setShowCondensed(!ent.isIntersecting);
      },
      { threshold: 0 },
    );
    observer.observe(titleNode);
    return () => {
      observer.disconnect();
    };
  }, [entry]);

  // Headroom-style top-bar: hide on scroll-down, reveal on any scroll-up,
  // always visible near the top. Threshold + 6px hysteresis avoids jitter
  // on tiny finger-twitches. Also drives the scroll-to-top FAB visibility.
  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastScrollY.current;
      if (y < 32) {
        setHeaderVisible(true);
      } else if (dy > 6) {
        setHeaderVisible(false);
      } else if (dy < -6) {
        setHeaderVisible(true);
      }
      setShowScrollTop(y > 240);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const copyVerse = () => {
    if (!entry) return;
    const text = `「${entry.verse}」\n— ${entry.verseRef}（${entry.verseTrans}）`;
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="page">
      <motion.div
        className="reading-sticky-bar"
        animate={{ y: headerVisible ? 0 : '-110%' }}
        transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <PageHeader
          leading={
            <Link to={`/card/${String(month)}/${String(day)}`} className="btn-ghost">
              ← &nbsp;回到卡片
            </Link>
          }
        />
      </motion.div>

      <AnimatePresence>
        {showCondensed && entry && (
          <motion.div
            key="reading-condensed"
            className="reading-condensed-bar"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
            aria-hidden
          >
            <span className="reading-condensed-date">{entry.dateLabel}</span>
            <span className="reading-condensed-divider" aria-hidden />
            <span className="reading-condensed-title">{entry.title}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <article className="section-reading">
        {loading && <div className="loader">翻頁中…</div>}
        {error && !loading && (
          <div className="banner banner-error" role="alert">
            載入失敗：{error}
          </div>
        )}
        {entry && !loading && (
          <>
            <div className="reading-datetag-row">
              <DateTag label={entry.dateLabel} />
            </div>

            <h1 className="reading-title" ref={titleRef}>
              {entry.title}
            </h1>

            <div className="verse-block">
              <div aria-hidden className="verse-tick" />
              <p className="verse-text">『{entry.verse}』</p>
              <p className="verse-ref">
                {entry.verseRef}{' '}
                {entry.verseTrans && <span className="verse-trans">（{entry.verseTrans}）</span>}
              </p>
            </div>

            <hr className="reading-divider" />

            <div className="reading-body">
              {entry.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {entry.reflection && (
              <div className="reflect-card">
                <span className="serif-en reflect-label">Reflect</span>
                <p className="reflect-text">{entry.reflection}</p>
              </div>
            )}

            {entry.source === 'builtin' && (
              <p aria-label="選錄篇章" title="選錄篇章" className="reading-source-mark">
                ✦
              </p>
            )}
            {entry.source === 'placeholder' && (
              <p
                aria-label="示範頁面"
                title="示範頁面 · 完整 365 日內容由管理員陸續上載"
                className="reading-source-mark reading-source-mark--quiet"
              >
                ※
              </p>
            )}

            <div className="reading-end-actions">
              <button
                type="button"
                onClick={copyVerse}
                className={
                  copied ? 'reading-action-btn reading-action-btn--copied' : 'reading-action-btn'
                }
                aria-label={copied ? '已複製經文' : '複製經文'}
                title={copied ? '已複製' : '複製經文'}
              >
                {copied ? (
                  <Check size={18} strokeWidth={2} aria-hidden />
                ) : (
                  <Copy size={18} strokeWidth={1.75} aria-hidden />
                )}
                <span className="reading-action-btn-label">{copied ? '已複製' : '複製經文'}</span>
              </button>
              <Link to="/" className="reading-action-btn" aria-label="繼續探索" title="繼續探索">
                <Compass size={18} strokeWidth={1.75} aria-hidden />
                <span className="reading-action-btn-label">繼續探索</span>
              </Link>
            </div>
          </>
        )}
      </article>

      <PageFooter />

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-top-fab"
            type="button"
            className="scroll-top-fab"
            onClick={scrollToTop}
            aria-label="回到頂部"
            title="回到頂部"
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 16 }}
            transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <ArrowUp size={18} strokeWidth={1.75} aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
};
