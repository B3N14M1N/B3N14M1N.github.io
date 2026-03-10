import ContentRenderer from './ContentRenderer';

function DocContent({ sections }) {
  if (!sections?.length) return null;

  return (
    <div className="doc-content max-w-3xl mx-auto">
      {sections.map(section => (
        <section key={section.id} id={section.id} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-text">{section.title}</h2>
          {section.content?.map((item, i) => (
            <ContentRenderer key={i} item={item} sectionId={section.id} index={i} />
          ))}
        </section>
      ))}
    </div>
  );
}

export default DocContent;
