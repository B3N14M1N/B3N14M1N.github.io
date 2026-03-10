import { useRef, useState, useEffect, useCallback } from 'react';
import hljs from 'highlight.js';
import { Clipboard, Check } from 'lucide-react';

function CodeBlock({ language, code }) {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!codeRef.current || !code) return;
    let result;
    if (language && hljs.getLanguage(language)) {
      result = hljs.highlight(code, { language });
    } else {
      result = hljs.highlightAuto(code);
    }
    codeRef.current.innerHTML = result.value;
  }, [code, language]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <pre className="group">
      <button
        onClick={handleCopy}
        aria-label="Copy code"
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-md text-xs flex items-center gap-1 transition-all opacity-0 group-hover:opacity-100 ${
          copied
            ? 'bg-green-600/80 text-white'
            : 'bg-white/10 text-white/70 hover:bg-primary/60 hover:text-white'
        }`}
      >
        {copied ? <Check size={14} /> : <Clipboard size={14} />}
      </button>
      <code ref={codeRef} className={language ? `language-${language}` : ''}>
        {code}
      </code>
    </pre>
  );
}

export default CodeBlock;
