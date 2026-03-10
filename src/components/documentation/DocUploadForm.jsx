import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, FileJson, X } from 'lucide-react';

function DocUploadForm() {
  const [show, setShow] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const navigate = useNavigate();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setJsonText(ev.target.result);
    reader.readAsText(file);
  };

  const handleLoad = () => {
    try {
      const content = jsonText.trim();
      if (!content) { alert('Please provide JSON content or upload a file.'); return; }
      const doc = JSON.parse(content);
      if (!doc.id || !doc.title || !doc.content) {
        alert('Invalid format. Missing required fields (id, title, content).');
        return;
      }
      sessionStorage.setItem('uploaded_documentation', content);
      navigate(`/documentation/${doc.id}?source=upload`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-border text-text-muted hover:text-primary hover:border-primary transition-colors"
      >
        <Upload size={14} />
        Upload JSON
      </button>
    );
  }

  return (
    <div className="mt-6 max-w-lg mx-auto bg-surface-elevated border border-border rounded-xl p-6 text-left space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <FileJson size={16} className="text-primary" />
          Load Documentation
        </h4>
        <button onClick={() => { setShow(false); setJsonText(''); }} className="text-text-muted hover:text-text">
          <X size={16} />
        </button>
      </div>

      <div>
        <label className="block text-xs text-text-muted mb-1">Upload file</label>
        <input type="file" accept=".json" onChange={handleFile} className="w-full text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:text-xs file:cursor-pointer" />
      </div>

      <div>
        <label className="block text-xs text-text-muted mb-1">Or paste JSON</label>
        <textarea
          rows={3}
          value={jsonText}
          onChange={e => setJsonText(e.target.value)}
          placeholder='{"id": "...", "title": "...", "content": {...}}'
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button onClick={() => { setShow(false); setJsonText(''); }} className="text-sm px-3 py-1.5 rounded-lg text-text-muted hover:text-text transition-colors">
          Cancel
        </button>
        <button onClick={handleLoad} className="text-sm px-4 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors">
          Load
        </button>
      </div>

      <p className="text-xs text-text-muted">
        New here? Check the{' '}
        <Link to="/documentation/documentation-template" className="text-primary hover:underline">template guide</Link>.
      </p>
    </div>
  );
}

export default DocUploadForm;
