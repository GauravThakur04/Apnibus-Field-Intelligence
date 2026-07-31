import React, { useState, useMemo, useEffect } from 'react';
import { getData, getUniqueStates } from '../data/dataService';
import { Download, Search, Filter, Image, ExternalLink, X, Calendar, Lock } from 'lucide-react';

const MANAGER_NAMES = {
  'rajnish.kumar@apnibus.com': 'Rajnish Kumar',
  'tarun.kumar@apnibus.com':   'Tarun Kumar',
  'sonu.mishra@apnibus.com':   'Sonu Mishra'
};

const VisitTable = ({ globalFilters }) => {
  const allData = getData();
  const states  = getUniqueStates();

  const lockedEmail = globalFilters?.managerEmail || '';

  // ── Filters ──
  const [managerEmail, setManagerEmail] = useState(lockedEmail);
  const [bdSearch, setBdSearch]         = useState(globalFilters?.bdSearch || '');
  const [stateFilter, setStateFilter]   = useState(globalFilters?.state || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom]         = useState('');
  const [dateTo, setDateTo]             = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  useEffect(() => {
    if (lockedEmail) setManagerEmail(lockedEmail);
  }, [lockedEmail]);

  const activeEmail = lockedEmail || managerEmail;

  const managers = allData.managers;

  const hasFilters = (!lockedEmail && managerEmail) || bdSearch || stateFilter || statusFilter || dateFrom || dateTo;

  const clearFilters = () => {
    if (!lockedEmail) setManagerEmail('');
    setBdSearch(''); setStateFilter('');
    setStatusFilter(''); setDateFrom(''); setDateTo(''); setPage(1);
  };

  const filtered = useMemo(() => {
    let v = allData.visits;
    if (activeEmail) v = v.filter(x => x.manager_email === activeEmail);
    if (bdSearch.trim()) {
      const t = bdSearch.trim().toLowerCase();
      v = v.filter(x => (x.bd_name || '').toLowerCase().includes(t));
    }
    if (stateFilter) v = v.filter(x => x.state === stateFilter);
    if (statusFilter) v = v.filter(x => x.verify_status === statusFilter);
    if (dateFrom)  v = v.filter(x => x.visit_date >= dateFrom);
    if (dateTo)    v = v.filter(x => x.visit_date <= dateTo);
    return v;
  }, [activeEmail, bdSearch, stateFilter, statusFilter, dateFrom, dateTo, allData]);

  const paginated  = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  const exportCSV = () => {
    const headers = ['BD Name','Visit Date','State','City','Location','Operator','Company','Mobile','Status','Latitude','Longitude'];
    const rows = filtered.map(v => [
      `"${v.bd_name}"`, `"${v.visit_date}"`, `"${v.state||''}"`, `"${v.city||''}"`, `"${v.location||''}"`,
      `"${v.operator_name||''}"`, `"${v.company_name||''}"`, `"${v.operator_mobile_no||''}"`,
      `"${v.verify_status}"`, v.latitude||'', v.longitude||''
    ].join(','));
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `apnibus_visits_${new Date().toISOString().slice(0,10)}.csv`; a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Visit Records
            {lockedEmail && (
              <span className="badge badge-info" style={{ fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Lock size={10} /> Team Scoped ({MANAGER_NAMES[lockedEmail] || lockedEmail})
              </span>
            )}
          </h1>
          <p className="page-subtitle">Showing {filtered.length.toLocaleString()} total visit entries</p>
        </div>
        <button className="btn btn-outline" onClick={exportCSV}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Manager filter (Hidden/Disabled if locked to a single manager) */}
          {!lockedEmail ? (
            <select className="select" style={{ minWidth: 160 }} value={managerEmail} onChange={e => { setManagerEmail(e.target.value); setPage(1); }}>
              <option value="">All Managers</option>
              {managers.map(m => <option key={m.id} value={m.email}>{m.name}</option>)}
            </select>
          ) : (
            <div style={{ fontSize: 12, fontWeight: 700, padding: '6px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={12} /> {MANAGER_NAMES[lockedEmail] || lockedEmail}
            </div>
          )}

          {/* Search BD */}
          <div className="input-with-icon" style={{ flex: 1, minWidth: 180 }}>
            <Search size={14} className="input-icon" />
            <input className="input" placeholder="Search BD name…" value={bdSearch} onChange={e => { setBdSearch(e.target.value); setPage(1); }} />
          </div>

          {/* State */}
          <select className="select" style={{ minWidth: 140 }} value={stateFilter} onChange={e => { setStateFilter(e.target.value); setPage(1); }}>
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Verification Status */}
          <select className="select" style={{ minWidth: 140 }} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="SUCCESS">Verified</option>
            <option value="PENDING">Pending</option>
          </select>

          {/* Date range */}
          <input type="date" className="input" style={{ width: 145 }} value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} />
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>to</span>
          <input type="date" className="input" style={{ width: 145 }} value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} />

          {hasFilters && (
            <button className="btn btn-ghost" onClick={clearFilters} style={{ padding: '8px 12px' }}>
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>BD Candidate</th>
                <th>Manager</th>
                <th>Visit Date</th>
                <th>State &amp; City</th>
                <th>Operator Name</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Photo</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No visit records found matching filters
                  </td>
                </tr>
              ) : (
                paginated.map((v, i) => (
                  <tr key={v.id || i}>
                    <td style={{ color: 'var(--text-faint)', fontSize: 11 }}>{(page - 1) * PER_PAGE + i + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{v.bd_name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{v.manager_name || MANAGER_NAMES[v.manager_email] || 'Manager'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{v.visit_date}</td>
                    <td>
                      <div>{v.city || 'N/A'}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>{v.state || ''}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{v.operator_name || '—'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{v.operator_mobile_no || '—'}</td>
                    <td>
                      <span className={`badge ${v.verify_status === 'SUCCESS' ? 'badge-success' : 'badge-warning'}`}>
                        {v.verify_status === 'SUCCESS' ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      {v.visit_photo ? (
                        <a href={v.visit_photo} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Image size={14} /> View
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-faint)', fontSize: 11 }}>No photo</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Showing {filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1} to {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} entries
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 12px', fontSize: 12 }}>
              Previous
            </button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: 12, fontWeight: 600 }}>
              Page {page} of {totalPages}
            </span>
            <button className="btn btn-outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 12px', fontSize: 12 }}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitTable;
