import { useState } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import ContactModal from '../common/ContactModal';

const SOCIAL_LINKS = [
  { href: 'https://github.com/B3N14M1N', icon: Github, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/beniamin-c-0220a0281', icon: Linkedin, label: 'LinkedIn' },
];

function Footer() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <footer className="border-t border-border bg-surface-alt py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-primary transition-colors"
              aria-label={label}
            >
              <Icon size={18} />
            </a>
          ))}
          <button
            onClick={() => setContactOpen(true)}
            className="text-text-muted hover:text-primary transition-colors"
            aria-label="Email"
          >
            <Mail size={18} />
          </button>
        </div>
        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Beniamin Cioban. All rights reserved.
        </p>
      </div>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </footer>
  );
}

export default Footer;
