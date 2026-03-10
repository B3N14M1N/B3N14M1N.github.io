import { useState, useEffect, useMemo } from 'react';
import { useFetch } from '../hooks/useFetch';
import { usePageTitle } from '../hooks/usePageTitle';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ContactModal from '../components/common/ContactModal';
import CategoryFilter from '../components/projects/CategoryFilter';
import ProjectCarousel from '../components/projects/ProjectCarousel';
import { FolderX, Mail } from 'lucide-react';
import '../styles/projects.css';

function Projects() {
  usePageTitle('Projects');

  const { data: projects, loading } = useFetch('/data/projects.json', {
    cacheKey: 'cached_projects_data',
    initialData: [],
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [contactOpen, setContactOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(projects?.map(p => p.category).filter(Boolean));
    return ['All', ...cats];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return activeCategory === 'All'
      ? projects
      : projects.filter(p => p.category === activeCategory);
  }, [projects, activeCategory]);

  useEffect(() => { setActiveIndex(0); }, [activeCategory]);

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner message="Loading projects..." />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="py-14 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-text">Projects</h1>
          <p className="text-text-muted mt-2">A collection of things I&apos;ve built.</p>
        </div>
      </section>

      {/* Projects */}
      <section className="pb-16">
        <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />

        {filteredProjects.length === 0 ? (
          <EmptyState icon={FolderX} title="No projects" message="Nothing in this category yet." />
        ) : (
          <ProjectCarousel projects={filteredProjects} activeIndex={activeIndex} onSelect={setActiveIndex} />
        )}
      </section>

      {/* CTA */}
      <section className="py-14 bg-surface-alt text-center">
        <div className="max-w-xl mx-auto px-4 space-y-4">
          <h2 className="text-xl font-bold text-text">Interested in collaborating?</h2>
          <p className="text-sm text-text-muted">Always open to discussing new projects.</p>
          <button
            onClick={() => setContactOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors shadow-md shadow-primary/20"
          >
            <Mail size={16} />
            Get in Touch
          </button>
        </div>
      </section>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

export default Projects;
