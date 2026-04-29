import { Link } from 'react-router-dom';
import { PageFooter, PageHeader } from '@presentation/components';

export const NotFoundPage = () => (
  <main className="page">
    <PageHeader />
    <section
      style={{
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        gap: 18,
        padding: '40px 0',
      }}
    >
      <p className="kicker">404</p>
      <h1 className="section-title">這一頁尚未翻開</h1>
      <p style={{ color: 'var(--ink-3)', maxWidth: 420, lineHeight: 1.8 }}>
        你尋找的頁面並不存在。請回到首頁，挑選你要閱讀的日子。
      </p>
      <Link to="/" className="btn-solid">
        回到首頁 →
      </Link>
    </section>
    <PageFooter />
  </main>
);
