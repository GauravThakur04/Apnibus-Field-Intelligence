import React, { useState, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Users, TrendingUp, CheckCircle, MapPin, Brain, Zap, AlertTriangle, Star, ChevronRight, Activity, Shield, ShieldAlert, ShieldCheck, Target } from 'lucide-react';
import { getData, getStats, getVisitsTrend } from '../data/dataService';
import { getBDRiskScores, getVisitForecast, getActivityHeatmap, getTeamHealthIndex, getAINarrativeInsights, getStatePerformance } from '../data/aiEngine';

const MANAGER_CONFIG = {
  'rajnish.kumar@apnibus.com': { color: '#2563eb', light: 'rgba(37,99,235,0.08)', grad: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)' },
  'tarun.kumar@apnibus.com':   { color: '#10b981', light: 'rgba(16,185,129,0.08)', grad: 'linear-gradient(135deg, #059669 0%, #34d399 100%)' },
  'sonu.mishra@apnibus.com':   { color: '#f59e0b', light: 'rgba(245,158,11,0.08)',  grad: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)' },
};

/* ── BD Card ── */
const BDCard = ({ sp, color, onSelect, selected }) => {
  const riskColor = sp.risk_level === 'HIGH' ? '#f43f5e' : sp.risk_level === 'MEDIUM' ? '#f59e0b' : '#10b981';
  const riskIcon = sp.risk_level === 'HIGH' ? ShieldAlert : sp.risk_level === 'MEDIUM' ? Shield : ShieldCheck;
  const RiskIcon = riskIcon;
  return (
    <div onClick={() => onSelect(sp)} style={{
      padding: '14px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
      background: selected ? `${color}08` : 'var(--bg-card)',
      border: `1.5px solid ${selected ? color : 'var(--border)'}`,
      boxShadow: selected ? `0 0 0 3px ${color}14` : 'var(--shadow-sm)',
      transition: 'var(--transition)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: selected ? color : 'var(--bg-input)', color: selected ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0, transition: 'var(--transition)' }}>
          {sp.name[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sp.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span className={`badge badge-${sp.status.toLowerCase()}`} style={{ fontSize: 9.5 }}>
              <span className="badge-dot" />{sp.status}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: riskColor }}>
              <RiskIcon size={10} />{sp.risk_level}
            </span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { label: 'MTD', val: sp.mtd_visits, c: color },
          { label: 'Today', val: sp.today_visits, c: 'var(--text-main)' },
          { label: 'Verified', val: `${sp.verified_percent}%`, c: sp.verified_percent >= 50 ? '#10b981' : '#f59e0b' },
          { label: 'Score', val: sp.productivity_score, c: sp.productivity_score >= 80 ? '#10b981' : '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ padding: '7px 8px', borderRadius: 6, background: 'var(--bg-input)' }}>
            <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-faint)', marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: s.c, fontFamily: 'var(--font-header)', lineHeight: 1 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {sp.risk_score !== undefined && (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-faint)', marginBottom: 4 }}>
            <span>Risk Score</span><span style={{ color: riskColor, fontWeight: 700 }}>{sp.risk_score}/100</span>
          </div>
          <div style={{ height: 4, borderRadius: 3, background: 'var(--border)' }}>
            <div style={{ height: '100%', width: `${sp.risk_score}%`, background: riskColor, borderRadius: 3, transition: 'width 0.8s ease' }} />
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Main Manager Dashboard ── */
const ManagerDashboard = ({ theme }) => {
  const allData = getData();
  const [selectedManager, setSelectedManager] = useState(allData.managers[0]);
  const [selectedBD, setSelectedBD] = useState(null);

  const mgr = selectedManager;
  const cfg = MANAGER_CONFIG[mgr.email] || { color: '#2563eb', light: 'rgba(37,99,235,0.08)', grad: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)' };

  const isDark = theme === 'dark';
  const tc = isDark ? '#94a3b8' : '#64748b';
  const gc = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(226,232,240,0.9)';

  // Data for this manager
  const mgrVisits = useMemo(() => allData.visits.filter(v => v.manager_email === mgr.email), [mgr, allData]);
  const mgrSPs    = useMemo(() => allData.salespersons.filter(s => s.manager_email === mgr.email), [mgr, allData]);
  const stats     = useMemo(() => getStats({ managerId: mgr.id }), [mgr]);
  const trend     = useMemo(() => getVisitsTrend({ managerId: mgr.id }), [mgr]);
  const forecast  = useMemo(() => getVisitForecast(mgr.email), [mgr]);
  const heatmap   = useMemo(() => getActivityHeatmap(mgr.email), [mgr]);
  const health    = useMemo(() => getTeamHealthIndex(mgr.email), [mgr]);
  const insights  = useMemo(() => getAINarrativeInsights(mgr.email), [mgr]);
  const riskScores = useMemo(() => getBDRiskScores(mgr.email), [mgr]);
  const statePerf = useMemo(() => getStatePerformance().filter(s => {
    const statesForMgr = [...new Set(mgrVisits.map(v => v.state))];
    return statesForMgr.includes(s.state);
  }), [mgr, mgrVisits]);

  // Merge SP with risk scores
  const enrichedSPs = useMemo(() => mgrSPs.map(sp => {
    const risk = riskScores.find(r => r.bd_name.toLowerCase() === sp.name.toLowerCase());
    return { ...sp, risk_score: risk?.risk_score ?? 0, risk_level: risk?.risk_level ?? 'LOW', flags: risk?.flags ?? [] };
  }).sort((a, b) => b.mtd_visits - a.mtd_visits), [mgrSPs, riskScores]);

  // Bar chart for team visits
  const teamBarOpts = useMemo(() => ({
    chart: { toolbar: { show: false }, background: 'transparent', fontFamily: 'Inter,sans-serif' },
    colors: [cfg.color],
    plotOptions: { bar: { borderRadius: 5, horizontal: false, columnWidth: '65%',
      colors: { ranges: [{ from: 0, to: 10, color: '#f59e0b' }, { from: 11, to: 999, color: cfg.color }] }
    }},
    grid: { borderColor: gc, strokeDashArray: 4 },
    xaxis: { categories: enrichedSPs.map(s => s.name.split(' ')[0]), labels: { style: { colors: tc, fontSize: '10px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { colors: tc, fontSize: '10px' } } },
    tooltip: { theme, style: { fontFamily: 'Inter,sans-serif' }, y: { title: { formatter: () => 'MTD Visits' } } },
    dataLabels: { enabled: false }
  }), [cfg, isDark, gc, tc, theme, enrichedSPs]);

  // Verify donut
  const verDonutOpts = useMemo(() => ({
    chart: { background: 'transparent', fontFamily: 'Inter,sans-serif' },
    labels: ['Verified', 'Pending'],
    colors: ['#10b981', '#f59e0b'],
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    plotOptions: {
      pie: { donut: { size: '68%', labels: {
        show: true,
        value: { show: true, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: '20px', fontWeight: 800, fontFamily: 'Plus Jakarta Sans,sans-serif' },
        total: { show: true, label: 'Visits', color: tc, fontFamily: 'Inter,sans-serif', fontSize: '10px', formatter: w => w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString() }
      }}}
    },
    tooltip: { theme }
  }), [isDark, theme, tc]);

  // Trend chart
  const trendOpts = useMemo(() => ({
    chart: { toolbar: { show: false }, background: 'transparent', fontFamily: 'Inter,sans-serif' },
    colors: [cfg.color, '#10b981'],
    stroke: { width: [2.5, 2], curve: 'smooth', dashArray: [0, 6] },
    fill: { type: ['gradient', 'solid'], gradient: { opacityFrom: 0.2, opacityTo: 0.01 }, opacity: [1, 0] },
    grid: { borderColor: gc, strokeDashArray: 4 },
    xaxis: {
      categories: [...trend.dates.slice(-10), ...forecast.dates.slice(0, 5)],
      labels: { style: { colors: tc, fontSize: '10px' }, rotate: -30 },
      axisBorder: { show: false }, axisTicks: { show: false }
    },
    yaxis: { labels: { style: { colors: tc, fontSize: '10px' } } },
    tooltip: { theme, shared: true },
    dataLabels: { enabled: false },
    legend: { show: false }
  }), [cfg, isDark, gc, tc, theme, trend, forecast]);

  const healthColor = health.index >= 80 ? '#10b981' : health.index >= 65 ? '#2563eb' : health.index >= 50 ? '#f59e0b' : '#f43f5e';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* Manager Selector */}
      <div style={{ display: 'flex', gap: 12 }}>
        {allData.managers.map(m => {
          const c = MANAGER_CONFIG[m.email] || {};
          const isActive = m.email === mgr.email;
          const mSPs = allData.salespersons.filter(s => s.manager_email === m.email).length;
          const mVisits = allData.visits.filter(v => v.manager_email === m.email).length;
          return (
            <div key={m.id} onClick={() => { setSelectedManager(m); setSelectedBD(null); }} style={{
              flex: 1, padding: '16px 18px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
              background: isActive ? c.grad : 'var(--bg-card)',
              border: `1.5px solid ${isActive ? c.color : 'var(--border)'}`,
              color: isActive ? '#fff' : 'var(--text-main)',
              boxShadow: isActive ? `0 6px 20px ${c.color}30` : 'var(--shadow-sm)',
              transition: 'var(--transition)',
            }}>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, fontFamily: 'var(--font-header)' }}>{m.name}</div>
              <div style={{ fontSize: 11, opacity: isActive ? 0.85 : 1, color: isActive ? '#fff' : 'var(--text-muted)', marginBottom: 10 }}>{m.email.split('@')[0]}</div>
              <div style={{ display: 'flex', gap: 14 }}>
                <div><div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7, marginBottom: 2 }}>BDs</div><div style={{ fontSize: 18, fontWeight: 900, fontFamily: 'var(--font-header)' }}>{mSPs}</div></div>
                <div><div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7, marginBottom: 2 }}>Visits</div><div style={{ fontSize: 18, fontWeight: 900, fontFamily: 'var(--font-header)' }}>{mVisits.toLocaleString()}</div></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manager KPI bar */}
      <div style={{ padding: '16px 22px', borderRadius: 'var(--radius-lg)', background: cfg.light, border: `1px solid ${cfg.color}25`, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: cfg.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${cfg.color}30`, flexShrink: 0 }}>
            <Brain size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'var(--font-header)' }}>{mgr.name}'s Team Intelligence</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{enrichedSPs.length} BDs · {mgrVisits.length.toLocaleString()} visits · {stats.coverageCities} cities</div>
          </div>
        </div>
        {[
          { label: 'MTD Visits', val: stats.mtdVisits },
          { label: 'Verified %', val: `${stats.verificationRate}%` },
          { label: 'Active Today', val: stats.activeToday },
          { label: 'High Risk BDs', val: riskScores.filter(r => r.risk_level === 'HIGH').length },
          { label: 'Team Health', val: `${health.index} (${health.grade})` },
        ].map(k => (
          <div key={k.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-faint)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: cfg.color, fontFamily: 'var(--font-header)' }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Main grid: BD cards + charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
        {/* BD grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Team Members</div>
          <div style={{ maxHeight: 600, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4 }}>
            {enrichedSPs.map(sp => (
              <BDCard key={sp.id} sp={sp} color={cfg.color} onSelect={setSelectedBD} selected={selectedBD?.id === sp.id} />
            ))}
          </div>
        </div>

        {/* Charts panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Row 1: Team bar + verify donut */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div className="card">
              <div className="card-header">
                <div><div className="card-title">MTD Visits by BD</div><div className="card-subtitle">Click a bar to select</div></div>
              </div>
              <div className="card-body">
                <ReactApexChart options={teamBarOpts} series={[{ name: 'MTD Visits', data: enrichedSPs.map(s => s.mtd_visits) }]} type="bar" height={180} />
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <div><div className="card-title">Verification</div></div>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <ReactApexChart options={verDonutOpts} series={[stats.verifiedVisits, stats.pendingVisits]} type="donut" height={150} />
                <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /><span style={{ color: 'var(--text-muted)' }}>Verified: {stats.verifiedVisits}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} /><span style={{ color: 'var(--text-muted)' }}>Pending: {stats.pendingVisits}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Trend chart */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Visits Trend + Forecast</div>
                <div className="card-subtitle">AI projection: <strong style={{ color: forecast.trend === 'up' ? '#10b981' : '#f59e0b' }}>{forecast.trend === 'up' ? '↑ Increasing' : forecast.trend === 'down' ? '↓ Declining' : '→ Stable'}</strong></div>
              </div>
            </div>
            <div className="card-body">
              <ReactApexChart options={trendOpts}
                series={[
                  { name: 'Actual', data: [...trend.counts.slice(-10), ...Array(5).fill(null)] },
                  { name: 'Forecast', data: [...Array(trend.counts.slice(-10).length).fill(null), ...forecast.values.slice(0, 5)] }
                ]}
                type="area" height={160} />
            </div>
          </div>

          {/* Team health + AI insights */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Health breakdown */}
            <div className="card" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Target size={14} color={healthColor} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)' }}>Team Health — {health.index}/100</span>
              </div>
              {[
                { label: 'Verification', val: health.breakdown.verification, color: '#10b981' },
                { label: 'Activity',     val: health.breakdown.activity,     color: cfg.color },
                { label: 'Productivity', val: health.breakdown.productivity,  color: '#7c3aed' },
                { label: 'Risk Control', val: health.breakdown.risk_control,  color: '#f59e0b' },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: item.color }}>{item.val}%</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 4, background: 'var(--border)' }}>
                    <div style={{ height: '100%', width: `${item.val}%`, background: item.color, borderRadius: 4, transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* AI insights for this manager */}
            <div className="card" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Brain size={14} color={cfg.color} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)' }}>AI Insights</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto' }}>
                {insights.slice(0, 4).map(ins => (
                  <div key={ins.id} style={{
                    padding: '9px 11px', borderRadius: 8, fontSize: 11.5,
                    background: ins.type === 'alert' ? 'rgba(244,63,94,0.06)' : ins.type === 'positive' ? 'rgba(16,185,129,0.06)' : 'rgba(37,99,235,0.06)',
                    border: `1px solid ${ins.type === 'alert' ? 'rgba(244,63,94,0.2)' : ins.type === 'positive' ? 'rgba(16,185,129,0.2)' : 'rgba(37,99,235,0.2)'}`,
                    color: 'var(--text-main)', lineHeight: 1.45
                  }}>
                    {ins.title}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk table */}
          <div className="card">
            <div className="card-header">
              <div><div className="card-title"><Brain size={14} color={cfg.color} /> Risk Assessment Table</div><div className="card-subtitle">AI-computed per BD</div></div>
            </div>
            <div className="card-body">
              <div className="table-wrap">
                <table className="table" style={{ fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th>BD Name</th>
                      <th>Risk Score</th>
                      <th>Short Visits</th>
                      <th>Late Starts</th>
                      <th>Repeat Ops</th>
                      <th>Verified %</th>
                      <th>Flags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskScores.map(r => {
                      const col = r.risk_level === 'HIGH' ? '#f43f5e' : r.risk_level === 'MEDIUM' ? '#f59e0b' : '#10b981';
                      return (
                        <tr key={r.bd_name}>
                          <td style={{ fontWeight: 600 }}>{r.bd_name}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--border)' }}>
                                <div style={{ height: '100%', width: `${r.risk_score}%`, background: col, borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 800, color: col, minWidth: 28, textAlign: 'right' }}>{r.risk_score}</span>
                            </div>
                          </td>
                          <td>{r.short_visit_pct}%</td>
                          <td>{r.late_start_pct}%</td>
                          <td>{r.repeat_op_pct}%</td>
                          <td style={{ color: r.verification_pct >= 50 ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{r.verification_pct}%</td>
                          <td>
                            <span style={{ padding: '2px 8px', borderRadius: 20, background: `${col}12`, color: col, fontSize: 10, fontWeight: 700 }}>
                              {r.risk_level}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
