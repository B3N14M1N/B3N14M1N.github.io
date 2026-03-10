import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Gamepad2, Tv, Code2 } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import ContactModal from '../components/common/ContactModal';

const SKILLS = ['C#', '.NET', 'Unity', 'Web Dev'];

const INTERESTS = [
  { icon: Gamepad2, label: 'Gaming' },
  { icon: Tv, label: 'Anime' },
  { icon: Code2, label: 'Game Dev' },
];

function Home() {
  usePageTitle('Home');
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-hero-from to-hero-to py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-10">
          <div className="flex-shrink-0">
            <img
              src="/Images/selfie.jpg"
              alt="Beniamin Cioban"
              className="w-40 h-40 md:w-52 md:h-52 rounded-full object-cover border-4 border-primary shadow-xl shadow-primary/10 hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="text-center md:text-left space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold text-text">
              Beniamin <span className="text-primary">Cioban</span>
            </h1>
            <p className="text-text-muted">Cybersecurity student &middot; Software Developer</p>
            <p className="text-sm text-text-muted max-w-lg">
              Welcome to my portfolio. I showcase projects and share documentation for my work.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => setContactOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors shadow-md shadow-primary/20"
              >
                <Mail size={16} />
                Contact
              </button>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-text-muted text-sm font-medium hover:text-primary hover:border-primary transition-colors"
              >
                Projects <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          {/* Skills */}
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-text">About Me</h2>
            <p className="text-sm text-text-muted leading-relaxed">
              I&apos;m passionate about computer science and programming.
              I love developing games, websites, and other interesting projects.
            </p>
            <div>
              <h3 className="text-sm font-semibold text-text mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map(s => (
                  <span key={s} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-text">Interests</h2>
            <div className="grid grid-cols-3 gap-4">
              {INTERESTS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-elevated border border-border hover:border-primary/30 hover:shadow-md transition-all">
                  <Icon size={24} className="text-primary" />
                  <span className="text-xs font-medium text-text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

export default Home;
