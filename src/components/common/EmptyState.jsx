function EmptyState({ icon: Icon, title, message, children }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      {Icon && <Icon size={48} className="text-text-muted/50" />}
      <h3 className="text-lg font-semibold text-text-muted">{title}</h3>
      {message && <p className="text-sm text-text-muted max-w-md">{message}</p>}
      {children}
    </div>
  );
}

export default EmptyState;
