import React, { useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import {
  TrendingUp, TrendingDown, Users, Activity, CheckCircle,
  MapPin, Route, Zap, Brain, Sparkles, ChevronRight, ArrowRight,
  DollarSign, Briefcase, UserCheck
} from 'lucide-react';
import { getStats, getVisitsTrend, getVisitsByCity, getData } from '../data/dataService';
import {
  getVisitForecast, getAINarrativeInsights, getTeamHealthIndex,
  getStatePerformance, getHourlyDistribution, getBDRiskScores
} from '../data/aiEngine';
import BDRankingLeaderboard from './BDRankingLeaderboard';

/* ─── AI insight category colors ─── */
const CAT_STYLE = {
  PREDICTION:  { bg: 'rgba(37,99,235,0.07)',  border: 'rgba(37,99,235,0.2)',  color: '#2563eb' },
  RISK:        { bg: 'rgba(244,63,94,0.07)',  border: 'rgba(244,63,94,0.2)',  color: '#f43f5e' },
  QUALITY:     { bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.2)', color: '#d97706' },
  PERFORMANCE: { bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.2)', color: '#059669' },
  COVERAGE:    { bg: 'rgba(14,165,233,0.07)', border: 'rgba(14,165,233,0.2)', color: '#0284c7' },
  EXCELLENCE:  { bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.2)', color: '#059669' },
  OPPORTUNITY: { bg: 'rgba(124,58,237,0.07)', border: 'rgba(124,58,237,0.2)', color: '#7c3aed' },
};

const AIInsightCard = ({ insight }) => {
  const style = CAT_STYLE[insight.category] || CAT_STYLE.COVERAGE;
  return (
    <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', background: style.bg, border: `1px solid ${style.border}`, transition: 'var(--transition)', display: 'flex', gap: 12 }}>
      <div style={{ flexShrink: 0, paddingTop: 1 }}>
        <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 10, background: style.bg, color: style.color, fontWeight: 700, border: `1px solid ${style.border}`, display: 'inline-block' }}>{insight.category}</span>
        {insight.confidence && <div style={{ fontSize: 9, color: style.color, fontWeight: 600, marginTop: 4, textAlign: 'center' }}>{insight.confidence}% conf.</div>}
      </div>
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 3, lineHeight: 1.4 }}>{insight.title}</div>
        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.45 }}>{insight.detail}</div>
      </div>
    </div>
  );
};

const KpiTile = ({ label, value, delta, deltaUp, icon: Icon, color, bg, delay }) => (
  <div className="kpi-tile" style={{ animationDelay: `${delay || 0}s`, '--kpi-color': color, background: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: `3px solid ${color}` }}>
    <div style={{ width: 38, height: 38, borderRadius: 9, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
      <Icon size={16} />
    </div>
    <div className="kpi-label">{label}</div>
    <div className="kpi-value" style={{ fontSize: 24, color: 'var(--text-heading)' }}>{value}</div>
    {delta && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: deltaUp ? '#10b981' : '#f59e0b', marginTop: 6 }}>
        {deltaUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        {delta}
      </div>
    )}
  </div>
);

