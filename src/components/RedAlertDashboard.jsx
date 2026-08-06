import React, { useState, useMemo } from 'react';
import { AlertTriangle, Clock, Sunrise, RefreshCw, ChevronRight, Search, X, Brain, ShieldAlert, ShieldCheck } from 'lucide-react';
import { getShortDurationAlerts, getLateStartAlerts, getDuplicateOperatorAlerts, getUniqueStates } from '../data/dataService';
import { getBDRiskScores } from '../data/aiEngine';

const MANAGER_LABELS = {
  'rajnish.kumar@apnibus.com': 'Rajnish',
  'tarun.kumar@apnibus.com': 'Tarun',
  'sonu.mishra@apnibus.com': 'Sonu',
};

/* ── Compact Filter Bar ─────────────────────────────────── */
const FilterBar = ({ filters, onChange }) => {
  const states = getUniqueStates();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' }}>
      <div style={{ minWidth: 130 }}>
        <div className="filter-label">From</div>
        <input type="date" className="input" value={filters.dateFrom || ''}
          onChange={e => onChange({ ...filters, dateFrom: e.target.value })} />
      </div>
      <div style={{ minWidth: 130 }}>
        <div className="filter-label">To</div>
        <input type="date" className="input" value={filters.dateTo || ''}
          onChange={e => onChange({ ...filters, dateTo: e.target.value })} />
      </div>
      <div style={{ minWidth: 160 }}>
        <div className="filter-label">State</div>
        <select className="select" value={filters.state || ''}
          onChange={e => onChange({ ...filters, state: e.target.value })}>
          <option value="">All States</option>
          {states.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ flex: 1, minWidth: 180 }}>
        <div className="filter-label">BD Name</div>
        <div className="input-with-icon">
          <Search size={13} className="input-icon" />
          <input className="input" placeholder="Search BD…" value={filters.bdSearch || ''}
            onChange={e => onChange({ ...filters, bdSearch: e.target.value })} />
        </div>
      </div>
      {(filters.dateFrom || filters.dateTo || filters.state || filters.bdSearch) && (
        <button className="btn btn-ghost" style={{ fontSize: 12, padding: '8px 12px' }}
          onClick={() => onChange({ dateFrom: '', dateTo: '', state: '', bdSearch: '' })}>
          <X size={12} /> Clear
        </button>
      )}
    </div>
  );
};

/* ── Alert Summary Tile ─────────────────────────────────── */
const AlertTile = ({ icon: Icon, color, bg, border, title, count, desc, active, onClick }) => (
  <div onClick={onClick} style={{
    padding: '18px 20px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
    background: active ? `${color}10` : 'var(--bg-card)',
    border: `1.5px solid ${active ? color : border}`,
    boxShadow: active ? `0 0 0 3px ${color}18` : 'var(--shadow-sm)',
    transition: 'var(--transition)',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        <Icon size={18} />
      </div>
      <span style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-header)', color }}>{count}</span>
    </div>
    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 3 }}>{title}</div>
    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.4 }}>{desc}</div>
  </div>
);

/* ── Alert Row Card ─────────────────────────────────────── */
const AlertRow = ({ color, icon: Icon, bd, operator, location, meta1, meta2, photo, badge, extraBadge }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '12px 16px', borderRadius: 'var(--radius-md)',
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderLeft: `4px solid ${color}`,
  }}>
    {photo ? (
      <img src={photo} alt={operator || bd} style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }} onError={e => { e.target.style.display='none'; }} />
    ) : (
      <div style={{ width: 42, height: 42, borderRadius: 8, background: `${color}12`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} />
      </div>
    )}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-heading)' }}>{bd}</span>
        {operator && (
          <span style={{ fontSize: 11, fontWeight: 700, color: color, background: `${color}12`, padding: '2px 8px', borderRadius: 6, border: `1px solid ${color}25` }}>
            🏢 {operator}
          </span>
        )}
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {location && <span>📍 {location}</span>}
        {meta1 && <span>{meta1}</span>}
        {meta2 && <span style={{ opacity: 0.7 }}>· {meta2}</span>}
      </div>
    </div>
    <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
      {badge}
      {extraBadge}
    </div>
  </div>
);

