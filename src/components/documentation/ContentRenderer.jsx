import { useState, useRef, useEffect } from 'react';
import CodeBlock from '../common/CodeBlock';
import { ChevronDown } from 'lucide-react';

function ContentRenderer({ item, sectionId, index }) {
  switch (item.type) {
    case 'paragraph':
      return <p key={index} className="text-text/90 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: item.text }} />;

    case 'subheading':
      return <h3 key={index} className={item.className || 'text-lg font-semibold mt-6 mb-3 text-text'}>{item.text}</h3>;

    case 'image':
      return (
        <figure key={index} className="my-6 text-center">
          <img className="max-w-full h-auto rounded-lg shadow-sm mx-auto" src={item.url} alt={item.alt || ''} loading="lazy" />
          {item.caption && <figcaption className="mt-2 text-sm text-text-muted italic">{item.caption}</figcaption>}
        </figure>
      );

    case 'list':
      return <ListBlock key={index} items={item.items} ordered={item.ordered} />;

    case 'code':
      return <CodeBlock key={index} language={item.language} code={item.text} />;

    case 'faq':
      return <FaqBlock key={index} items={item.items} sectionId={sectionId} />;

    case 'subSection':
      return (
        <div key={index} id={`${sectionId}-${item.id}`} className="doc-subsection mt-8 pt-4 border-t border-border">
          <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
          {item.content.map((child, ci) => (
            <ContentRenderer key={ci} item={child} sectionId={sectionId} index={ci} />
          ))}
        </div>
      );

    default:
      return null;
  }
}

function ListBlock({ items, ordered }) {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag className={`mb-4 ml-5 space-y-1 ${ordered ? 'list-decimal' : 'list-disc'} text-text/90`}>
      {items.map((li, i) => (
        <li key={i} dangerouslySetInnerHTML={{ __html: li }} />
      ))}
    </Tag>
  );
}

function FaqBlock({ items, sectionId }) {
  const [openSet, setOpenSet] = useState(new Set());

  const toggle = (i) => {
    setOpenSet(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-2 my-4">
      {items.map((faq, i) => {
        const isOpen = openSet.has(i);
        return (
          <div key={i} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-text hover:bg-surface-alt transition-colors"
            >
              {faq.question}
              <ChevronDown size={16} className={`text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <FaqAnswer isOpen={isOpen} answer={faq.answer} />
          </div>
        );
      })}
    </div>
  );
}

function FaqAnswer({ isOpen, answer }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [answer, isOpen]);

  return (
    <div
      style={{ maxHeight: isOpen ? height + 16 : 0 }}
      className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
    >
      <div ref={contentRef} className="px-4 pt-1 pb-4 text-sm text-text-muted leading-relaxed">
        {answer}
      </div>
    </div>
  );
}

export default ContentRenderer;
