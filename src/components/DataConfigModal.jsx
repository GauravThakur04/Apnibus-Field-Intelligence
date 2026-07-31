import React, { useState } from 'react';
import { X, Upload, Check, AlertCircle, RefreshCw, Link as LinkIcon, FileText } from 'lucide-react';
import { integrateVisits } from '../utils/csvParser';
import { updateData, getData, resetData } from '../data/dataService';

const DataConfigModal = ({ isOpen, onClose, onDataChanged }) => {
  const [managerEmail, setManagerEmail] = useState('rajnish.kumar@apnibus.com');
  const [csvUrl, setCsvUrl] = useState('https://data.apnibus.com/public/question/befce31e-f208-4675-a559-19137d5b08ca.csv');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  if (!isOpen) return null;

  const currentData = getData();

  const process = (text) => {
    try {
      const updated = integrateVisits(text, managerEmail, currentData);
      updateData(updated);
      setStatus({ type: 'success', message: `Successfully imported visits for ${managerEmail}!` });
      onDataChanged();
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to parse CSV.' });
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => process(ev.target.result);
    reader.onerror = () => setStatus({ type: 'error', message: 'Failed to read file.' });
    reader.readAsText(file);
  };

  const handleUrl = async () => {
    if (!csvUrl) { setStatus({ type: 'error', message: 'Please enter a URL.' }); return; }
    setLoading(true); setStatus({ type: '', message: '' });
    try {
      const res = await fetch(csvUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      process(text);
    } catch (err) {
      setStatus({ type: 'error', message: `Could not fetch URL — try downloading the CSV and uploading it directly.` });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (!window.confirm('Reset to default compiled datasets?')) return;
    resetData(); onDataChanged();
    setStatus({ type: 'success', message: 'Reset to default data.' });
    setTimeout(() => { setStatus({ type: '', message: '' }); onClose(); }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: 16 }}>Data Sources</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Import fresh CSV data or reset to defaults</p>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status alert */}
          {status.message && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: 12.5, fontWeight: 500, background: status.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)', border: `1px solid ${status.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`, color: status.type === 'success' ? '#059669' : '#e11d48' }}>
              {status.type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
              {status.message}
            </div>
          )}

          {/* Manager selector */}
          <div>
            <div className="filter-label" style={{ marginBottom: 8 }}>Associate Data With Manager</div>
            <select className="select" value={managerEmail} onChange={e => setManagerEmail(e.target.value)}>
              <option value="rajnish.kumar@apnibus.com">Rajnish Kumar (rajnish.kumar@apnibus.com)</option>
              <option value="tarun.kumar@apnibus.com">Tarun Kumar (tarun.kumar@apnibus.com)</option>
              <option value="sonu.mishra@apnibus.com">Sonu Mishra (sonu.mishra@apnibus.com)</option>
            </select>
          </div>

          <div className="divider" />

          {/* File upload */}
          <div>
            <div className="filter-label" style={{ marginBottom: 8 }}>Option 1 — Upload CSV File</div>
            <label className="dropzone">
              <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFile} />
              <Upload size={26} color="var(--primary)" />
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 13 }}>Click to upload</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}> or drag & drop</span>
                <p style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>Standard ApniBus CSV format (bd_name, visit_date, …)</p>
              </div>
            </label>
          </div>

          <div className="divider" />

          {/* URL import */}
          <div>
            <div className="filter-label" style={{ marginBottom: 8 }}>Option 2 — Import from CSV URL</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }} className="input-with-icon">
                <LinkIcon size={14} className="input-icon" />
                <input type="text" className="input" style={{ paddingLeft: 34 }} placeholder="https://data.apnibus.com/…csv" value={csvUrl} onChange={e => setCsvUrl(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleUrl} disabled={loading} style={{ whiteSpace: 'nowrap' }}>
                {loading ? 'Fetching…' : 'Import'}
              </button>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 6 }}>
              Note: If the URL requires auth or times out, download the CSV and use Option 1 above.
            </p>
          </div>

          <div className="divider" />

          {/* Reset */}
          <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-heading)' }}>Reset to Default Data</div>
              <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>Restore all original compiled visit stats</p>
            </div>
            <button className="btn btn-ghost" style={{ color: 'var(--danger)', borderColor: 'rgba(244,63,94,0.3)' }} onClick={handleReset}>
              <RefreshCw size={13} />Reset
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default DataConfigModal;