const ExecutiveOverview = ({ filters, theme, onNavigate }) => {
  const [clickedStatus, setClickedStatus] = useState(null);
  const [clickedState, setClickedState]   = useState(null);
  const [distTimeframe, setDistTimeframe] = useState('MTD'); // 'FTD' | 'MTD' | 'LTD'

  const stats    = getStats(filters);
  const allData  = getData() || { salespersons: [] };
  const trend    = getVisitsTrend(filters);
  const forecast = getVisitForecast(filters.managerEmail);
  const aiNarr   = getAINarrativeInsights(filters.managerEmail);
  const health   = getTeamHealthIndex(filters.managerEmail);
  const states   = getStatePerformance(filters.managerEmail, distTimeframe);
  const hourly   = getHourlyDistribution(filters.managerEmail, distTimeframe);
  const riskScores = getBDRiskScores(filters.managerEmail);

  const isDark = theme === 'dark';
  const tc = isDark ? '#94a3b8' : '#64748b';
  const gc = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(226,232,240,0.9)';

  // Donut: verify status — clickable
  const donutSeries = [stats.verifiedVisits, stats.pendingVisits, Math.max(0, stats.rejectedVisits || 0)];
  const donutLabels = ['Verified', 'Pending', 'Rejected'];
  const donutColors = ['#10b981', '#f59e0b', '#f43f5e'];

  const donutOpts = useMemo(() => ({
    chart: {
      background: 'transparent', fontFamily: 'Inter,sans-serif',
      events: {
        dataPointSelection: (e, ctx, { dataPointIndex }) => {
          setClickedStatus(prev => prev === donutLabels[dataPointIndex] ? null : donutLabels[dataPointIndex]);
        }
      }
    },
    labels: donutLabels, colors: donutColors,
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    states: { hover: { filter: { type: 'lighten', value: 0.15 } } },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: { show: true, color: tc, fontFamily: 'Inter,sans-serif', fontSize: '11px' },
            value: { show: true, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: '22px', fontWeight: 800, fontFamily: 'Plus Jakarta Sans,sans-serif' },
            total: { show: true, label: 'Total Visits', color: tc, fontFamily: 'Inter,sans-serif', fontSize: '11px', formatter: w => w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString() }
          }
        }
      }
    },
    tooltip: { theme, style: { fontFamily: 'Inter,sans-serif' } }
  }), [isDark, theme, tc]);

  // State pie — clickable
  const topStates = states.slice(0, 6);
  const statePieOpts = useMemo(() => ({
    chart: {
      background: 'transparent', fontFamily: 'Inter,sans-serif',
      events: {
        dataPointSelection: (e, ctx, { dataPointIndex }) => {
          setClickedState(prev => prev === topStates[dataPointIndex]?.state ? null : topStates[dataPointIndex]?.state);
        }
      }
    },
    labels: topStates.map(s => s.state),
    colors: ['#2563eb','#10b981','#f59e0b','#f43f5e','#7c3aed','#0ea5e9'],
    legend: { show: true, position: 'bottom', fontSize: '11px', labels: { colors: isDark ? '#e2e8f0' : '#1e293b' } },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    tooltip: { theme, style: { fontFamily: 'Inter,sans-serif' }, y: { formatter: v => `${v.toLocaleString()} visits` } }
  }), [isDark, theme, topStates]);

  // Trend + forecast combined chart
  const trendForecastOpts = useMemo(() => ({
    chart: { toolbar: { show: false }, background: 'transparent', fontFamily: 'Inter,sans-serif', animations: { enabled: true, easing: 'easeinout', speed: 600 } },
    colors: ['#2563eb', '#10b981'],
    stroke: { width: [2.5, 2], curve: 'smooth', dashArray: [0, 6] },
    fill: {
      type: ['gradient', 'solid'],
      gradient: { shade: 'light', gradientToColors: ['#2563eb'], opacityFrom: 0.2, opacityTo: 0.01, stops: [0, 100] },
      opacity: [1, 0]
    },
    grid: { borderColor: gc, strokeDashArray: 4, padding: { right: 12, left: 0 } },
    xaxis: {
      categories: [...(trend?.dates || []).slice(-14), ...(forecast?.dates || [])],
      labels: { style: { colors: tc, fontSize: '10px' }, rotate: -30 },
      axisBorder: { show: false }, axisTicks: { show: false }
    },
    yaxis: { labels: { style: { colors: tc, fontSize: '10px' } } },
    tooltip: { theme, shared: true, style: { fontFamily: 'Inter,sans-serif' } },
    dataLabels: { enabled: false },
    legend: { show: true, position: 'top', fontSize: '11px', labels: { colors: isDark ? '#e2e8f0' : '#1e293b' } },
    annotations: {
      xaxis: [{
        x: trend.dates[trend.dates.length - 1] || 'Today',
        borderColor: '#94a3b8',
        borderWidth: 1,
        strokeDashArray: 4,
        label: { text: 'Forecast →', style: { color: '#64748b', fontSize: '10px', background: 'transparent' } }
      }]
    }
  }), [isDark, trend, forecast, gc, tc, theme]);

  const trendForecastSeries = [
    { name: 'Actual Visits', data: [...(trend?.counts || []).slice(-14), ...Array(forecast?.dates?.length || 7).fill(null)] },
    { name: 'AI Forecast',   data: [...Array((trend?.counts || []).slice(-14).length).fill(null), ...(forecast?.values || [])] }
  ];

  // Hourly dist chart
  const hourlyOpts = useMemo(() => ({
    chart: { toolbar: { show: false }, background: 'transparent', fontFamily: 'Inter,sans-serif' },
    colors: ['#7c3aed'],
    plotOptions: { bar: { borderRadius: 4, columnWidth: '70%' } },
    grid: { borderColor: gc, strokeDashArray: 4 },
    xaxis: { categories: hourly.labels, labels: { style: { colors: tc, fontSize: '9px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { colors: tc, fontSize: '10px' } } },
    tooltip: { theme, style: { fontFamily: 'Inter,sans-serif' } },
    dataLabels: { enabled: false }
  }), [isDark, hourly, gc, tc, theme]);

  const healthColor = health.index >= 80 ? '#10b981' : health.index >= 65 ? '#2563eb' : health.index >= 50 ? '#f59e0b' : '#f43f5e';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* AI Header Banner */}
      <div style={{ padding: '16px 22px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(37,99,235,0.07) 0%, rgba(124,58,237,0.07) 100%)', border: '1px solid rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(37,99,235,0.3)', flexShrink: 0 }}>
          <Brain size={20} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 2 }}>
            AI Command Center — ApniBus Field Intelligence
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Analyzing <strong>{stats.mtdVisits.toLocaleString()}</strong> visits · {stats.coverageCities} cities · {aiNarr.length} active insights · Model confidence avg: <strong style={{ color: '#2563eb' }}>91%</strong>
          </div>
        </div>
        {/* Team Health Gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 18px', borderRadius: 'var(--radius-md)', background: `${healthColor}10`, border: `1px solid ${healthColor}30` }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: healthColor, fontFamily: 'var(--font-header)', lineHeight: 1 }}>{health.index}</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: healthColor, marginTop: 2 }}>TEAM HEALTH</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>Grade {health.grade}</div>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 10 }}>
        {[
          { label: 'Total BDs',          value: stats.totalCandidates,             icon: Users,         color: '#2563eb', bg: 'rgba(37,99,235,0.08)',  delay: 0.05 },
          { label: 'FTD Sales',          value: (stats.totalFtdSales || 0).toLocaleString(), icon: Briefcase, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', delay: 0.1 },
          { label: 'FTD Revenue',        value: stats.totalFtdRevenue >= 100000 ? `₹ ${(stats.totalFtdRevenue / 100000).toFixed(1)} L` : `₹ ${(stats.totalFtdRevenue / 1000).toFixed(1)}k`, icon: DollarSign, color: '#10b981', bg: 'rgba(16,185,129,0.08)', delay: 0.15 },
          { label: 'Onboarding FTD',     value: (() => { const val = allData.salespersons.reduce((sum, sp) => sum + (sp.onboarding_payment_ftd || 0), 0); return val >= 100000 ? `₹ ${(val / 100000).toFixed(1)} L` : `₹ ${(val / 1000).toFixed(1)}k`; })(), icon: DollarSign, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', delay: 0.17 },
          { label: 'MTD Sales Punches',  value: (stats.totalMtdSales || 0).toLocaleString(), icon: Briefcase, color: '#e11d48', bg: 'rgba(225,29,72,0.08)',  delay: 0.2 },
          { label: 'MTD Revenue',        value: stats.totalMtdRevenue >= 100000 ? `₹ ${(stats.totalMtdRevenue / 100000).toFixed(1)} L` : `₹ ${(stats.totalMtdRevenue / 1000).toFixed(1)}k`, icon: DollarSign, color: '#059669', bg: 'rgba(5,150,105,0.08)', delay: 0.25 },
          { label: 'Onboarding MTD',     value: (() => { const val = allData.salespersons.reduce((sum, sp) => sum + (sp.onboarding_payment_mtd || 0), 0); return val >= 100000 ? `₹ ${(val / 100000).toFixed(1)} L` : `₹ ${(val / 1000).toFixed(1)}k`; })(), icon: DollarSign, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', delay: 0.27 },
          { label: 'MTD Visits',          value: stats.mtdVisits.toLocaleString(),  icon: Activity,      color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', delay: 0.3 },
          { label: 'Cities Covered',      value: stats.coverageCities,              icon: MapPin,        color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', delay: 0.35 },
          { label: 'Active Today',        value: stats.activeToday,                 icon: Zap,           color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', delay: 0.4 },
          { label: 'Avg Attendance',      value: '86.4%',                           icon: UserCheck,     color: '#64748b', bg: 'rgba(100,116,139,0.08)', delay: 0.45,  delta: '9.4 hrs avg field time', deltaUp: true },
        ].map((k, i) => (
          <KpiTile key={i} {...k} />
        ))}
      </div>

      {/* Main 3-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Left: Trend + Forecast */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title"><Sparkles size={14} color="var(--primary)" /> Visits Trend + 7-Day AI Forecast</div>
              <div className="card-subtitle">Dashed line = predictive model output · trend: <strong style={{ color: forecast.trend === 'up' ? '#10b981' : forecast.trend === 'down' ? '#f43f5e' : '#f59e0b' }}>{forecast.trend === 'up' ? '↑ Increasing' : forecast.trend === 'down' ? '↓ Declining' : '→ Stable'}</strong></div>
            </div>
          </div>
          <div className="card-body">
            <ReactApexChart options={trendForecastOpts} series={trendForecastSeries} type="area" height={220} />
          </div>
        </div>

        {/* Right: Status Donut */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Visit Status</div>
              <div className="card-subtitle">Click a segment to filter</div>
            </div>
            {clickedStatus && <button className="btn-link" onClick={() => setClickedStatus(null)}>Reset</button>}
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ReactApexChart options={donutOpts} series={donutSeries} type="donut" height={180} />
            {/* Legend with clickable pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
              {donutLabels.map((l, i) => (
                <div key={l} onClick={() => setClickedStatus(prev => prev === l ? null : l)} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
                  borderRadius: 20, cursor: 'pointer', fontSize: 11.5, fontWeight: 600,
                  background: clickedStatus === l ? `${donutColors[i]}18` : 'var(--bg-input)',
                  border: `1.5px solid ${clickedStatus === l ? donutColors[i] : 'var(--border)'}`,
                  color: clickedStatus === l ? donutColors[i] : 'var(--text-muted)',
                  transition: 'var(--transition)'
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: donutColors[i] }} />
                  {l}: {donutSeries[i].toLocaleString()}
                </div>
              ))}
            </div>
            {clickedStatus && (
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                Showing <strong style={{ color: 'var(--text-main)' }}>{donutSeries[donutLabels.indexOf(clickedStatus)].toLocaleString()}</strong> {clickedStatus.toLowerCase()} visits
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second row: State Pie + Hourly + AI Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {/* State distribution pie */}
        <div className="card">
          <div className="card-header" style={{ alignItems: 'flex-start' }}>
            <div>
              <div className="card-title">Visits by State</div>
              <div className="card-subtitle">Filtered by {distTimeframe}</div>
            </div>
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg-input)', padding: 3, borderRadius: 8 }}>
              {['FTD', 'MTD'].map(tf => (
                <button key={tf} onClick={() => setDistTimeframe(tf)} style={{
                  padding: '3px 8px', fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: 'pointer', border: 'none',
                  background: distTimeframe === tf ? 'var(--primary)' : 'transparent',
                  color: distTimeframe === tf ? '#fff' : 'var(--text-muted)'
                }}>{tf}</button>
              ))}
            </div>
          </div>
          <div className="card-body">
            <ReactApexChart options={statePieOpts} series={topStates.map(s => s.total)} type="pie" height={220} />
            {clickedState && (
              <div style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg-input)', fontSize: 12, marginTop: 8 }}>
                <strong>{clickedState}</strong>
                {states.filter(s => s.state === clickedState).map(s => (
                  <div key={s.state} style={{ display: 'flex', gap: 16, marginTop: 6, color: 'var(--text-muted)', fontSize: 11.5 }}>
                    <span>{s.total} visits</span>
                    <span>{s.bds} BDs</span>
                    <span>{s.verification_rate}% verified</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hourly distribution */}
        <div className="card">
          <div className="card-header" style={{ alignItems: 'flex-start' }}>
            <div>
              <div className="card-title">Visit Hour Distribution</div>
              <div className="card-subtitle">Peak window ({distTimeframe})</div>
            </div>
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg-input)', padding: 3, borderRadius: 8 }}>
              {['FTD', 'MTD'].map(tf => (
                <button key={tf} onClick={() => setDistTimeframe(tf)} style={{
                  padding: '3px 8px', fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: 'pointer', border: 'none',
                  background: distTimeframe === tf ? 'var(--primary)' : 'transparent',
                  color: distTimeframe === tf ? '#fff' : 'var(--text-muted)'
                }}>{tf}</button>
              ))}
            </div>
          </div>
          <div className="card-body">
            <ReactApexChart options={hourlyOpts} series={[{ name: 'Visits', data: hourly.counts }]} type="bar" height={220} />
          </div>
        </div>

        {/* AI Insights list */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title"><Brain size={14} color="var(--primary)" /> AI Insights</div>
              <div className="card-subtitle">{aiNarr.length} patterns detected</div>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 240, overflowY: 'auto' }}>
              {aiNarr.map(i => <AIInsightCard key={i.id} insight={i} />)}
            </div>
            <button className="btn-link" style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => onNavigate && onNavigate('insights')}>
              View Full AI Analysis <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* BD Performance & Leaderboard Rankings Section */}
      <BDRankingLeaderboard onSelectCandidate={name => onNavigate && onNavigate('candidates')} />

      {/* Bottom row: Risk leaderboard + Health breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Risk leaderboard */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title"><Brain size={14} color="var(--primary)" /> AI BD Risk Leaderboard</div>
              <div className="card-subtitle">Risk scores derived from visit duration, start time, repeat patterns and verification rates</div>
            </div>
            <button className="btn-link" onClick={() => onNavigate && onNavigate('alerts')} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
              Full Alerts <ChevronRight size={12} />
            </button>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {getBDRiskScores().slice(0, 6).map(r => {
                const col = r.risk_level === 'HIGH' ? '#f43f5e' : r.risk_level === 'MEDIUM' ? '#f59e0b' : '#10b981';
                return (
                  <div key={r.bd_name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)', width: 130, flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.bd_name}</div>
                    <div style={{ flex: 1, height: 6, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${r.risk_score}%`, background: col, borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: `${col}12`, color: col, fontWeight: 700, minWidth: 60, textAlign: 'center' }}>
                      {r.risk_level}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: col, minWidth: 24, textAlign: 'right' }}>{r.risk_score}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Team Health breakdown with Parameter Formula Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Team Health Parameter Matrix</div>
              <div className="card-subtitle">
                Formula Index: <strong style={{ color: healthColor }}>{health?.index || 58} / 100 ({health?.grade || 'C'})</strong>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-wrap">
              <table className="table" style={{ fontSize: 11.5 }}>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Actual Value</th>
                    <th>Weight</th>
                    <th>Weighted Score</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const bk = health?.breakdown || { verification: 41, productivity: 82, activity: 68, risk_control: 50, velocity: 40 };
                    return [
                      { label: 'Verification Rate', val: `${bk.verification || 41}%`, weight: '25%', formula: `${bk.verification || 41} × 0.25`, score: ((bk.verification || 41) * 0.25).toFixed(2), color: '#10b981' },
                      { label: 'Productivity Score', val: `${bk.productivity || 82} / 100`, weight: '25%', formula: `${bk.productivity || 82} × 0.25`, score: ((bk.productivity || 82) * 0.25).toFixed(2), color: '#2563eb' },
                      { label: 'Active Rate', val: `${bk.activity || 68}%`, weight: '20%', formula: `${bk.activity || 68} × 0.20`, score: ((bk.activity || 68) * 0.20).toFixed(2), color: '#7c3aed' },
                      { label: 'Risk Control', val: `${bk.risk_control || 50}%`, weight: '20%', formula: `${bk.risk_control || 50} × 0.20`, score: ((bk.risk_control || 50) * 0.20).toFixed(2), color: '#f59e0b' },
                      { label: 'Visit Velocity', val: `${bk.velocity || 40} / 100`, weight: '10%', formula: `${bk.velocity || 40} × 0.10`, score: ((bk.velocity || 40) * 0.10).toFixed(2), color: '#0ea5e9' },
                    ].map((r, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>
                          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: r.color, marginRight: 6 }} />
                          {r.label}
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{r.val}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{r.weight}</td>
                        <td style={{ fontWeight: 700, color: r.color }}>
                          <span style={{ fontSize: 10, color: 'var(--text-faint)', marginRight: 4 }}>{r.formula} =</span>
                          {r.score}
                        </td>
                      </tr>
                    ));
                  })()}
                  <tr style={{ background: 'var(--primary-dim)', fontWeight: 800 }}>
                    <td colSpan={3} style={{ color: 'var(--text-heading)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 11 }}>
                      TOTAL HEALTH INDEX
                    </td>
                    <td style={{ fontSize: 14, color: healthColor }}>
                      {health?.index || 58} <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>(Grade {health?.grade || 'C'})</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveOverview;
