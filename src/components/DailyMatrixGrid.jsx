import React, { useState, useMemo } from 'react';
import { Grid, Calendar, Filter, Search, Download, ChevronRight, User, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { getData } from '../data/dataService';

const MANAGERS_LIST = [
  { id: 'ALL', name: 'All Teams (Executive View)', email: 'ALL' },
  { id: '552', name: 'Sonu Mishra (Haryana & NCR)', email: 'sonu.mishra@apnibus.com' },
  { id: '553', name: 'Tarun Kumar (Himachal & North)', email: 'tarun.kumar@apnibus.com' },
  { id: '201', name: 'Rajnish Kumar (Rajasthan & Jharkhand)', email: 'rajnish.kumar@apnibus.com' },
  { id: '554', name: 'Rajwinder Singh (Punjab Region)', email: 'rajwinder.singh@apnibus.com' }
];

const DailyMatrixGrid = ({ globalFilters = {}, initialManager, theme }) => {
  const allData = getData() || { salespersons: [], visits: [], _rawSales: [], _rawOnboarding: [] };

  const systemTodayStr = useMemo(() => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }), []);
  const currentMonthStr = useMemo(() => systemTodayStr.slice(0, 7), [systemTodayStr]);

  const [mode, setMode] = useState('visits'); // 'visits' | 'sales' | 'revenue'
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr); // e.g. '2026-08'
  const [selectedManager, setSelectedManager] = useState(() => {
    if (initialManager) return initialManager;
    if (globalFilters.managerId) {
      const mgr = MANAGERS_LIST.find(m => m.id === String(globalFilters.managerId));
      if (mgr) return mgr.email;
    }
    return 'ALL';
  });
  const [searchBD, setSearchBD] = useState('');

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

  // Filter team BDs according to selected manager
  const teamBDs = useMemo(() => {
    let list = (allData.salespersons || []);
    if (selectedManager !== 'ALL') {
      list = list.filter(s => s && s.manager_email === selectedManager);
    }
    if (searchBD.trim()) {
      const t = searchBD.trim().toLowerCase();
      list = list.filter(s => (s.name || '').toLowerCase().includes(t));
    }
    return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [allData.salespersons, selectedManager, searchBD]);

  // Filter visits for the selected month
  const monthVisits = useMemo(() => {
    return (allData.visits || []).filter(v => (v.visit_date || '').startsWith(selectedMonth));
  }, [allData.visits, selectedMonth]);

  // Filter order records for the selected month
  const monthOrders = useMemo(() => {
    const rawOnboarding = (allData._rawOnboarding || []).map(r => ({ ...r, _source: 'onboarding' }));
    const rawSales = (allData._rawSales || []).map(r => ({ ...r, _source: 'sales' }));
    const combined = [...rawOnboarding, ...rawSales];

    return combined.filter(o => {
      const d = o.created_on ? o.created_on.slice(0, 10) : (o.order_date || '').slice(0, 10);
      return d.startsWith(selectedMonth);
    });
  }, [allData._rawOnboarding, allData._rawSales, selectedMonth]);

  // Build matrix dataset
  const matrixData = useMemo(() => {
    return teamBDs.map(bd => {
      const nameLower = (bd.name || '').toLowerCase().trim();

      // Get visits for this BD
      const bdVisits = monthVisits.filter(v => (v.bd_name || '').toLowerCase().trim() === nameLower);

      // Get orders for this BD
      const bdOrders = monthOrders.filter(o => {
        const bdName = (o.bd_name || o.salesperson_name || o.rm_name || '').toLowerCase().trim();
        return bdName === nameLower || (bd.mobile && (o.mobile || o.bd_code) === bd.mobile);
      });

      // Daily map
      const dailyMap = {};
      monthDays.forEach(({ dateStr }) => {
        if (mode === 'visits') {
          const count = bdVisits.filter(v => v.visit_date === dateStr).length;
          const items = bdVisits.filter(v => v.visit_date === dateStr);
          dailyMap[dateStr] = { val: count, items };
        } else if (mode === 'sales') {
          const count = bdOrders.filter(o => {
            const d = o.created_on ? o.created_on.slice(0, 10) : (o.order_date || '').slice(0, 10);
            return d === dateStr;
          }).reduce((sum, o) => sum + (parseInt(o.num_items || 1, 10) || 1), 0);
          dailyMap[dateStr] = { val: count, items: [] };
        } else {
          // Revenue
          const rev = bdOrders.filter(o => {
            const d = o.created_on ? o.created_on.slice(0, 10) : (o.order_date || '').slice(0, 10);
            return d === dateStr;
          }).reduce((sum, o) => sum + (parseFloat(o.payable_amount || o.wallet_amount || 0) || 0), 0);
          dailyMap[dateStr] = { val: rev, items: [] };
        }
      });

      // MTD Total
      const mtdTotal = Object.values(dailyMap).reduce((sum, d) => sum + d.val, 0);

      return {
        bd,
        dailyMap,
        mtdTotal
      };
    });
  }, [teamBDs, monthVisits, monthOrders, monthDays, mode]);

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
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-heading)', fontFamily: 'var(--font-header)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Grid size={22} color="var(--primary)" /> Daily Team Performance Matrix
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
              Day-by-day attendance &amp; punch tracking for each team member ({selectedMonth})
            </div>
          </div>

          {/* Mode Pill Toggle */}
          <div style={{ display: 'flex', gap: 4, background: 'var(--bg-input)', padding: 4, borderRadius: 10 }}>
            {[
              { id: 'visits', label: 'Visits Matrix ⚡' },
              { id: 'sales', label: 'Sales Punches 💳' },
              { id: 'revenue', label: 'Revenue (₹)' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                style={{
                  padding: '6px 14px', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', transition: 'var(--transition)',
                  background: mode === m.id ? 'var(--bg-card)' : 'transparent',
                  color: mode === m.id ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: mode === m.id ? 'var(--shadow-sm)' : 'none'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Manager Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={14} color="var(--text-muted)" />
            <select
              className="select"
              value={selectedManager}
              onChange={e => setSelectedManager(e.target.value)}
              style={{ fontSize: 12, padding: '6px 12px', minWidth: 200 }}
            >
              {MANAGERS_LIST.map(mgr => (
                <option key={mgr.id} value={mgr.email}>{mgr.name}</option>
              ))}
            </select>
          </div>

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
          <div style={{ width: 200 }} className="input-with-icon">
            <Search size={14} className="input-icon" />
            <input
              className="input"
              placeholder="Search BD name…"
              value={searchBD}
              onChange={e => setSearchBD(e.target.value)}
              style={{ fontSize: 12, paddingLeft: 30 }}
            />
          </div>

          <div style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text-heading)' }}>{teamBDs.length}</strong> BDs · MTD Total: <strong style={{ color: 'var(--primary)' }}>{mode === 'revenue' ? `₹ ${(grandMTDTotal / 1000).toFixed(1)}k` : grandMTDTotal}</strong>
          </div>
        </div>
      </div>

      {/* Spreadsheet Matrix Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', maxHeight: '72vh' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 11.5, fontFamily: 'Inter, sans-serif' }}>
            <thead>
              {/* Daily Sum Header Row */}
              <tr style={{ background: isDark ? 'rgba(30,41,59,0.95)' : '#f8fafc', color: 'var(--text-heading)', fontWeight: 800 }}>
                <th style={{
                  position: 'sticky', left: 0, top: 0, zIndex: 10,
                  background: isDark ? '#1e293b' : '#f1f5f9',
                  padding: '12px 16px', borderBottom: '2px solid var(--border)',
                  borderRight: '2px solid var(--border)', textAlign: 'left', minWidth: 220
                }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {mode.toUpperCase()} TOTAL SUMMARY
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--primary)', marginTop: 2 }}>
                    Team Daily Totals 📊
                  </div>
                </th>

                <th style={{
                  position: 'sticky', top: 0, zIndex: 9,
                  background: isDark ? '#1e293b' : '#f1f5f9',
                  padding: '12px 10px', borderBottom: '2px solid var(--border)',
                  borderRight: '2px solid var(--border)', textAlign: 'center', minWidth: 90,
                  fontSize: 13, color: 'var(--primary)', fontWeight: 900
                }}>
                  {mode === 'revenue' ? `₹ ${(grandMTDTotal / 1000).toFixed(1)}k` : grandMTDTotal}
                </th>

                {monthDays.map(({ dateStr, dayLabel }) => {
                  const dayTotal = dailyTeamTotals[dateStr] || 0;
                  const isToday = dateStr === systemTodayStr;
                  return (
                    <th key={dateStr} style={{
                      position: 'sticky', top: 0, zIndex: 8,
                      background: isToday ? (isDark ? 'rgba(37,99,235,0.25)' : '#e0e7ff') : (isDark ? '#1e293b' : '#f1f5f9'),
                      padding: '10px 8px', borderBottom: '2px solid var(--border)',
                      borderRight: '1px solid var(--border)', textAlign: 'center', minWidth: 44,
                      color: isToday ? '#2563eb' : 'var(--text-heading)', fontWeight: 800
                    }}>
                      <div style={{ fontSize: 12, fontStyle: 'italic', color: dayTotal > 0 ? (isDark ? '#38bdf8' : '#0284c7') : 'var(--text-muted)' }}>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--primary-dim)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11 }}>
                            {(bd.name || 'B')[0]}
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700 }}>{bd.name}</div>
                            <div style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 600 }}>
                              {bd.role || 'BD'} · {bd.state || 'India'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* MTD Total Column */}
                      <td style={{
                        padding: '10px 8px', borderBottom: '1px solid var(--border)',
                        borderRight: '2px solid var(--border)', textAlign: 'center',
                        fontWeight: 800, fontSize: 12, color: mtdTotal > 0 ? 'var(--primary)' : 'var(--text-muted)',
                        background: isDark ? 'rgba(37,99,235,0.06)' : '#f0f7ff'
                      }}>
                        {mode === 'revenue' ? (mtdTotal >= 100000 ? `₹ ${(mtdTotal / 100000).toFixed(1)}L` : `₹ ${(mtdTotal / 1000).toFixed(1)}k`) : mtdTotal}
                      </td>

                      {/* Daily Cells */}
                      {monthDays.map(({ dateStr }) => {
                        const cellData = dailyMap[dateStr] || { val: 0, items: [] };
                        const val = cellData.val;
                        const isToday = dateStr === systemTodayStr;

                        // Pink background for 0 values matching Google Sheet style
                        const cellStyle = val > 0 ? {
                          background: isToday ? (isDark ? 'rgba(37,99,235,0.25)' : '#dbeafe') : (isDark ? 'rgba(16,185,129,0.12)' : '#f0fdf4'),
                          color: isDark ? '#34d399' : '#15803d',
                          fontWeight: 800
                        } : {
                          background: isDark ? 'rgba(244,63,94,0.08)' : '#fce7f3',
                          color: isDark ? '#f43f5e' : '#be185d',
                          fontWeight: 600
                        };

                        return (
                          <td
                            key={dateStr}
                            title={val > 0 ? `${bd.name}: ${val} ${mode} on ${dateStr}` : `${bd.name}: 0 ${mode}`}
                            style={{
                              padding: '8px 4px', borderBottom: '1px solid var(--border)',
                              borderRight: '1px solid var(--border)', textAlign: 'center',
                              fontSize: 11, transition: 'all 0.15s ease', cursor: 'pointer',
                              ...cellStyle
                            }}
                          >
                            {mode === 'revenue' ? (val > 0 ? (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val) : 0) : val}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, fontWeight: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, background: isDark ? 'rgba(16,185,129,0.2)' : '#f0fdf4', border: '1px solid #10b981' }} />
            <span style={{ color: 'var(--text-heading)' }}>Active Field Punches (&gt;0)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, background: '#fce7f3', border: '1px solid #be185d' }} />
            <span style={{ color: 'var(--text-heading)' }}>Zero Activity (0)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, background: '#2563eb' }} />
            <span style={{ color: 'var(--text-heading)' }}>Today Column Highlight</span>
          </div>
        </div>

        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          * Scroll horizontally to view all days of the month. Sticky headers and BD names remain fixed.
        </div>
      </div>
    </div>
  );
};

export default DailyMatrixGrid;
