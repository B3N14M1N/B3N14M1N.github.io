import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { usePageTitle } from '../hooks/usePageTitle';
import { useScrollSpy } from '../hooks/useScrollSpy';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DocSidebar from '../components/documentation/DocSidebar';
import DocContent from '../components/documentation/DocContent';
import { AlertTriangle } from 'lucide-react';
import '../styles/documentation.css';

function buildToc(sections) {
  if (!sections) return [];
  const entries = [];
  for (const section of sections) {
    entries.push({ id: section.id, title: section.title, level: 0 });
    if (section.content) {
      for (const item of section.content) {
        if (item.type === 'subSection') {
          entries.push({ id: `${section.id}-${item.id}`, title: item.title, level: 1 });
        }
      }
    }
  }
  return entries;
}

function Documentation() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isUpload = searchParams.get('source') === 'upload';

  const { data: fetchedDoc, loading: fetchLoading } = useFetch(
    isUpload ? null : `/data/documentations/${docId}.json`,
    { cacheKey: `doc_${docId}` },
  );

  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(isUpload);

  useEffect(() => {
    if (!isUpload) return;
    const raw = sessionStorage.getItem('uploaded_documentation');
    if (raw) { try { setUploadedDoc(JSON.parse(raw)); } catch {} }
    setUploadLoading(false);
  }, [isUpload]);

  const loading = isUpload ? uploadLoading : fetchLoading;
  const doc = isUpload ? uploadedDoc : fetchedDoc;
  const docContent = doc?.content ?? doc;

  usePageTitle(docContent?.title ?? 'Documentation');

  const [sidebarOpen, setSidebarOpen] = useState(
    () => localStorage.getItem('sidebarCollapsed') !== 'true',
  );
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(!sidebarOpen));
  }, [sidebarOpen]);

  const tocEntries = useMemo(() => buildToc(docContent?.sections), [docContent]);

  const { activeId, scrollTo } = useScrollSpy(
    'section[id], .doc-subsection[id]',
    { offset: 0.5, updateHash: true },
  );

  useEffect(() => {
    if (!docContent) return;
    const hash = window.location.hash;
    const m = hash.match(/#[^#]*#(.+)/);
    if (m) setTimeout(() => scrollTo(m[1]), 300);
  }, [docContent, scrollTo]);

  const handleBack = useCallback(() => navigate('/documentation'), [navigate]);

  if (loading) return <div className="py-20"><LoadingSpinner message="Loading documentation..." /></div>;

  if (!docContent) {
    return (
      <div className="py-20 text-center space-y-4">
        <AlertTriangle size={48} className="mx-auto text-amber-500" />
        <h3 className="text-lg font-semibold text-text">Documentation not found</h3>
        <Link to="/documentation" className="inline-block px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors">
          Back to Docs
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className={`py-12 text-center transition-all ${sidebarOpen ? 'lg:pl-64' : ''}`}>
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-text">{docContent.title}</h1>
          {docContent.description && <p className="text-text-muted mt-2">{docContent.description}</p>}
        </div>
      </section>

      {/* Content */}
      <section className="pb-16">
        <div className="relative">
          <DocSidebar
            tocEntries={tocEntries}
            activeId={activeId}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(o => !o)}
            onScrollTo={scrollTo}
            onBack={handleBack}
          />
          <div className={`transition-all px-4 ${sidebarOpen ? 'lg:pl-72' : ''}`}>
            <DocContent sections={docContent.sections} />
          </div>
        </div>
      </section>
    </>
  );
}

export default Documentation;
