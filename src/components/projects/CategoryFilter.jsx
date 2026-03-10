function CategoryFilter({ categories, active, onChange }) {
  if (!categories || categories.length <= 1) return null;

  return (
    <div className="flex justify-center flex-wrap gap-2 mb-8 px-4">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            active === cat
              ? 'bg-primary text-white shadow-md shadow-primary/25'
              : 'bg-surface-elevated text-text-muted border border-border hover:border-primary hover:text-primary'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
