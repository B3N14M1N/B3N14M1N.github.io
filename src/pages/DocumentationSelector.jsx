import { useFetch } from '../hooks/useFetch';
import { usePageTitle } from '../hooks/usePageTitle';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import DocCard from '../components/documentation/DocCard';
import DocUploadForm from '../components/documentation/DocUploadForm';
import { BookX } from 'lucide-react';
import '../styles/documentation.css';

function DocumentationSelector() {
  usePageTitle('Documentation');

  const { data: docs, loading } = useFetch('/data/documentation-index.json', {
    cacheKey: 'cached_doc_index',
    initialData: [],
  });

  return (
    <>
      {/* Header */}
      <section className="py-14 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-text">Documentation</h1>
          <p className="text-text-muted mt-2">Browse docs or upload your own JSON file.</p>
          <DocUploadForm />
        </div>
      </section>

      {/* Cards */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <LoadingSpinner message="Loading documentation..." />
          ) : docs.length === 0 ? (
            <EmptyState icon={BookX} title="No documentation" message="Nothing available yet." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {docs.map(doc => (
                <DocCard key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default DocumentationSelector;
