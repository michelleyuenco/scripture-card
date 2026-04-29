import { type FormEvent, useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { PageFooter, PageHeader } from '@presentation/components';
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
      <PageHeader />

      <section
        style={{
          display: 'grid',
          placeItems: 'center',
          padding: '40px 0',
        }}
      >
        <div
          className="surface"
          style={{
            width: '100%',
            maxWidth: 460,
            padding: 'clamp(28px, 5vw, 48px)',
            display: 'grid',
            gap: 28,
          }}
        >
          <div style={{ textAlign: 'center', display: 'grid', gap: 14 }}>
            <p className="kicker">{mode === 'sign-in' ? 'Welcome back' : 'Create account'}</p>
            <h1
              style={{
                fontSize: 'clamp(28px, 4vw, 36px)',
                margin: 0,
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}
            >
              {mode === 'sign-in' ? '登入你的書頁' : '註冊新帳戶'}
            </h1>
            <p style={{ color: 'var(--ink-3)', margin: 0, fontSize: 14, lineHeight: 1.7 }}>
              透過電郵或 Google 帳戶登入，
              <br />
              讓每一日的話語陪你走過。
            </p>
          </div>

          <button
            type="button"
            onClick={signInWithGoogle}
            className="btn-outline"
            disabled={busy}
            style={{ letterSpacing: '0.18em', padding: '14px 24px' }}
          >
            使用 Google 帳戶登入
          </button>

          <Divider label="或" />

          <form onSubmit={submit} style={{ display: 'grid', gap: 18 }}>
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

          <p style={{ textAlign: 'center', margin: 0, fontSize: 13, color: 'var(--ink-3)' }}>
            {mode === 'sign-in' ? '還沒有帳戶？' : '已經有帳戶？'}{' '}
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
                setError(null);
              }}
              style={{
                color: 'var(--gold-deep)',
                letterSpacing: '0.12em',
                padding: 0,
              }}
            >
              {mode === 'sign-in' ? '立即註冊' : '前往登入'}
            </button>
          </p>

          <p style={{ textAlign: 'center', margin: 0 }}>
            <Link
              to="/"
              style={{
                fontSize: 12,
                letterSpacing: '0.22em',
                color: 'var(--ink-mute)',
              }}
            >
              ← 回到首頁
            </Link>
          </p>
        </div>
      </section>

      <PageFooter />
    </main>
  );
};

const Divider = ({ label }: { readonly label: string }) => (
  <div
    aria-hidden
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      color: 'var(--ink-mute)',
      fontSize: 11,
      letterSpacing: '0.4em',
      textTransform: 'uppercase',
    }}
  >
    <span style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
    <span>{label}</span>
    <span style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
  </div>
);
