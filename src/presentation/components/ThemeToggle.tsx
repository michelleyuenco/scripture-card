import { useTheme } from '@presentation/hooks';

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      className="pill"
      aria-label={isDark ? '切換至淺色模式' : '切換至深色模式'}
    >
      {isDark ? '淺' : '深'} / {isDark ? '深' : '淺'}
    </button>
  );
};
