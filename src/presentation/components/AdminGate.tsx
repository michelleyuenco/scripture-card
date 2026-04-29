import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@presentation/hooks';

export const AdminGate = ({ children }: { readonly children: ReactNode }) => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) {
    return <div className="loader">載入中…</div>;
  }
  if (!auth.user) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }
  if (!auth.isAdmin) {
    return (
      <main className="page">
        <header className="top-bar" />
        <section style={{ display: 'grid', placeItems: 'center', textAlign: 'center', gap: 18 }}>
          <p className="kicker">Restricted</p>
          <h1 className="section-title">沒有管理員權限</h1>
          <p style={{ color: 'var(--ink-3)', maxWidth: 480, lineHeight: 1.8 }}>
            此頁面僅供管理員存取。如需編輯每日靈修內容，請聯絡管理員為你的帳戶授權。
          </p>
        </section>
      </main>
    );
  }
  return <>{children}</>;
};