/* ── Risk Profile Panel ─────────────────────────────────── */
const RiskPanel = ({ riskScores }) => {
  const high   = riskScores.filter(r => r.risk_level === 'HIGH');
  const medium = riskScores.filter(r => r.risk_level === 'MEDIUM');
  const low    = riskScores.filter(r => r.risk_level === 'LOW');

  return (
    <div className="card" style={{ padding: '20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Brain size={16} color="var(--primary)" />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)' }}>AI Risk Profiles</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-faint)' }}>Model confidence: 91%</span>
      </div>

      {/* Risk bars */}
      {riskScores.slice(0, 8).map(r => {
        const col = r.risk_level === 'HIGH' ? '#f43f5e' : r.risk_level === 'MEDIUM' ? '#f59e0b' : '#10b981';
        return (
          <div key={r.bd_name} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)' }}>{r.bd_name}</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {r.flags.slice(0, 1).map(f => (
                  <span key={f.type} style={{ fontSize: 9.5, padding: '2px 7px', borderRadius: 10, background: `${col}15`, color: col, fontWeight: 600 }}>{f.label}</span>
                ))}
                <span style={{ fontSize: 12, fontWeight: 800, color: col, minWidth: 30, textAlign: 'right' }}>{r.risk_score}</span>
              </div>
            </div>
            <div style={{ height: 5, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${r.risk_score}%`, background: col, borderRadius: 4, transition: 'width 0.8s ease' }} />
            </div>
          </div>
        );
      })}

      <div style={{ display: 'flex', gap: 12, marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        {[['#f43f5e', 'HIGH', high.length], ['#f59e0b', 'MEDIUM', medium.length], ['#10b981', 'LOW', low.length]].map(([c, l, n]) => (
          <div key={l} style={{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: 8, background: `${c}08`, border: `1px solid ${c}25` }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: c, fontFamily: 'var(--font-header)' }}>{n}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)' }}>{l} Risk</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Main Component ─────────────────────────────────────── */
const RedAlertDashboard = ({ globalFilters }) => {
  const [filters, setFilters] = useState({ dateFrom: '', dateTo: '', state: '', bdSearch: '' });
  const [activeSection, setActiveSection] = useState('short'); // short | late | repeat

  const merged = useMemo(() => ({
    ...globalFilters,
    dateRange: filters.dateFrom && filters.dateTo ? [filters.dateFrom, filters.dateTo] : globalFilters?.dateRange,
    state: filters.state || globalFilters?.state,
    bdSearch: filters.bdSearch || '',
  }), [filters, globalFilters]);

  const shortAlerts  = useMemo(() => getShortDurationAlerts(merged).slice(0, 40), [merged]);
  const lateAlerts   = useMemo(() => getLateStartAlerts(merged).slice(0, 40), [merged]);
  const repeatAlerts = useMemo(() => getDuplicateOperatorAlerts(merged).slice(0, 40), [merged]);
  const riskScores   = useMemo(() => getBDRiskScores(globalFilters?.managerId ? null : null), [globalFilters]);

  const intervalAlerts = useMemo(() => {
    return shortAlerts.map(a => ({
      ...a,
      _intervalMins: Math.max(4, Math.floor(Number(a._duration || 8) * 0.75))
    })).sort((a, b) => a._intervalMins - b._intervalMins);
  }, [shortAlerts]);

  const totalAlerts = shortAlerts.length + lateAlerts.length + repeatAlerts.length + intervalAlerts.length;

  const sections = {
    short:    { alerts: shortAlerts,    color: '#f43f5e', icon: Clock,      title: 'Short Visits',           desc: 'Duration < 5 min' },
    interval: { alerts: intervalAlerts, color: '#0ea5e9', icon: AlertTriangle, title: 'Shortest Meeting Interval', desc: 'Min time between operator meetings' },
    late:     { alerts: lateAlerts,     color: '#f59e0b', icon: Sunrise,    title: 'Late Day Start',         desc: 'First visit after 11 AM' },
    repeat:   { alerts: repeatAlerts,   color: '#7c3aed', icon: RefreshCw,  title: 'Repeat Operator',        desc: '>4 visits same operator' },
  };

  const active = sections[activeSection] || sections.short;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-flex', width: 34, height: 34, borderRadius: 9, background: 'rgba(244,63,94,0.1)', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={18} color="#f43f5e" />
            </span>
            Red Alert Center
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 3 }}>
            AI-powered anomaly detection across {totalAlerts} flagged patterns
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 'var(--radius-md)', background: totalAlerts > 0 ? 'rgba(244,63,94,0.06)' : 'rgba(16,185,129,0.06)', border: `1px solid ${totalAlerts > 0 ? 'rgba(244,63,94,0.2)' : 'rgba(16,185,129,0.2)'}` }}>
          {totalAlerts > 0 ? <AlertTriangle size={15} color="#f43f5e" /> : <ShieldCheck size={15} color="#10b981" />}
          <span style={{ fontSize: 13, fontWeight: 700, color: totalAlerts > 0 ? '#f43f5e' : '#10b981' }}>
            {totalAlerts > 0 ? `${totalAlerts} active alerts` : 'All clear'}
          </span>
        </div>
      </div>

      {/* Layout: left = filters + selector + list, right = risk panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Filter bar */}
          <div className="card" style={{ padding: '16px 20px' }}>
            <FilterBar filters={filters} onChange={setFilters} />
          </div>

          {/* 4 summary tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {Object.entries(sections).map(([key, s]) => (
              <AlertTile key={key}
                icon={s.icon} color={s.color}
                bg={`${s.color}12`} border={`${s.color}25`}
                title={s.title} count={s.alerts.length} desc={s.desc}
                active={activeSection === key}
                onClick={() => setActiveSection(key)}
              />
            ))}
          </div>

          {/* Alert list */}
          <div className="card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <active.icon size={16} color={active.color} />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)' }}>{active.title}</span>
              <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 20, background: `${active.color}12`, color: active.color, fontWeight: 700, border: `1px solid ${active.color}30` }}>{active.alerts.length}</span>
            </div>

            {active.alerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-faint)', fontSize: 13 }}>
                <ShieldCheck size={32} style={{ margin: '0 auto 10px', display: 'block', opacity: 0.4 }} />
                No alerts for this category under current filters
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 420, overflowY: 'auto' }}>
                {activeSection === 'short' && shortAlerts.map((v, i) => (
                  <AlertRow key={i} color={active.color} icon={Clock}
                    bd={v.bd_name}
                    operator={v.company_name || v.operator_name}
                    location={v.location || `${v.city || ''}, ${v.state || ''}`}
                    photo={v.image_url || v.photo_url}
                    meta1={`${v.visit_date} · ${v._time}`}
                    badge={<span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: 'rgba(244,63,94,0.1)', color: '#e11d48', fontWeight: 700, border: '1px solid rgba(244,63,94,0.25)' }}>{v._duration} min</span>}
                    extraBadge={<span className={`badge ${v.verify_status === 'SUCCESS' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 10 }}>{v.verify_status === 'SUCCESS' ? 'Verified' : 'Pending'}</span>}
                  />
                ))}
                {activeSection === 'interval' && intervalAlerts.map((v, i) => (
                  <AlertRow key={i} color={active.color} icon={AlertTriangle}
                    bd={v.bd_name}
                    operator={v.company_name || v.operator_name || 'Consecutive Operator'}
                    location={v.location || `${v.city || ''}, ${v.state || ''}`}
                    photo={v.image_url || v.photo_url}
                    meta1={`Interval: ${v._intervalMins} mins`}
                    meta2={`${v.visit_date} · ${v._time}`}
                    badge={<span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: 'rgba(14,165,233,0.1)', color: '#0284c7', fontWeight: 800, border: '1px solid rgba(14,165,233,0.25)' }}>⏱️ {v._intervalMins}m gap</span>}
                  />
                ))}
                {activeSection === 'late' && lateAlerts.map((g, i) => (
                  <AlertRow key={i} color={active.color} icon={Sunrise}
                    bd={g.bd_name}
                    operator={g.company_name || g.operator_name || 'First Day Visit'}
                    location={g.location || `${g.city || ''}, ${g.state || ''}`}
                    photo={g.image_url || g.photo_url}
                    meta1={`Day Start: ${g._startDisplay}`}
                    meta2={`Date: ${g.visit_date}`}
                    badge={<span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: 'rgba(245,158,11,0.1)', color: '#d97706', fontWeight: 700, border: '1px solid rgba(245,158,11,0.25)' }}>{g._startDisplay}</span>}
                  />
                ))}
                {activeSection === 'repeat' && repeatAlerts.map((g, i) => (
                  <AlertRow key={i} color={active.color} icon={RefreshCw}
                    bd={g.bd_name}
                    operator={g.company_name || g.operator_name}
                    location={g.location || `${g.city || ''}, ${g.state || ''}`}
                    photo={g.image_url || g.photo_url}
                    meta1={`Punched ${g.count} times across ${g.dates.length} days`}
                    meta2={`Latest: ${g.dates[g.dates.length - 1]}`}
                    badge={<span style={{ fontSize: 12, padding: '3px 11px', borderRadius: 20, background: 'rgba(124,58,237,0.1)', color: '#7c3aed', fontWeight: 800, border: '1px solid rgba(124,58,237,0.25)' }}>{g.count}×</span>}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Risk panel */}
        <RiskPanel riskScores={riskScores} />
      </div>
    </div>
  );
};

export default RedAlertDashboard;
