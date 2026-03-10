import { Loader2 } from 'lucide-react';

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 size={32} className="animate-spin text-primary" />
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
