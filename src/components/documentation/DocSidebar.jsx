import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PanelLeftClose, PanelLeft, Menu, X } from 'lucide-react';

function DocSidebar({ tocEntries, activeId, onScrollTo, isOpen, onToggle }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-sidebar-bg/80 backdrop-blur-md border-r border-border/50 overflow-y-auto transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-1" aria-label="Table of Contents">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Contents</h5>

          <button
            onClick={() => navigate('/documentation')}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft size={14} />
            All Docs
          </button>

          <div className="border-t border-border my-2" />

          {tocEntries.map(entry => (
            <button
              key={entry.id}
              onClick={() => onScrollTo(entry.id)}
              className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                entry.level > 0 ? 'pl-6 ' : ''
              }${
                activeId === entry.id
                  ? 'text-primary bg-primary/10 font-medium'
                  : 'text-text-muted hover:text-primary hover:bg-primary/10'
              }`}
            >
              {entry.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Desktop toggle */}
      <button
        onClick={onToggle}
        className={`hidden lg:flex fixed top-20 z-50 p-1.5 rounded-r-md bg-surface-elevated border border-l-0 border-border text-text-muted hover:text-primary transition-all ${
          isOpen ? 'left-64' : 'left-0'
        }`}
        title={isOpen ? 'Collapse' : 'Expand'}
      >
        {isOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
      </button>

      {/* Mobile toggle */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed bottom-5 right-5 z-50 p-3 rounded-full bg-primary text-white shadow-lg shadow-primary/25"
        aria-label="Toggle contents"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={onToggle}
        />
      )}
    </>
  );
}

export default DocSidebar;
