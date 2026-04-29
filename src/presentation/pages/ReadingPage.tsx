import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
  <main className="page">
    <PageHeader />
    <section style={{ display: 'grid', placeItems: 'center', textAlign: 'center', gap: 18 }}>
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
          <Link to="/" className="btn-ghost">
            ← &nbsp;另選日期
          </Link>
        }
      />

      <article style={{ maxWidth: 720, margin: '32px auto 0', textAlign: 'center', width: '100%' }}>
        {loading && <div className="loader">翻頁中…</div>}
        {error && !loading && (
          <div className="banner banner-error" role="alert">
            載入失敗：{error}
          </div>
        )}
        {entry && !loading && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
              <DateTag label={entry.dateLabel} />
            </div>

            <h1
              style={{
                fontSize: 'clamp(30px, 4.6vw, 52px)',
                fontWeight: 500,
                lineHeight: 1.25,
                letterSpacing: '0.02em',
                color: 'var(--ink)',
                margin: '0 0 32px',
              }}
            >
              {entry.title}
            </h1>

            <div style={{ position: 'relative', padding: '24px 0 28px' }}>
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 1,
                  height: 22,
                  background: 'var(--gold)',
                }}
              />
              <p
                style={{
                  fontSize: 'clamp(16px, 1.4vw, 19px)',
                  lineHeight: 2.0,
                  color: 'var(--ink-2)',
                  margin: '0 auto',
                  maxWidth: 560,
                  textWrap: 'pretty',
                }}
              >
                『{entry.verse}』
              </p>
              <p
                style={{
                  marginTop: 18,
                  fontSize: 13,
                  letterSpacing: '0.16em',
                  color: 'var(--gold-deep)',
                  fontWeight: 500,
                }}
              >
                {entry.verseRef}{' '}
                {entry.verseTrans && (
                  <span style={{ color: 'var(--ink-mute)', fontWeight: 400 }}>
                    （{entry.verseTrans}）
                  </span>
                )}
              </p>
            </div>

            <hr
              style={{
                width: 40,
                margin: '12px auto 40px',
                height: 1,
                border: 0,
                background: 'var(--rule)',
              }}
            />

            <div className="reading-body">
              {entry.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {entry.reflection && (
              <div
                style={{
                  marginTop: 56,
                  padding: '32px 28px 36px',
                  border: '1px solid var(--rule)',
                  background: 'var(--paper-2)',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <span
                  className="serif-en"
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--paper)',
                    padding: '0 14px',
                    fontSize: 11,
                    letterSpacing: '0.4em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                  }}
                >
                  Reflect
                </span>
                <p
                  style={{
                    fontSize: 17,
                    lineHeight: 1.85,
                    margin: 0,
                    fontStyle: 'italic',
                    color: 'var(--ink-2)',
                  }}
                >
                  {entry.reflection}
                </p>
              </div>
            )}

            <div
              style={{
                marginTop: 56,
                display: 'flex',
                gap: 14,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button type="button" onClick={copyVerse} className="btn-outline">
                {copied ? '已複製 ✓' : '複製經文'}
              </button>
              <Link to="/" className="btn-solid">
                繼續探索 →
              </Link>
            </div>

            {entry.isPlaceholder && (
              <p
                style={{
                  marginTop: 36,
                  fontSize: 12,
                  letterSpacing: '0.2em',
                  color: 'var(--ink-mute)',
                }}
              >
                ※ 示範頁面 · 完整 365 日內容由管理員陸續上載
              </p>
            )}
          </>
        )}
      </article>

      <PageFooter />
    </main>
  );
};
