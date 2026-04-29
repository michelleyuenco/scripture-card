import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageFooter, PageHeader } from '@presentation/components';
import { useDevotionalList } from '@presentation/hooks';

const MONTH_LABELS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const daysInMonth = (m: number) => new Date(2025, m, 0).getDate();

export const AdminPage = () => {
  const { items, loading, error, refresh } = useDevotionalList();
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

  const filledByKey = useMemo(() => {
    const set = new Map<string, (typeof items)[number]>();
    items.forEach((it) => set.set(it.key, it));
    return set;
  }, [items]);

  const days = Array.from({ length: daysInMonth(month) }, (_, i) => i + 1);
  const filledCount = items.length;

  return (
    <main className="page">
      <PageHeader />

      <section
        style={{
          maxWidth: 'var(--content-max)',
          width: '100%',
          margin: '32px auto 0',
          display: 'grid',
          gap: 32,
        }}
      >
        <header style={{ display: 'grid', gap: 12 }}>
          <p className="kicker">Admin</p>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <h1 className="section-title">每日靈修內容</h1>
            <span style={{ color: 'var(--ink-3)', fontSize: 13, letterSpacing: '0.18em' }}>
              已完成 {filledCount} / 366
            </span>
          </div>
          <hr className="gold-rule" style={{ margin: 0 }} />
        </header>

        <nav
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
          }}
          aria-label="月份選擇"
        >
          {MONTHS.map((m) => (
            <button
              key={m}
              type="button"
              className={`pill${m === month ? ' pill-active' : ''}`}
              onClick={() => setMonth(m)}
            >
              {MONTH_LABELS[m - 1] ?? String(m)}月
            </button>
          ))}
          <button
            type="button"
            className="pill"
            onClick={() => void refresh()}
            style={{ marginLeft: 'auto' }}
            disabled={loading}
          >
            重新整理
          </button>
        </nav>

        {error && (
          <div className="banner banner-error" role="alert">
            載入失敗：{error}
          </div>
        )}

        {loading && <div className="loader">載入中…</div>}

        {!loading && (
          <div className="day-grid">
            {days.map((d) => {
              const key = `${month < 10 ? '0' : ''}${month}-${d < 10 ? '0' : ''}${d}`;
              const existing = filledByKey.get(key);
              return (
                <Link key={key} to={`/admin/${month}/${d}`} className="day-card">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    <span className="day-card-key">
                      {MONTH_LABELS[month - 1] ?? month} · {d}
                    </span>
                    <span className={`status-pill${existing ? ' status-pill-filled' : ''}`}>
                      {existing ? '已收錄' : '空白'}
                    </span>
                  </div>
                  <span className="day-card-title">{existing?.title ?? '—— 尚未撰寫'}</span>
                  {existing && <span className="day-card-meta">{existing.verseRef}</span>}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <PageFooter />
    </main>
  );
};
