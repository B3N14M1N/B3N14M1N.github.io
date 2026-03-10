import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

function NotFound() {
  usePageTitle('404 - Not Found');

  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
      <span className="text-6xl font-bold text-primary/30">404</span>
      <h1 className="text-xl font-semibold text-text">Page not found</h1>
      <p className="text-sm text-text-muted max-w-sm">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors mt-2"
      >
        <Home size={14} />
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
