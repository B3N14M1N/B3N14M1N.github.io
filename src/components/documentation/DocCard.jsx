import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function DocCard({ doc }) {
  return (
    <Link
      to={`/documentation/${doc.id}`}
      className="group block bg-surface-elevated border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all hover:border-primary/30"
    >
      {doc.thumbnail && (
        <img src={doc.thumbnail} alt={doc.title} loading="lazy" className="w-full h-40 object-cover" />
      )}
      <div className="p-5 space-y-3">
        <h3 className="font-semibold text-text group-hover:text-primary transition-colors">{doc.title}</h3>
        <p className="text-sm text-text-muted line-clamp-2">{doc.description}</p>
        {doc.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {doc.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{tag}</span>
            ))}
          </div>
        )}
        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
          Read <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}

export default DocCard;
