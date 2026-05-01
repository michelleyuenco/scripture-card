import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useContainer } from '@presentation/hooks';
import { Brand } from './Brand';
import { ThemeToggle } from './ThemeToggle';

export interface PageHeaderProps {
  readonly leading?: ReactNode;
  // When provided, replaces the default trailing nav (admin / sign-in / theme).
  // Pass <ThemeToggle /> alone for a slimmer header on photo / share screens.
  readonly trailing?: ReactNode;
}

export const PageHeader = ({ leading, trailing }: PageHeaderProps) => {
  const auth = useAuth();
  const container = useContainer();
  const location = useLocation();

  const handleSignOut = () => {
    void container.useCases.signOut.execute();
  };

  return (
    <header className="top-bar">
      {leading ?? <Brand />}
      <nav className="top-bar-tools" aria-label="primary">
        {trailing ?? (
          <>
            {auth.isAdmin && (
              <Link
                to="/admin"
                className={`pill${location.pathname.startsWith('/admin') ? ' pill-active' : ''}`}
              >
                管理
              </Link>
            )}
            {auth.user ? (
              <button type="button" onClick={handleSignOut} className="pill">
                登出
              </button>
            ) : (
              <Link to="/sign-in" className="pill">
                登入
              </Link>
            )}
            <ThemeToggle />
          </>
        )}
      </nav>
    </header>
  );
};
