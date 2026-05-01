import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Compass, Copy } from 'lucide-react';
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
  const titleRef = useRef<HTMLHeadingElement>(null);

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

  const copyVerse = () => {
    if (!entry) return;
    const text = `「${entry.verse}」\n— ${entry.verseRef}（${entry.verseTrans}）`;
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main className="page">
      <PageHeader
        leading={
          <Link to={`/card/${String(month)}/${String(day)}`} className="btn-ghost">
            ← &nbsp;回到卡片
          </Link>
        }
      />

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
    </main>
  );
};
