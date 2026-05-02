import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Check, Hash, Mail } from 'lucide-react';
import { formatChineseDate } from '@shared/date';
import { ClaimDialog, PageFooter, PageHeader } from '@presentation/components';
import { useDayParams, useDevotional } from '@presentation/hooks';
import cardBackground from '@presentation/assets/card-background.png';

// Placeholder campaign hashtag — swap when the team picks the final one.
const SHARE_HASHTAG = '#AWordForYourDay';

export const CardPage = () => {
  const params = useDayParams();
  if (!params) return <InvalidDate />;
  return <CardContent month={params.month} day={params.day} />;
};

const InvalidDate = () => (
  <main className="page">
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

const CardContent = ({ month, day }: { month: number; day: number }) => {
  const { entry, loading, error } = useDevotional(month, day);
  const dateLabel = formatChineseDate(month, day);
  const [copied, setCopied] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);

  const copyHashtag = () => {
    void navigator.clipboard.writeText(SHARE_HASHTAG).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main className="card-screen" aria-label={`${dateLabel}靈修卡片`}>
      <img className="card-screen-bg" src={cardBackground} alt="" aria-hidden />

      <Link to="/" className="card-back" aria-label="返回選擇日期">
        <span className="card-back-icon" aria-hidden>
          <ArrowLeft size={18} strokeWidth={1.75} />
        </span>
        <span className="card-back-label">另選日期</span>
      </Link>

      <section className="card-screen-content">
        <p className="card-date brush-zh">{dateLabel}</p>

        {entry && !loading && (
          <>
            <h1 className="card-title brush-zh">{entry.title}</h1>
            <p className="card-verse">「{entry.verse}」</p>
            <p className="card-ref">
              {entry.verseRef}
              {entry.verseTrans ? `（${entry.verseTrans}）` : ''}
            </p>
          </>
        )}
      </section>

      {entry && !loading && (
        <footer className="card-screen-actions">
          <button
            type="button"
            onClick={copyHashtag}
            className="card-action-btn"
            aria-label={`複製標籤 ${SHARE_HASHTAG}`}
          >
            <Hash size={18} strokeWidth={1.75} aria-hidden />
          </button>

          <button
            type="button"
            onClick={() => setClaimOpen(true)}
            className="card-action-btn"
            aria-label="領取電子卡"
          >
            <Mail size={18} strokeWidth={1.75} aria-hidden />
          </button>
          <Link
            to={`/read/${String(month)}/${String(day)}`}
            className="card-action-btn"
            aria-label="翻開內文"
          >
            <BookOpen size={18} strokeWidth={1.75} aria-hidden />
          </Link>
        </footer>
      )}

      {copied && (
        <div className="card-toast" role="status" aria-live="polite">
          <Check size={16} strokeWidth={2.25} aria-hidden />
          <span>已複製 {SHARE_HASHTAG}</span>
        </div>
      )}

      {loading && <div className="card-status">翻頁中…</div>}

      {error && !loading && (
        <div className="banner banner-error card-error-banner" role="alert">
          載入失敗：{error}
        </div>
      )}

      <ClaimDialog
        open={claimOpen}
        month={month}
        day={day}
        dateLabel={dateLabel}
        onClose={() => setClaimOpen(false)}
      />
    </main>
  );
};
