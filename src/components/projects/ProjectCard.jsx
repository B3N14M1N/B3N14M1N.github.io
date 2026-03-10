import { useNavigate } from 'react-router-dom';
import { ExternalLink, Github } from 'lucide-react';

function ProjectCard({ project, isActive, onClick }) {
  const navigate = useNavigate();

  const handleDemoClick = (e) => {
    if (project.demoUrl?.includes('documentation.html?doc=')) {
      e.preventDefault();
      const docId = project.demoUrl.split('doc=')[1];
      navigate(`/documentation/${docId}`);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`flex-shrink-0 w-72 md:w-80 cursor-pointer transition-all duration-300 ${
        isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-50 pointer-events-auto'
      }`}
    >
      <div className={`bg-surface-elevated border rounded-xl overflow-hidden transition-all duration-300 ${
        isActive
          ? 'border-primary/20 shadow-md hover:scale-[1.03] hover:shadow-lg'
          : 'border-border'
      }`}>
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-elevated to-transparent" />
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-text">{project.title}</h3>
            {project.year && <span className="text-xs text-text-muted">{project.year}</span>}
          </div>
          <p className="text-sm text-text-muted line-clamp-2">{project.description}</p>

          {/* Tags */}
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            {project.demoUrl && project.demoUrl !== '#' && (
              <a
                href={project.demoUrl}
                onClick={handleDemoClick}
                target={project.demoUrl.startsWith('http') ? '_blank' : undefined}
                rel={project.demoUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors"
              >
                <ExternalLink size={12} />
                {project.demoText || 'Demo'}
              </a>
            )}
            {project.repoUrl && project.repoUrl !== '#' && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-text-muted hover:text-primary hover:border-primary transition-colors"
              >
                <Github size={12} />
                Repo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
