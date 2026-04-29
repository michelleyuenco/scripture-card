export interface DateTagProps {
  readonly label: string;
  readonly large?: boolean;
}

export const DateTag = ({ label, large = false }: DateTagProps) => (
  <div
    style={{
      background: 'var(--gold-deep)',
      color: '#FBF3DD',
      fontFamily: '"Noto Serif TC", serif',
      fontSize: large ? 22 : 16,
      letterSpacing: '0.18em',
      padding: large ? '16px 56px 28px' : '12px 40px 22px',
      clipPath: 'polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)',
      display: 'inline-block',
    }}
  >
    {label}
  </div>
);
