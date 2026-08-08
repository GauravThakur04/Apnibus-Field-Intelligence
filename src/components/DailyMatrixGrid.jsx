import React, { useState, useMemo } from 'react';
import { Grid, Calendar, Filter, Search, Download, Zap, CreditCard, DollarSign, CheckCircle, Info } from 'lucide-react';
import { getData } from '../data/dataService';

const MANAGERS_LIST = [
  { id: 'ALL', name: 'All Teams (Executive View)', email: 'ALL' },
  { id: '552', name: 'Sonu Mishra (Haryana & NCR)', email: 'sonu.mishra@apnibus.com' },
  { id: '553', name: 'Tarun Kumar (Himachal & North)', email: 'tarun.kumar@apnibus.com' },
  { id: '201', name: 'Rajnish Kumar (Rajasthan & Jharkhand)', email: 'rajnish.kumar@apnibus.com' },
  { id: '554', name: 'Rajwinder Singh (Punjab Region)', email: 'rajwinder.singh@apnibus.com' }
];

const CANONICAL_ALIASES = {
  'amit kumar': 'amit rohilla',
  'neeraj shrivastava': 'neeraj shrivastav',
  'manish bathi': 'manish bhati',
  'sandeep kumar': 'sandip kumar',
  'sukhdev singh': 'sukhdev singh'
};

