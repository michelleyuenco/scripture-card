import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DrumPicker, PageFooter, PageHeader } from '@presentation/components';

const MONTH_LABELS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const daysInMonth = (m: number) => new Date(2025, m, 0).getDate();

export const LandingPage = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [requestedDay, setRequestedDay] = useState<number>(today.getDate());

  // Clamp at render time so a month change never leaves us with an out-of-range day.
  const day = Math.min(requestedDay, daysInMonth(month));
  const days = Array.from({ length: daysInMonth(month) }, (_, i) => i + 1);

  const open = () => {
    void navigate(`/read/${String(month)}/${String(day)}`);
  };

  return (
    <main className="page">
      <PageHeader />

      <section
        style={{
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          padding: '40px 0',
        }}
      >
        <div style={{ width: '100%', maxWidth: 720 }}>
          <p className="kicker">A Word For Your Day</p>

          <h1
            style={{
              fontSize: 'clamp(40px, 7vw, 88px)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '0.02em',
              margin: '24px 0 22px',
              color: 'var(--ink)',
            }}
          >
            為你而留的
            <br />
            <span style={{ fontStyle: 'italic', color: 'var(--gold-deep)' }}>那一日</span>
          </h1>

          <hr className="gold-rule" style={{ margin: '0 auto 28px' }} />

          <p
            style={{
              fontSize: 16,
              lineHeight: 1.9,
              color: 'var(--ink-3)',
              maxWidth: 520,
              margin: '0 auto 48px',
              padding: '0 12px',
            }}
          >
            告訴我們你的生日，我們將為你翻開那一日的
            <br />
            經文與靈修，將它定格成你的日常。
          </p>

          <div
            className="surface"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 24px',
              borderRadius: 4,
            }}
          >
            <DrumPicker
              ariaLabel="月份"
              items={MONTHS}
              value={month}
              onChange={setMonth}
              width={92}
              formatter={(m) => `${MONTH_LABELS[m - 1] ?? String(m)}月`}
            />
            <span
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 22,
                color: 'var(--gold)',
                padding: '0 8px',
              }}
            >
              ·
            </span>
            <DrumPicker
              ariaLabel="日期"
              items={days}
              value={day}
              onChange={setRequestedDay}
              width={72}
            />
          </div>

          <div style={{ marginTop: 40 }}>
            <button type="button" onClick={open} className="btn-solid">
              翻開那一日 &nbsp;→
            </button>
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  );
};
