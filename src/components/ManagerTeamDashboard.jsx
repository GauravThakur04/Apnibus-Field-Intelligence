import React, { useState, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import {
  Users, Activity, CheckCircle, MapPin, Brain, ShieldAlert,
  ShieldCheck, Shield, ChevronRight, Search, Flame, ArrowRight, UserCheck, Calendar, Filter,
  DollarSign, TrendingUp, Briefcase, Zap, Clock
} from 'lucide-react';
import { getData, getStats, getVisitsTrend } from '../data/dataService';
import { getBDRiskScores, getVisitForecast, getAINarrativeInsights, getTeamHealthIndex } from '../data/aiEngine';
import IndividualBDDashboard from './IndividualBDDashboard';

const MANAGER_CONFIGS = {
  'rajnish.kumar@apnibus.com': {
    name: 'Rajnish Kumar',
    title: 'Regional Manager — Rajasthan & Jharkhand',
    color: '#2563eb',
    light: 'rgba(37,99,235,0.08)',
    grad: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
    avatarBg: '#2563eb'
  },
  'tarun.kumar@apnibus.com': {
    name: 'Tarun Kumar',
    title: 'Regional Manager — Himachal, Punjab & North',
    color: '#10b981',
    light: 'rgba(16,185,129,0.08)',
    grad: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
    avatarBg: '#10b981'
  },
  'sonu.mishra@apnibus.com': {
    name: 'Sonu Mishra',
    title: 'Regional Manager — Haryana, Delhi-NCR & Central',
    color: '#f59e0b',
    light: 'rgba(245,158,11,0.08)',
    grad: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
    avatarBg: '#f59e0b'
  }
};

const DEFAULT_CONFIG = {
  name: 'Regional Manager',
  title: 'Field Operations Manager',
  color: '#2563eb',
  light: 'rgba(37,99,235,0.08)',
  grad: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
  avatarBg: '#2563eb'
};

const ManagerTeamDashboard = ({ managerEmail, theme }) => {
  const allData = getData() || { visits: [], salespersons: [], managers: [] };
  const [selectedBDName, setSelectedBDName] = useState(null);
  const [searchBD, setSearchBD] = useState('');

  const cfg = MANAGER_CONFIGS[managerEmail] || MANAGER_CONFIGS['rajnish.kumar@apnibus.com'] || DEFAULT_CONFIG;

  const isDark = theme === 'dark';
  const tc = isDark ? '#94a3b8' : '#64748b';
  const gc = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(226,232,240,0.9)';

  // Strictly filter to this manager
  const mgrVisits = useMemo(() => {
    return (allData?.visits || []).filter(v => v && v.manager_email === managerEmail);
  }, [managerEmail, allData]);

  const mgrBDs = useMemo(() => {
    return (allData?.salespersons || []).filter(s => s && s.manager_email === managerEmail);
  }, [managerEmail, allData]);

  // Aggregate Revenue & Attendance for Team
  const teamRevenue = useMemo(() => {
    return mgrBDs.reduce((acc, s) => acc + (s.mtd_revenue || 0), 0);
  }, [mgrBDs]);

  const teamAvgAttendance = useMemo(() => {
    if (!mgrBDs.length) return 85;
    return Math.round(mgrBDs.reduce((acc, s) => acc + (s.attendance_rate || 85), 0) / mgrBDs.length);
  }, [mgrBDs]);

  const teamSalePunches = useMemo(() => {
    return mgrBDs.reduce((acc, s) => acc + (s.sale_punches || 0), 0);
  }, [mgrBDs]);

  const teamServicePunches = useMemo(() => {
    return mgrBDs.reduce((acc, s) => acc + (s.service_punches || 0), 0);
  }, [mgrBDs]);

  const stats = useMemo(() => {
    const mgrObj = (allData?.managers || []).find(m => m && m.email === managerEmail);
    return getStats({ managerId: mgrObj?.id }) || {
      todayVisits: 0, mtdVisits: 0, verifiedVisits: 0, pendingVisits: 0,
      activeToday: 0, coverageCities: 0, verificationRate: 0
    };
  }, [managerEmail, allData]);

  const trend = useMemo(() => {
    const mgrObj = (allData?.managers || []).find(m => m && m.email === managerEmail);
    const res = getVisitsTrend({ managerId: mgrObj?.id });
    return {
      dates: Array.isArray(res?.dates) ? res.dates : [],
      counts: Array.isArray(res?.counts) ? res.counts : []
    };
  }, [managerEmail, allData]);

  const forecast = useMemo(() => {
    const res = getVisitForecast(managerEmail);
    return {
      dates: Array.isArray(res?.dates) ? res.dates : [],
      values: Array.isArray(res?.values) ? res.values : [],
      trend: res?.trend || 'stable'
    };
  }, [managerEmail]);

  const health = useMemo(() => {
    const res = getTeamHealthIndex(managerEmail);
    return {
      index: res?.index || 58,
      grade: res?.grade || 'C',
      breakdown: res?.breakdown || { verification: 41, productivity: 82, activity: 68, risk_control: 50, velocity: 40 }
    };
  }, [managerEmail]);

  const riskScores = useMemo(() => {
    const res = getBDRiskScores(managerEmail);
    return Array.isArray(res) ? res : [];
  }, [managerEmail]);

  // Combine BD info with risk scores
  const enrichedBDs = useMemo(() => {
    let list = mgrBDs.map(sp => {
      const risk = riskScores.find(r => r && r.bd_name && sp.name && r.bd_name.toLowerCase() === sp.name.toLowerCase());
      return {
        ...sp,
        risk_score: risk?.risk_score ?? 15,
        risk_level: risk?.risk_level ?? 'LOW',
        flags: Array.isArray(risk?.flags) ? risk.flags : []
      };
    }).sort((a, b) => (b.mtd_revenue || 0) - (a.mtd_revenue || 0));

    if (searchBD.trim()) {
      list = list.filter(b => b && b.name && b.name.toLowerCase().includes(searchBD.toLowerCase().trim()));
    }
    return list;
  }, [mgrBDs, riskScores, searchBD]);

  // Bar Chart for BD Visits
  const bdBarOpts = useMemo(() => ({
    chart: { toolbar: { show: false }, background: 'transparent', fontFamily: 'Inter,sans-serif' },
    colors: [cfg.color],
    plotOptions: { bar: { borderRadius: 5, horizontal: false, columnWidth: '55%' } },
    grid: { borderColor: gc, strokeDashArray: 4 },
    xaxis: { categories: enrichedBDs.map(s => (s.name || 'BD').split(' ')[0]), labels: { style: { colors: tc, fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { colors: tc, fontSize: '10px' } } },
    tooltip: { theme },
    dataLabels: { enabled: false }
  }), [cfg, isDark, gc, tc, theme, enrichedBDs]);

  // Donut Chart for Sales vs Service Punches
  const punchDonutOpts = useMemo(() => ({
    chart: { background: 'transparent', fontFamily: 'Inter,sans-serif' },
    labels: ['Sales Punches', 'Service Punches'],
    colors: ['#2563eb', '#7c3aed'],
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    plotOptions: {
      pie: { donut: { size: '70%', labels: {
        show: true,
        value: { show: true, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: '20px', fontWeight: 800, fontFamily: 'Plus Jakarta Sans,sans-serif' },
        total: { show: true, label: 'Total Punches', color: tc, fontFamily: 'Inter,sans-serif', fontSize: '10px', formatter: w => w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString() }
      }}}
    },
    tooltip: { theme }
  }), [isDark, theme, tc]);

  // Trend & Forecast chart
  const trendOpts = useMemo(() => ({
    chart: { toolbar: { show: false }, background: 'transparent', fontFamily: 'Inter,sans-serif' },
    colors: [cfg.color, '#10b981'],
    stroke: { width: [2.5, 2], curve: 'smooth', dashArray: [0, 6] },
    fill: { type: ['gradient', 'solid'], gradient: { opacityFrom: 0.25, opacityTo: 0.01 }, opacity: [1, 0] },
    grid: { borderColor: gc, strokeDashArray: 4 },
    xaxis: {
      categories: [...(trend.dates || []).slice(-10), ...(forecast.dates || []).slice(0, 5)],
      labels: { style: { colors: tc, fontSize: '10px' }, rotate: -30 },
      axisBorder: { show: false }, axisTicks: { show: false }
    },
    yaxis: { labels: { style: { colors: tc, fontSize: '10px' } } },
    tooltip: { theme, shared: true },
    dataLabels: { enabled: false },
    legend: { show: false }
  }), [cfg, isDark, gc, tc, theme, trend, forecast]);

  // If individual BD drilldown is active
  if (selectedBDName) {
    return (
      <IndividualBDDashboard
        bdName={selectedBDName}
        onBack={() => setSelectedBDName(null)}
        theme={theme}
      />
    );
  }

  const healthColor = (health.index || 58) >= 80 ? '#10b981' : (health.index || 58) >= 65 ? '#2563eb' : (health.index || 58) >= 50 ? '#f59e0b' : '#f43f5e';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      
      {/* Exclusive Manager Banner Header */}
      <div style={{ padding: '24px 28px', borderRadius: 'var(--radius-xl)', background: cfg.grad, color: '#fff', boxShadow: `0 8px 24px ${cfg.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ffffff22', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-header)' }}>
            {(cfg.name || 'RM').split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-header)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 10 }}>
              {cfg.name}'s Dashboard
            </div>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 2 }}>
              {cfg.title} · <span style={{ fontFamily: 'monospace' }}>{managerEmail}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', padding: '12px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.8 }}>Team BDs</div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-header)' }}>{mgrBDs.length}</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.8 }}>Team Revenue Generated</div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-header)' }}>₹ {(teamRevenue / 100000).toFixed(1)} L</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.8 }}>Attendance %</div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-header)' }}>{teamAvgAttendance}%</div>
          </div>
        </div>
      </div>

      {/* Team KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
        {[
          { label: 'Team Revenue Generated', val: `₹ ${(teamRevenue / 100000).toFixed(1)} L`, icon: DollarSign, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
          { label: 'Sales Punches', val: `${teamSalePunches.toLocaleString()}`, icon: Briefcase, color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
          { label: 'Service Punches', val: `${teamServicePunches.toLocaleString()}`, icon: Zap, color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
          { label: 'Avg Attendance', val: `${teamAvgAttendance}%`, icon: UserCheck, color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)' },
          { label: 'MTD Visits', val: (stats.mtdVisits || 0).toLocaleString(), icon: Activity, color: cfg.color, bg: cfg.light },
          { label: 'Active Today BDs', val: `${stats.activeToday || 0} / ${mgrBDs.length}`, icon: Users, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: k.bg, color: k.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 3 }}>{k.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-header)', color: 'var(--text-heading)' }}>{k.val}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Member BD Grid */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'var(--font-header)' }}>
              {cfg.name}'s Sales Team ({mgrBDs.length} BDs)
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Click any BD card to open their individual daily activity timeline &amp; profile
            </div>
          </div>

          <div style={{ width: 220 }} className="input-with-icon">
            <Search size={14} className="input-icon" />
            <input className="input" placeholder="Search BD name…" value={searchBD} onChange={e => setSearchBD(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {enrichedBDs.map(sp => {
            const riskColor = sp.risk_level === 'HIGH' ? '#f43f5e' : sp.risk_level === 'MEDIUM' ? '#f59e0b' : '#10b981';
            return (
              <div key={sp.id || sp.name} style={{
                padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)',
                border: '1px solid var(--border)', transition: 'var(--transition)',
                display: 'flex', flexDirection: 'column', gap: 12, position: 'relative'
              }} className="card-hover">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: cfg.light, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
                    {(sp.name || 'B')[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sp.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#10b981', fontWeight: 800, marginTop: 1 }}>
                      Onboarding Payment: {(sp.mtd_revenue || 0) >= 100000 ? `₹ ${((sp.mtd_revenue || 0) / 100000).toFixed(1)} L` : `₹ ${(((sp.mtd_revenue || 0) / 1000)).toFixed(1)}k`}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span style={{ fontSize: 10, padding: '3px 8px', background: 'var(--bg-input)', borderRadius: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
                        ⏰ Day Start: {sp.start_day_time || '--:--'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, background: 'var(--bg-input)', padding: '8px 10px', borderRadius: 8 }}>
                  <div>FTD Sales: <strong style={{ color: (sp.ftd_sales ?? 0) > 0 ? '#10b981' : 'var(--text-faint)' }}>{sp.ftd_sales ?? 0}</strong></div>
                  <div>MTD Sales: <strong style={{ color: '#2563eb' }}>{sp.mtd_sales ?? 0}</strong></div>
                  <div>MTD Visits: <strong style={{ color: '#7c3aed' }}>{sp.mtd_visits ?? 0}</strong></div>
                  <div>MTD Att: <strong style={{ color: '#0ea5e9' }}>{sp.mtd_attendance_pct ?? sp.attendance_rate ?? 85}%</strong></div>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: '7px' }}
                  onClick={() => setSelectedBDName(sp.name)}>
                  View Daily Timeline →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* MTD Visits by BD */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Team Member MTD Visit Breakdown</div>
              <div className="card-subtitle">Comparing total visits logged per BD</div>
            </div>
          </div>
          <div className="card-body">
            <ReactApexChart options={bdBarOpts} series={[{ name: 'MTD Visits', data: enrichedBDs.map(s => s.mtd_visits || 0) }]} type="bar" height={220} />
          </div>
        </div>

        {/* Punches Donut */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Sales vs Service Punches</div>
              <div className="card-subtitle">{cfg.name}'s Team Data</div>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ReactApexChart options={punchDonutOpts} series={[teamSalePunches, teamServicePunches]} type="donut" height={190} />
            <div style={{ display: 'flex', gap: 14, fontSize: 12, marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb' }} />
                <span>Sales: <strong>{teamSalePunches.toLocaleString()}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c3aed' }} />
                <span>Service: <strong>{teamServicePunches.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trend + Forecast & Team Health Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        {/* Trend + Forecast */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Team Visit Trend &amp; 7-Day AI Forecast</div>
              <div className="card-subtitle">Predictive trajectory for {cfg.name}'s team</div>
            </div>
          </div>
          <div className="card-body">
            <ReactApexChart options={trendOpts}
              series={[
                { name: 'Actual Visits', data: [...(trend.counts || []).slice(-10), ...Array(5).fill(null)] },
                { name: 'AI Forecast', data: [...Array((trend.counts || []).slice(-10).length).fill(null), ...(forecast.values || []).slice(0, 5)] }
              ]}
              type="area" height={190} />
          </div>
        </div>

        {/* Team Health Parameter Matrix Table */}
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
              <table className="table" style={{ fontSize: 11 }}>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Actual</th>
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
                          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: r.color, marginRight: 5 }} />
                          {r.label}
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{r.val}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{r.weight}</td>
                        <td style={{ fontWeight: 700, color: r.color }}>
                          <span style={{ fontSize: 9.5, color: 'var(--text-faint)', marginRight: 3 }}>{r.formula} =</span>
                          {r.score}
                        </td>
                      </tr>
                    ));
                  })()}
                  <tr style={{ background: 'var(--primary-dim)', fontWeight: 800 }}>
                    <td colSpan={3} style={{ color: 'var(--text-heading)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 10.5 }}>
                      TOTAL HEALTH INDEX
                    </td>
                    <td style={{ fontSize: 13, color: healthColor }}>
                      {health?.index || 58} <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>(Grade {health?.grade || 'C'})</span>
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

export default ManagerTeamDashboard;
