import React, { useState, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import {
  Users, Activity, CheckCircle, MapPin, Brain, ShieldAlert,
  ShieldCheck, Shield, ChevronRight, Search, Flame, ArrowRight, UserCheck, Calendar, Filter,
  DollarSign, TrendingUp, Briefcase, Zap, Clock
} from 'lucide-react';
import { getData, getStats, getVisitsTrend, getRoleMetrics, getRMCombinedSales, getRMCombinedSalesByManager } from '../data/dataService';
import { getBDRiskScores, getVisitForecast, getAINarrativeInsights, getTeamHealthIndex } from '../data/aiEngine';
import IndividualBDDashboard from './IndividualBDDashboard';
import HeadPerformanceView from './HeadPerformanceView';

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
  'rajwinder.singh@apnibus.com': {
    name: 'Rajwinder Singh',
    title: 'Regional Head — Punjab Region',
    color: '#8b5cf6',
    light: 'rgba(139,92,246,0.08)',
    grad: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    avatarBg: '#8b5cf6'
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
  const [timeframe, setTimeframe] = useState('FTD'); // 'FTD' | 'MTD' | 'LTD' | 'CUSTOM'
  const [customDate, setCustomDate] = useState('');

  const cfg = MANAGER_CONFIGS[managerEmail] || MANAGER_CONFIGS['rajnish.kumar@apnibus.com'] || DEFAULT_CONFIG;

  const isDark = theme === 'dark';
  const tc = isDark ? '#94a3b8' : '#64748b';
  const gc = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(226,232,240,0.9)';

  const mgrBDs = useMemo(() => {
    return (allData?.salespersons || []).filter(s => s && s.manager_email === managerEmail);
  }, [managerEmail, allData]);

  const mgrBDNames = useMemo(() => {
    return new Set(mgrBDs.map(s => (s.name || '').toLowerCase().trim()));
  }, [mgrBDs]);

  // Filter visits to this manager or any assigned team member
  const mgrVisits = useMemo(() => {
    return (allData?.visits || []).filter(v => {
      if (!v) return false;
      if (v.manager_email === managerEmail) return true;
      if (v.bd_name && mgrBDNames.has((v.bd_name || '').toLowerCase().trim())) return true;
      return false;
    });
  }, [managerEmail, mgrBDNames, allData]);

  // Helper dates derived dynamically from system calendar
  const systemTodayStr = useMemo(() => {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  }, []);
  
  const DYNAMIC_TODAY_DATE = systemTodayStr;
  const DYNAMIC_MTD_MONTH = useMemo(() => systemTodayStr.slice(0, 7), [systemTodayStr]);

  // Aggregate all team orders dynamically from individual candidates
  const rmOrders = useMemo(() => {
    const grouped = getRMCombinedSalesByManager();
    const managerRm = grouped[managerEmail] || { orders: [] };
    return Array.isArray(managerRm.orders) ? managerRm.orders.map(o => ({ ...o, bd_name: 'RM Combined', bd_id: null })) : [];
  }, [managerEmail]);

  const teamOrders = useMemo(() => {
    const orders = [];
    mgrBDs.forEach(s => {
      if (Array.isArray(s.punched_orders)) {
        s.punched_orders.forEach(o => {
          orders.push({ ...o, bd_name: s.name, bd_id: s.id });
        });
      }
    });
    return [...orders, ...rmOrders];
  }, [mgrBDs, rmOrders]);

  // Filter orders according to active timeframe / custom date
  const filteredOrders = useMemo(() => {
    if (customDate) {
      return teamOrders.filter(o => o.date === customDate);
    }
    if (timeframe === 'FTD') {
      return teamOrders.filter(o => o.date === DYNAMIC_TODAY_DATE);
    }
    if (timeframe === 'MTD') {
      return teamOrders.filter(o => o.date && o.date.startsWith(DYNAMIC_MTD_MONTH));
    }
    return teamOrders; // LTD
  }, [teamOrders, timeframe, customDate, DYNAMIC_TODAY_DATE, DYNAMIC_MTD_MONTH]);

  // Filter visits according to active timeframe / custom date
  const filteredVisits = useMemo(() => {
    if (customDate) {
      return mgrVisits.filter(v => v.visit_date === customDate);
    }
    if (timeframe === 'FTD') {
      return mgrVisits.filter(v => v.visit_date === DYNAMIC_TODAY_DATE);
    }
    if (timeframe === 'MTD') {
      return mgrVisits.filter(v => v.visit_date && v.visit_date.startsWith(DYNAMIC_MTD_MONTH));
    }
    return mgrVisits; // LTD
  }, [mgrVisits, timeframe, customDate, DYNAMIC_TODAY_DATE, DYNAMIC_MTD_MONTH]);

  const teamVisitsCount = filteredVisits.length;

  // Dynamic KPI Metrics
  const teamRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + (o.payable_amount || o.wallet_amount || 0), 0);
  }, [filteredOrders]);

  const teamSalePunches = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + (o.num_items || 1), 0);
  }, [filteredOrders]);

  const teamServicePunches = 0; // Cumulative order records are all sales punches

  const teamAvgAttendance = useMemo(() => {
    if (customDate || timeframe === 'FTD') {
      const presentCount = mgrBDs.filter(s => s.attendance_status === 'Present').length;
      if (!mgrBDs.length) return 0;
      return Math.round((presentCount / mgrBDs.length) * 100);
    }
    if (!mgrBDs.length) return 0;
    return Math.round(mgrBDs.reduce((acc, s) => acc + (s.mtd_attendance_pct || 0), 0) / mgrBDs.length);
  }, [mgrBDs, timeframe, customDate]);

  const activeBdsCount = useMemo(() => {
    return mgrBDs.filter(s => s.attendance_status === 'Present').length;
  }, [mgrBDs]);

  const stats = useMemo(() => {
    const mgrObj = (allData?.managers || []).find(m => m && m.email === managerEmail);
    const rawStats = getStats({ managerId: mgrObj?.id }) || {};
    const todayVisits = mgrVisits.filter(v => v.visit_date === DYNAMIC_TODAY_DATE).length;
    const mtdVisits = mgrVisits.filter(v => (v.visit_date || '').startsWith(DYNAMIC_MTD_MONTH)).length;
    return {
      ...rawStats,
      todayVisits,
      mtdVisits,
      activeToday: activeBdsCount
    };
  }, [managerEmail, allData, mgrVisits, DYNAMIC_TODAY_DATE, DYNAMIC_MTD_MONTH, activeBdsCount]);

  const roleMetrics = useMemo(() => {
    const mgrObj = (allData?.managers || []).find(m => m?.email === managerEmail);
    return getRoleMetrics({ managerId: mgrObj?.id });
  }, [allData, managerEmail]);

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

  // Combine BD info with risk scores & dynamic active metrics
  const enrichedBDs = useMemo(() => {
    let list = mgrBDs.map(sp => {
      const risk = riskScores.find(r => r && r.bd_name && sp.name && String(r.bd_name || '').toLowerCase().trim() === String(sp.name || '').toLowerCase().trim());
      const isManager = sp.role === 'Regional Head';
      
      const bdOrders = filteredOrders.filter(o => o.bd_id === sp.id || (o.bd_name && sp.name && String(o.bd_name || '').toLowerCase().trim() === String(sp.name || '').toLowerCase().trim()));
      const activeRevenue = bdOrders.reduce((sum, o) => sum + (o.payable_amount || o.wallet_amount || 0), 0);
      const activeSales = bdOrders.reduce((sum, o) => sum + (o.num_items || 1), 0);

      const bdVisits = filteredVisits.filter(v => String(v.bd_name || '').toLowerCase().trim() === String(sp.name || '').toLowerCase().trim());
      const activeVisits = bdVisits.length;

      return {
        ...sp,
        is_manager: isManager,
        risk_score: risk?.risk_score ?? 15,
        risk_level: risk?.risk_level ?? 'LOW',
        flags: Array.isArray(risk?.flags) ? risk.flags : [],
        activeRevenue,
        activeSales,
        activeVisits
      };
    }).sort((a, b) => {
      if (a.is_manager && !b.is_manager) return -1;
      if (!a.is_manager && b.is_manager) return 1;
      return (b.activeRevenue || 0) - (a.activeRevenue || 0);
    });

    if (searchBD.trim()) {
      list = list.filter(b => b && b.name && String(b.name || '').toLowerCase().includes(String(searchBD || '').toLowerCase().trim()));
    }
    return list;
  }, [mgrBDs, riskScores, searchBD, filteredOrders, filteredVisits]);

  // Deduplicated and stably sorted BDs for the breakdown chart
  const bdChartData = useMemo(() => {
    const map = new Map();
    (enrichedBDs || []).forEach(s => {
      if (!s || !s.name) return;
      const full = String(s.name || 'BD').trim();
      if (!map.has(full)) {
        map.set(full, {
          name: full,
          activeVisits: s.activeVisits || 0,
          mtd_visits: s.mtd_visits || 0
        });
      } else {
        const existing = map.get(full);
        existing.activeVisits += (s.activeVisits || 0);
        existing.mtd_visits += (s.mtd_visits || 0);
      }
    });

    const list = Array.from(map.values());
    // Sort deterministically by full name so bars remain in fixed order and never jump
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [enrichedBDs]);

  // Bar Chart for BD Visits
  const bdBarOpts = useMemo(() => ({
    chart: { toolbar: { show: false }, background: 'transparent', fontFamily: 'Inter,sans-serif', animations: { enabled: false } },
    colors: [cfg.color],
    plotOptions: { bar: { borderRadius: 5, horizontal: false, columnWidth: '55%' } },
    grid: { borderColor: gc, strokeDashArray: 4 },
    xaxis: {
      categories: bdChartData.map(s => {
        const parts = s.name.split(' ');
        return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0];
      }),
      labels: { style: { colors: tc, fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { labels: { style: { colors: tc, fontSize: '10px' } } },
    tooltip: { theme },
    dataLabels: { enabled: false }
  }), [cfg, isDark, gc, tc, theme, bdChartData]);

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
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-header)' }}>
              {teamRevenue >= 100000 ? `₹ ${(teamRevenue / 100000).toFixed(1)} L` : `₹ ${(teamRevenue / 1000).toFixed(1)}k`}
            </div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.8 }}>Attendance %</div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-header)' }}>{teamAvgAttendance}%</div>
          </div>
        </div>
      </div>

      {/* Dynamic Timeframe & Date Filter Switcher Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-card)', padding: '14px 20px', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', flexWrap: 'wrap', gap: 14
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'var(--font-header)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={16} color={cfg.color} />
            Team Metrics Summary
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
            {customDate ? `Showing metrics for selected date: ${customDate}` : `Showing metrics for timeframe: ${timeframe === 'FTD' ? 'Today (FTD)' : 'Month (MTD)'}`}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Custom Date Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>Date Filter:</span>
            <input
              type="date"
              className="input"
              value={customDate}
              onChange={e => {
                setCustomDate(e.target.value);
                setTimeframe('CUSTOM');
              }}
              style={{ width: 140, height: 32, padding: '4px 8px', fontSize: 12 }}
            />
            {customDate && (
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setCustomDate('');
                  setTimeframe('MTD');
                }}
                style={{ padding: '0 8px', height: 32, fontSize: 11, minWidth: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                Clear
              </button>
            )}
          </div>

          <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

          {/* FTD / MTD Toggle Pills */}
          <div style={{ display: 'flex', gap: 4, background: 'var(--bg-input)', padding: 3, borderRadius: 8 }}>
            {[
              { id: 'FTD', label: 'FTD (Today)' },
              { id: 'MTD', label: 'MTD (Month)' }
            ].map(pill => {
              const isActive = timeframe === pill.id && !customDate;
              return (
                <button
                  key={pill.id}
                  onClick={() => {
                    setCustomDate('');
                    setTimeframe(pill.id);
                  }}
                  style={{
                    padding: '5px 12px', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700,
                    cursor: 'pointer', transition: 'var(--transition)',
                    background: isActive ? 'var(--bg-card)' : 'transparent',
                    color: isActive ? cfg.color : 'var(--text-muted)',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>


      {/* Role-based Performance Grid (Head portal style) */}
      <HeadPerformanceView metrics={roleMetrics} stats={stats} rmSales={getRMCombinedSales()} />

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
            const isManager = sp.role === 'Regional Head';
            
            return (
              <div key={sp.id || sp.name} style={{
                padding: '16px', borderRadius: 'var(--radius-lg)', 
                background: isManager ? (isDark ? 'rgba(30, 41, 59, 0.65)' : 'rgba(239, 246, 255, 0.95)') : 'var(--bg-card)',
                border: isManager ? `2px solid ${cfg.color}` : '1px solid var(--border)', 
                transition: 'var(--transition)',
                display: 'flex', flexDirection: 'column', gap: 12, position: 'relative'
              }} className="card-hover">
                {isManager && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    fontSize: '9px', fontWeight: 800, padding: '3px 8px',
                    borderRadius: '20px', background: cfg.color, color: '#fff',
                    textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}>
                    Manager
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: cfg.light, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
                    {(sp.name || 'B')[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sp.name}
                    </div>
                    {!isManager && (
                      <div style={{ fontSize: 11, color: '#10b981', fontWeight: 800, marginTop: 1 }}>
                        {customDate ? 'Onboarding (Date)' : timeframe === 'FTD' ? 'Onboarding (Today)' : 'Onboarding (MTD)'}: {sp.activeRevenue >= 100000 ? `₹ ${(sp.activeRevenue / 100000).toFixed(1)} L` : `₹ ${(sp.activeRevenue / 1000).toFixed(1)}k`}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                      {!isManager && (
                        <span style={{ fontSize: 10, padding: '3px 8px', background: 'var(--bg-input)', borderRadius: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
                          ⏰ Day Start: {sp.start_day_time || '--:--'}
                        </span>
                      )}
                      <span style={{
                        fontSize: 9, padding: '2px 6px',
                        background: isManager ? 'rgba(59, 130, 246, 0.15)' : 'rgba(100, 116, 139, 0.08)',
                        color: isManager ? '#2563eb' : 'var(--text-muted)',
                        borderRadius: 6, fontWeight: 800, textTransform: 'uppercase'
                      }}>
                        {sp.role || sp.designation || 'BD'}
                      </span>
                    </div>
                  </div>
                </div>

                {isManager ? (
                  <>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.45, padding: '10px 12px', background: isDark ? 'rgba(15, 23, 42, 0.3)' : '#f1f5f9', borderRadius: 8, fontStyle: 'italic' }}>
                      Supervises daily regional field visits, performs live attendance checks, and reviews payment attribution.
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, background: 'var(--bg-input)', padding: '8px 10px', borderRadius: 8 }}>
                      <div>Active Sales: <strong style={{ color: '#10b981' }}>{sp.activeSales || 0}</strong></div>
                      <div>MTD Sales: <strong style={{ color: '#7c3aed' }}>{sp.mtd_sales || 0}</strong></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, background: 'var(--bg-input)', padding: '8px 10px', borderRadius: 8 }}>
                      <div>Active Sales: <strong style={{ color: '#10b981' }}>{sp.activeSales || 0}</strong></div>
                      <div>Active Visits: <strong style={{ color: '#2563eb' }}>{sp.activeVisits || 0}</strong></div>
                      <div>MTD Sales: <strong style={{ color: '#7c3aed' }}>{sp.mtd_sales || 0}</strong></div>
                      <div>MTD Visits: <strong style={{ color: '#0ea5e9' }}>{sp.mtd_visits || 0}</strong></div>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: '7px' }}
                      onClick={() => setSelectedBDName(sp.name)}>
                      View Daily Timeline →
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* FTD / MTD Visits by BD */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Team Member {timeframe === 'FTD' ? 'FTD' : 'MTD'} Visit Breakdown</div>
              <div className="card-subtitle">Comparing total visits logged per BD ({timeframe === 'FTD' ? 'Today' : 'Month'})</div>
            </div>
          </div>
          <div className="card-body">
            <ReactApexChart
              options={bdBarOpts}
              series={[{
                name: timeframe === 'FTD' ? 'Today Visits' : 'MTD Visits',
                data: bdChartData.map(s => timeframe === 'FTD' ? s.activeVisits : s.mtd_visits)
              }]}
              type="bar"
              height={220}
            />
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
