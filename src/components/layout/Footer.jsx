import { createElement, useEffect, useState } from 'react';
import { CalendarDays, Gauge, Github, Linkedin, Mail } from 'lucide-react';
import ContactModal from '../common/ContactModal';

const SOCIAL_LINKS = [
  { href: 'https://github.com/B3N14M1N', icon: Github, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/beniamin-c-0220a0281', icon: Linkedin, label: 'LinkedIn' },
];

function Footer() {
  const [contactOpen, setContactOpen] = useState(false);
  const [visitStats, setVisitStats] = useState({ total: null, today: null, isAvailable: false });

  useEffect(() => {
    const formatDate = (date) => date.toISOString().slice(0, 10);

    const fetchVisitStats = async () => {
      try {
        const today = formatDate(new Date());

        const [totalResponse, todayResponse] = await Promise.all([
          fetch('https://b3n14m1n.goatcounter.com/counter/TOTAL.json'),
          fetch(`https://b3n14m1n.goatcounter.com/counter/TOTAL.json?start=${today}&end=${today}`),
        ]);

        if (!totalResponse.ok || !todayResponse.ok) {
          throw new Error('Failed to fetch GoatCounter stats');
        }

        const [totalData, todayData] = await Promise.all([
          totalResponse.json(),
          todayResponse.json(),
        ]);

        setVisitStats({
          total: Number(totalData?.count ?? 0),
          today: Number(todayData?.count ?? 0),
          isAvailable: true,
        });
      } catch {
        setVisitStats({ total: null, today: null, isAvailable: false });
      }
    };

    fetchVisitStats();
  }, []);

  const formatCount = (value) => {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return '—';
    }

    return value.toLocaleString('en-US');
  };

  return (
    <footer className="border-t border-border bg-surface-alt py-6">
      <div className="max-w-6xl mx-auto px-4 relative flex flex-col items-center gap-3">
        {visitStats.isAvailable && (
          <div className="md:absolute md:right-4 md:top-1/2 md:-translate-y-1/2 inline-flex items-center gap-3 text-xs text-text-muted">
            <span
              className="inline-flex items-center gap-1"
              title="Total visits"
              aria-label="Total visits"
            >
              <Gauge size={13} />
              {formatCount(visitStats.total)}
            </span>
            <span
              className="inline-flex items-center gap-1"
              title="Today visits"
              aria-label="Today visits"
            >
              <CalendarDays size={13} />
              {formatCount(visitStats.today)}
            </span>
          </div>
        )}
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-primary transition-colors"
              aria-label={label}
            >
              {createElement(icon, { size: 18 })}
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
