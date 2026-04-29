import { Link } from 'react-router-dom';

export const Brand = ({ to = '/' }: { readonly to?: string }) => (
  <Link to={to} className="brand" aria-label="全年靈修">
    <span className="brand-mark" aria-hidden>
      365
    </span>
    <span className="brand-name">全年靈修</span>
  </Link>
);
