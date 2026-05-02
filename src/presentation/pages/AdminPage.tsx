import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MONTHS, TOTAL_DAYS, daysInMonth, formatChineseMonth, pad2 } from '@shared/date';
import { PageFooter, PageHeader } from '@presentation/components';
import { useDevotionalList } from '@presentation/hooks';

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
    <main className="page page-fit">
      <PageHeader />

      <section className="page-fit-stack section-admin">
        <header className="admin-section-header">
          <p className="kicker">Admin</p>
          <div className="admin-title-row">
            <h1 className="section-title">每日靈修內容</h1>
            <span className="admin-counter">
              已完成 {filledCount} / {TOTAL_DAYS}
            </span>
          </div>
          <hr className="gold-rule gold-rule--start" />
        </header>

        <nav className="admin-month-nav" aria-label="月份選擇">
          {MONTHS.map((m) => (
            <button
              key={m}
              type="button"
              className={`pill${m === month ? ' pill-active' : ''}`}
              onClick={() => setMonth(m)}
            >
              {formatChineseMonth(m)}月
            </button>
          ))}
          <button
            type="button"
            className="pill admin-month-nav-end"
            onClick={() => void refresh()}
            disabled={loading}
          >
            重新整理
          </button>
        </nav>

        {error && (
          <div className="banner banner-error flex-static" role="alert">
            載入失敗：{error}
          </div>
        )}

        {loading && <div className="loader">載入中…</div>}

        {!loading && (
          <div className="page-fit-scroll">
            <div className="day-grid">
              {days.map((d) => {
                const key = `${pad2(month)}-${pad2(d)}`;
                const existing = filledByKey.get(key);
                return (
                  <Link key={key} to={`/admin/${month}/${d}`} className="day-card">
                    <div className="day-card-row">
                      <span className="day-card-key">
                        {formatChineseMonth(month)} · {d}
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
          </div>
        )}
      </section>

      <PageFooter />
    </main>
  );
};
