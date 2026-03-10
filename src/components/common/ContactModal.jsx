import { useEffect, useRef, useCallback } from 'react';
import { X, Mail, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const EMAIL = 'contact@beniamincioban.com';

function ContactModal({ isOpen, onClose }) {
  const overlayRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = EMAIL;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 dark:bg-black/40 backdrop-blur-md"
    >
      <div className="relative w-full max-w-sm rounded-2xl border border-border/50 bg-surface-elevated/90 dark:bg-surface-elevated/60 backdrop-blur-xl shadow-xl shadow-black/10 dark:shadow-black/20 p-6 space-y-5">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-alt transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Mail size={22} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text">Get in Touch</h3>
          <p className="text-sm text-text-muted">Send me an email or copy the address below.</p>
        </div>

        {/* Email display */}
        <div className="flex items-center gap-2 bg-surface-alt rounded-lg px-3 py-2.5 border border-border">
          <span className="flex-1 text-sm text-text font-medium truncate">{EMAIL}</span>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
              copied
                ? 'bg-green-600/20 text-green-400'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={`mailto:${EMAIL}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            <ExternalLink size={14} />
            Open Email Client
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactModal;