function normalizeName(val) {
  return String(val || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatToISODate(dateStr) {
  if (!dateStr) return '';
  if (dateStr.includes('T')) return dateStr.split('T')[0];
  if (dateStr.includes(' ')) return dateStr.split(' ')[0];
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  return dateStr;
}

function matchesBD(bd, record) {
  if (!bd || !record) return false;
  const bdNorm = normalizeName(bd.name);

  const recNames = [
    record.bd_name, record.salesperson_name, record.rm_name,
    record.employee_name, record.executive_name, record.bd_full_name
  ].map(normalizeName).filter(Boolean);

  for (const recNorm of recNames) {
    if (bdNorm === recNorm) return true;
    if (CANONICAL_ALIASES[recNorm] && CANONICAL_ALIASES[recNorm] === bdNorm) return true;
    if (CANONICAL_ALIASES[bdNorm] && CANONICAL_ALIASES[bdNorm] === recNorm) return true;
    if (bdNorm.length >= 4 && recNorm.length >= 4 && (bdNorm.includes(recNorm) || recNorm.includes(bdNorm))) return true;
  }

  // Also check mobile match if available
  if (bd.mobile) {
    const bdPhone = String(bd.mobile).replace(/\D/g, '').slice(-10);
    const recPhone = String(record.mobile || record.phone || record.user_id || record.bd_code || '').replace(/\D/g, '').slice(-10);
    if (bdPhone && recPhone && bdPhone.length >= 7 && bdPhone === recPhone) return true;
  }

  return false;
}

const DailyMatrixGrid = ({ globalFilters = {}, initialManager, theme }) => {
  const allData = getData() || { salespersons: [], visits: [], _rawSales: [], _rawOnboarding: [] };

  const systemTodayStr = useMemo(() => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }), []);
  const currentMonthStr = useMemo(() => systemTodayStr.slice(0, 7), [systemTodayStr]);

  const [mode, setMode] = useState('visits'); // 'visits' | 'sales' | 'revenue'
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr); // e.g. '2026-08'
  const [searchBD, setSearchBD] = useState('');

  // Lock manager view if rendered inside a dedicated Manager Portal
  const activeMgrEmail = useMemo(() => {
    if (initialManager && initialManager !== 'ALL') return initialManager;
    if (globalFilters.managerId) {
      const mgr = MANAGERS_LIST.find(m => m.id === String(globalFilters.managerId));
      if (mgr && mgr.email !== 'ALL') return mgr.email;
    }
    return null;
  }, [initialManager, globalFilters]);

  const [selectedManager, setSelectedManager] = useState(() => activeMgrEmail || 'ALL');

  const isDark = theme === 'dark';

  // Calculate days in the selected month
  const monthDays = useMemo(() => {
    const [y, m] = selectedMonth.split('-').map(Number);
    if (!y || !m) return [];
    const daysInMonth = new Date(y, m, 0).getDate();
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dateObj = new Date(y, m - 1, d);
      const dayLabel = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }); // e.g. "1 Aug"
      days.push({ dayNum: d, dateStr, dayLabel });
    }
    return days;
  }, [selectedMonth]);

  // Filter team BDs strictly according to active manager
  const teamBDs = useMemo(() => {
    let list = (allData.salespersons || []);
    const mgrToFilter = activeMgrEmail || selectedManager;

    if (mgrToFilter && mgrToFilter !== 'ALL') {
      list = list.filter(s => s && s.manager_email === mgrToFilter && s.role !== 'ISA');
    }

    if (searchBD.trim()) {
      const t = searchBD.trim().toLowerCase();
      list = list.filter(s => (s.name || '').toLowerCase().includes(t));
    }
    return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [allData.salespersons, activeMgrEmail, selectedManager, searchBD]);

  // Filter visits for the selected month
  const monthVisits = useMemo(() => {
    return (allData.visits || []).filter(v => formatToISODate(v.visit_date).startsWith(selectedMonth));
  }, [allData.visits, selectedMonth]);

  // Filter order records for the selected month
  const monthOrders = useMemo(() => {
    const rawOnboarding = (allData._rawOnboarding || []).map(r => ({ ...r, _source: 'onboarding' }));
    const rawSales = (allData._rawSales || []).map(r => ({ ...r, _source: 'sales' }));
    const combined = [...rawOnboarding, ...rawSales];

    return combined.filter(o => {
      const d = formatToISODate(o.created_on || o.order_date || '');
      return d.startsWith(selectedMonth);
    });
  }, [allData._rawOnboarding, allData._rawSales, selectedMonth]);

  // Build matrix dataset
  const matrixData = useMemo(() => {
    return teamBDs.map(bd => {
      // Get visits for this BD
      const bdVisits = monthVisits.filter(v => matchesBD(bd, v));

      // Get orders for this BD
      const bdOrders = monthOrders.filter(o => matchesBD(bd, o));

      // Daily map
      const dailyMap = {};
      monthDays.forEach(({ dateStr }) => {
        if (mode === 'visits') {
          const items = bdVisits.filter(v => formatToISODate(v.visit_date) === dateStr);
          dailyMap[dateStr] = { val: items.length, items };
        } else if (mode === 'sales') {
          const items = bdOrders.filter(o => formatToISODate(o.created_on || o.order_date) === dateStr);
          const count = items.reduce((sum, o) => sum + (parseInt(o.num_items || 1, 10) || 1), 0);
          dailyMap[dateStr] = { val: count, items };
        } else {
          // Revenue
          const items = bdOrders.filter(o => formatToISODate(o.created_on || o.order_date) === dateStr);
          const rev = items.reduce((sum, o) => sum + (parseFloat(o.payable_amount || o.wallet_amount || o.amount || 0) || 0), 0);
          dailyMap[dateStr] = { val: rev, items };
        }
      });

      // MTD Total
      let mtdTotal = Object.values(dailyMap).reduce((sum, d) => sum + d.val, 0);
      if (selectedMonth === '2026-07' && mtdTotal === 0) {
        if (mode === 'sales') mtdTotal = bd.july_ach_pos_user || 0;
        if (mode === 'revenue') mtdTotal = bd.july_ach_rev_user || 0;
      }

      return {
        bd,
        dailyMap,
        mtdTotal
      };
    });
  }, [teamBDs, monthVisits, monthOrders, monthDays, mode, selectedMonth]);

  // Calculate top daily summary row (Sum of all BDs for each day)
  const dailyTeamTotals = useMemo(() => {
    const totals = {};
    monthDays.forEach(({ dateStr }) => {
      totals[dateStr] = matrixData.reduce((sum, row) => sum + (row.dailyMap[dateStr]?.val || 0), 0);
    });
    return totals;
  }, [monthDays, matrixData]);

  const grandMTDTotal = useMemo(() => {
    return matrixData.reduce((sum, row) => sum + row.mtdTotal, 0);
  }, [matrixData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Header Card */}
      <div className="card" style={{ padding: '20px 24px', background: isDark ? 'var(--bg-card)' : '#ffffff', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-heading)', fontFamily: 'var(--font-header)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Grid size={22} color="#2563eb" /> Daily Team Performance Matrix
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
              Day-by-day punch matrix for {activeMgrEmail ? 'your team members' : 'field executives'} ({selectedMonth})
            </div>
          </div>

          {/* PUNCHY MODE TOGGLE BUTTONS */}
          <div style={{
            display: 'flex', gap: 6, background: isDark ? '#0f172a' : '#e2e8f0', padding: 5, borderRadius: 12,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
          }}>
            {[
              { id: 'visits', label: 'Visits Matrix', icon: Zap, color: '#eab308' },
              { id: 'sales', label: 'Sales Punches', icon: CreditCard, color: '#3b82f6' },
              { id: 'revenue', label: 'Revenue (₹)', icon: DollarSign, color: '#10b981' }
            ].map(m => {
              const Icon = m.icon;
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px', border: 'none', borderRadius: 9, fontSize: 12.5, fontWeight: 800,
                    cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: isActive
                      ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                      : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    boxShadow: isActive ? '0 4px 14px rgba(37,99,235,0.4)' : 'none',
                    transform: isActive ? 'scale(1.03)' : 'scale(1)'
                  }}
                >
                  <Icon size={15} color={isActive ? '#fef08a' : m.color} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Manager Filter Dropdown (Only visible if not locked to single portal) */}
          {!activeMgrEmail && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Filter size={14} color="var(--text-muted)" />
              <select
                className="select"
                value={selectedManager}
                onChange={e => setSelectedManager(e.target.value)}
                style={{ fontSize: 12, padding: '6px 12px', minWidth: 220 }}
              >
                {MANAGERS_LIST.map(mgr => (
                  <option key={mgr.id} value={mgr.email}>{mgr.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Month Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={14} color="var(--text-muted)" />
            <input
              type="month"
              className="input"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              style={{ fontSize: 12, padding: '5px 10px', width: 140 }}
            />
          </div>

          {/* Search BD */}
          <div style={{ width: 220 }} className="input-with-icon">
            <Search size={14} className="input-icon" />
            <input
              className="input"
              placeholder="Search BD name…"
              value={searchBD}
              onChange={e => setSearchBD(e.target.value)}
              style={{ fontSize: 12, paddingLeft: 30 }}
            />
          </div>

          <div style={{ marginLeft: 'auto', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text-heading)' }}>{teamBDs.length}</strong> Team Members · MTD Total: <strong style={{ color: '#2563eb', fontSize: 14 }}>{mode === 'revenue' ? `₹ ${(grandMTDTotal / 1000).toFixed(1)}k` : grandMTDTotal}</strong>
          </div>
        </div>
      </div>

      {/* Spreadsheet Matrix Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
        <div style={{ overflowX: 'auto', maxHeight: '72vh' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 11.5, fontFamily: 'Inter, sans-serif' }}>
            <thead>
              {/* Daily Sum Header Row */}
              <tr style={{ background: isDark ? 'rgba(30,41,59,0.98)' : '#f8fafc', color: 'var(--text-heading)', fontWeight: 800 }}>
                <th style={{
                  position: 'sticky', left: 0, top: 0, zIndex: 10,
                  background: isDark ? '#1e293b' : '#f1f5f9',
                  padding: '12px 16px', borderBottom: '2px solid var(--border)',
                  borderRight: '2px solid var(--border)', textAlign: 'left', minWidth: 230
                }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {mode.toUpperCase()} TOTAL SUMMARY
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 900, color: '#2563eb', marginTop: 2 }}>
                    Team Daily Totals 📊
                  </div>
                </th>

                <th style={{
                  position: 'sticky', top: 0, zIndex: 9,
                  background: isDark ? '#1e293b' : '#f1f5f9',
                  padding: '12px 10px', borderBottom: '2px solid var(--border)',
                  borderRight: '2px solid var(--border)', textAlign: 'center', minWidth: 90,
                  fontSize: 13, color: '#2563eb', fontWeight: 900
                }}>
                  {mode === 'revenue' ? `₹ ${(grandMTDTotal / 1000).toFixed(1)}k` : grandMTDTotal}
                </th>

                {monthDays.map(({ dateStr, dayLabel }) => {
                  const dayTotal = dailyTeamTotals[dateStr] || 0;
                  const isToday = dateStr === systemTodayStr;
                  return (
                    <th key={dateStr} style={{
                      position: 'sticky', top: 0, zIndex: 8,
                      background: isToday ? (isDark ? 'rgba(37,99,235,0.3)' : '#dbeafe') : (isDark ? '#1e293b' : '#f1f5f9'),
                      padding: '10px 8px', borderBottom: '2px solid var(--border)',
                      borderRight: '1px solid var(--border)', textAlign: 'center', minWidth: 46,
                      color: isToday ? '#2563eb' : 'var(--text-heading)', fontWeight: 800
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: dayTotal > 0 ? (isDark ? '#38bdf8' : '#0284c7') : 'var(--text-faint)' }}>
                        {mode === 'revenue' ? (dayTotal >= 1000 ? `${(dayTotal / 1000).toFixed(0)}k` : dayTotal) : dayTotal}
                      </div>
                    </th>
                  );
                })}
              </tr>

              {/* Date Labels Header Row */}
              <tr style={{ background: isDark ? '#0f172a' : '#1e293b', color: '#ffffff', fontWeight: 700 }}>
                <th style={{
                  position: 'sticky', left: 0, top: 46, zIndex: 10,
                  background: isDark ? '#0f172a' : '#1e293b',
                  padding: '10px 16px', borderBottom: '1px solid var(--border)',
                  borderRight: '2px solid var(--border)', textAlign: 'left'
                }}>
                  Team Member Name
                </th>
                <th style={{
                  position: 'sticky', top: 46, zIndex: 9,
                  background: isDark ? '#0f172a' : '#1e293b',
                  padding: '10px 8px', borderBottom: '1px solid var(--border)',
                  borderRight: '2px solid var(--border)', textAlign: 'center'
                }}>
                  MTD Total
                </th>
                {monthDays.map(({ dateStr, dayLabel }) => {
                  const isToday = dateStr === systemTodayStr;
                  return (
                    <th key={dateStr} style={{
                      position: 'sticky', top: 46, zIndex: 8,
                      background: isToday ? '#2563eb' : (isDark ? '#0f172a' : '#1e293b'),
                      padding: '8px 4px', borderBottom: '1px solid var(--border)',
                      borderRight: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', fontSize: 10.5,
                      whiteSpace: 'nowrap'
                    }}>
                      {dayLabel}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {matrixData.length === 0 ? (
                <tr>
                  <td colSpan={monthDays.length + 2} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                    No team members found for the selected filter.
                  </td>
                </tr>
              ) : (
                matrixData.map(({ bd, dailyMap, mtdTotal }, rowIdx) => {
                  const isEven = rowIdx % 2 === 0;
                  const rowBg = isEven ? (isDark ? 'var(--bg-card)' : '#ffffff') : (isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc');

                  return (
                    <tr key={bd.id || bd.name} style={{ background: rowBg }}>
                      {/* BD Name Column (Sticky Left) */}
                      <td style={{
                        position: 'sticky', left: 0, zIndex: 5,
                        background: rowBg, padding: '10px 16px',
                        borderBottom: '1px solid var(--border)', borderRight: '2px solid var(--border)',
                        fontWeight: 700, color: 'var(--text-heading)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(37,99,235,0.12)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                            {(bd.name || 'B')[0]}
                          </div>
                          <div>
                            <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text-heading)' }}>{bd.name}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginTop: 1 }}>
                              <span style={{ color: '#2563eb', fontWeight: 700 }}>{bd.role || 'BD'}</span> · {bd.city || bd.state || 'Haryana'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* MTD Total Column */}
                      <td style={{
                        padding: '10px 8px', borderBottom: '1px solid var(--border)',
                        borderRight: '2px solid var(--border)', textAlign: 'center',
                        fontWeight: 900, fontSize: 12.5, color: mtdTotal > 0 ? '#2563eb' : 'var(--text-muted)',
                        background: isDark ? 'rgba(37,99,235,0.08)' : '#f0f7ff'
                      }}>
                        {mode === 'revenue' ? (mtdTotal >= 100000 ? `₹ ${(mtdTotal / 100000).toFixed(1)}L` : `₹ ${(mtdTotal / 1000).toFixed(1)}k`) : mtdTotal}
                      </td>

                      {/* Daily Cells */}
                      {monthDays.map(({ dateStr }) => {
                        const cellData = dailyMap[dateStr] || { val: 0, items: [] };
                        const val = cellData.val;
                        const isToday = dateStr === systemTodayStr;

                        // Vibrant active cell badge vs elegant subtle neutral dot for 0
                        const cellStyle = val > 0 ? {
                          background: isToday ? (isDark ? 'rgba(37,99,235,0.3)' : '#dbeafe') : (isDark ? 'rgba(16,185,129,0.18)' : '#dcfce7'),
                          color: isDark ? '#34d399' : '#15803d',
                          fontWeight: 900,
                          boxShadow: 'inset 0 0 0 1px rgba(16,185,129,0.3)'
                        } : {
                          background: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
                          color: isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db',
                          fontWeight: 500
                        };

                        return (
                          <td
                            key={dateStr}
                            title={val > 0 ? `${bd.name}: ${val} ${mode} on ${dateStr}` : `${bd.name}: 0 ${mode}`}
                            style={{
                              padding: '8px 4px', borderBottom: '1px solid var(--border)',
                              borderRight: '1px solid var(--border)', textAlign: 'center',
                              fontSize: val > 0 ? 12 : 11, transition: 'all 0.15s ease', cursor: 'pointer',
                              ...cellStyle
                            }}
                          >
                            {mode === 'revenue' ? (val > 0 ? (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val) : '0') : val}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend Footer Card */}
      <div className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 11.5, fontWeight: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, background: '#dcfce7', border: '1px solid #16a34a' }} />
            <span style={{ color: 'var(--text-heading)' }}>Active Field Punches (&gt;0)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, background: '#fafafa', border: '1px solid #d1d5db' }} />
            <span style={{ color: 'var(--text-muted)' }}>Zero Punches (0)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, background: '#2563eb' }} />
            <span style={{ color: 'var(--text-heading)' }}>Today Column Highlight</span>
          </div>
        </div>

        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          * Sticky header &amp; left team column remain fixed while scrolling dates horizontally.
        </div>
      </div>
    </div>
  );
};

export default DailyMatrixGrid;
