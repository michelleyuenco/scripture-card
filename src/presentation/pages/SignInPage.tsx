import { type FormEvent, useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageFooter, PageHeader, ThemeToggle } from '@presentation/components';
import { useAuth, useContainer } from '@presentation/hooks';

type Mode = 'sign-in' | 'sign-up';

interface LocationState {
  readonly from?: string;
}

export const SignInPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const container = useContainer();
  const from = (location.state as LocationState | null)?.from ?? '/';

  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (auth.user) {
      void navigate(from, { replace: true });
    }
  }, [auth.user, from, navigate]);

  if (auth.user) return <Navigate to={from} replace />;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    const useCase =
      mode === 'sign-in' ? container.useCases.signInWithEmail : container.useCases.signUpWithEmail;
    useCase.execute({ email: email.trim(), password }).then(
      (result) => {
        setBusy(false);
        if (!result.ok) {
          setError(result.error.message);
        }
      },
      (e: unknown) => {
        setBusy(false);
        setError(e instanceof Error ? e.message : '未知錯誤');
      },
    );
  };

  const signInWithGoogle = () => {
    if (busy) return;
    setError(null);
    setBusy(true);
    container.useCases.signInWithGoogle.execute().then(
      (result) => {
        setBusy(false);
        if (!result.ok) {
          setError(result.error.message);
        }
      },
      (e: unknown) => {
        setBusy(false);
        setError(e instanceof Error ? e.message : '未知錯誤');
      },
    );
  };

  return (
    <main className="page">
      <PageHeader
        leading={
          <Link to="/" className="pill pill-icon" aria-label="回到首頁">
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        }
        trailing={<ThemeToggle />}
      />

      <section className="center-grid section-signin">
        <div className="signin-card">
          <div className="signin-header">
            <p className="kicker">{mode === 'sign-in' ? 'Welcome back' : 'Create account'}</p>
            <h1 className="signin-title">{mode === 'sign-in' ? '登入你的書頁' : '註冊新帳戶'}</h1>
            <p className="signin-tagline">
              透過電郵或 Google 帳戶登入，
              <br />
              讓每一日的話語陪你走過。
            </p>
          </div>

          <button
            type="button"
            onClick={signInWithGoogle}
            className="btn-outline signin-google-btn"
            disabled={busy}
          >
            使用 Google 帳戶登入
          </button>

          <Divider label="或" />

          <form onSubmit={submit} className="signin-form">
            <label className="field">
              <span className="field-label">電郵</span>
              <input
                className="field-control"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={busy}
              />
            </label>
            <label className="field">
              <span className="field-label">密碼</span>
              <input
                className="field-control"
                type="password"
                autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={busy}
              />
            </label>

            {error && (
              <div className="banner banner-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-solid"
              disabled={busy || email.length === 0 || password.length === 0}
            >
              {busy ? '處理中…' : mode === 'sign-in' ? '登入 →' : '建立帳戶 →'}
            </button>
          </form>

          <p className="signin-mode-row">
            {mode === 'sign-in' ? '還沒有帳戶？' : '已經有帳戶？'}{' '}
            <button
              type="button"
              className="btn-ghost signin-mode-toggle"
              onClick={() => {
                setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
                setError(null);
              }}
            >
              {mode === 'sign-in' ? '立即註冊' : '前往登入'}
            </button>
          </p>
        </div>
      </section>

      <PageFooter />
    </main>
  );
};

const Divider = ({ label }: { readonly label: string }) => (
  <div aria-hidden className="signin-divider">
    <span className="signin-divider-rule" />
    <span>{label}</span>
    <span className="signin-divider-rule" />
  </div>
);
