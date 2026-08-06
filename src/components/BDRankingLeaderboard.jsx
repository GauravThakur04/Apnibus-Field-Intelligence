import React, { useState, useMemo } from 'react';
import {
  Trophy, Award, Flame, Search, ArrowUpRight, User, CheckCircle,
  Briefcase, Calendar, Clock, Zap, ShieldAlert, ShieldCheck, Filter, TrendingUp, DollarSign
} from 'lucide-react';
import { getData } from '../data/dataService';
import { getBDRiskScores } from '../data/aiEngine';

const BDRankingLeaderboard = ({ managerId = null, onSelectCandidate }) => {
  const allData = getData() || { salespersons: [] };
  const [rankBy, setRankBy] = useState('mtd_sales'); // mtd_sales | ftd_sales | mtd_visits | attendance
  const [searchQuery, setSearchQuery] = useState('');

  const riskScores = useMemo(() => getBDRiskScores(), []);

  // Filter salespersons (optionally by managerId if in single-manager view)
  const salespersons = useMemo(() => {
    let list = (allData.salespersons || []).map(sp => {
      const risk = riskScores.find(r => r && r.bd_name && sp.name && r.bd_name.toLowerCase() === sp.name.toLowerCase());
      return {
        ...sp,
        risk_score: risk?.risk_score ?? 15,
        risk_level: risk?.risk_level ?? 'LOW'
      };
    });

    if (managerId) {
      list = list.filter(s => s.manager_id === managerId);
    }

    if (searchQuery.trim()) {
      list = list.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) || s.manager_name?.toLowerCase().includes(searchQuery.toLowerCase().trim()));
    }

    // Sort based on active ranking criteria
    return list.sort((a, b) => {
      if (rankBy === 'mtd_sales') return (b.mtd_sales || 0) - (a.mtd_sales || 0);
      if (rankBy === 'ftd_sales') return (b.ftd_sales || 0) - (a.ftd_sales || 0);
      if (rankBy === 'attendance') return (b.attendance_rate || 0) - (a.attendance_rate || 0);
      return (b.mtd_visits || 0) - (a.mtd_visits || 0); // default mtd_visits
    });
  }, [allData, managerId, rankBy, searchQuery, riskScores]);

  // Format currency helper (Exact Indian Rupee Format)
  const fmtCurr = (val) => {
    if (!val) return '₹ 0';
    if (val >= 10000000) return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹ ${(val / 100000).toFixed(1)} L`;
    return `₹ ${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="card" style={{ padding: '24px 28px' }}>
      {/* Leaderboard Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, fontFamily: 'var(--font-header)', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(245,158,11,0.12)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={18} />
            </span>
            BD Performance, Sales &amp; Revenue Leaderboard
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
            Matched FTD (Today) and MTD (Month) Sales &amp; Revenue across {salespersons.length} field agents
          </div>
        </div>

        {/* Ranking Criteria Toggle Pills */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg-input)', padding: 4, borderRadius: 10, flexWrap: 'wrap' }}>
          {[
            { id: 'mtd_sales', label: 'MTD Sales & Revenue', icon: Briefcase },
            { id: 'ftd_sales', label: 'FTD Sales (Today)', icon: Zap },
            { id: 'mtd_visits', label: 'MTD Visits', icon: Flame },
            { id: 'attendance', label: 'Attendance %', icon: Calendar },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = rankBy === tab.id;
            return (
              <button key={tab.id} onClick={() => setRankBy(tab.id)} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 11.5, fontWeight: 700,
                background: isActive ? 'var(--bg-card)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                transition: 'var(--transition)'
              }}>
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input Bar */}
      <div style={{ marginBottom: 16, maxWidth: 300 }} className="input-with-icon">
        <Search size={14} className="input-icon" />
        <input className="input" placeholder="Filter candidate by name…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      {/* Leaderboard Table */}
      <div className="table-wrap">
        <table className="table" style={{ fontSize: 12.5 }}>
          <thead>
            <tr>
              <th style={{ width: 60, textAlign: 'center' }}>Rank</th>
              <th>Field Candidate Name</th>
              <th>Manager</th>
              <th style={{ textAlign: 'center' }}>Day Start</th>
              <th style={{ textAlign: 'center' }}>FTD Sales &amp; Onboarding Payment</th>
              <th style={{ textAlign: 'center' }}>MTD Sales &amp; Onboarding Payment</th>
              <th style={{ textAlign: 'center' }}>MTD Visits</th>
              <th style={{ textAlign: 'center' }}>MTD Att %</th>
              <th style={{ textAlign: 'center' }}>AI Risk</th>
            </tr>
          </thead>
          <tbody>
            {salespersons.map((sp, index) => {
              const rank = index + 1;
              const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
              const medalBg = rank === 1 ? 'rgba(245,158,11,0.15)' : rank === 2 ? 'rgba(148,163,184,0.15)' : rank === 3 ? 'rgba(180,83,9,0.15)' : 'var(--bg-input)';
              const medalColor = rank === 1 ? '#d97706' : rank === 2 ? '#64748b' : rank === 3 ? '#b45309' : 'var(--text-muted)';
              const riskColor = sp.risk_level === 'HIGH' ? '#f43f5e' : sp.risk_level === 'MEDIUM' ? '#f59e0b' : '#10b981';

              return (
                <tr key={sp.id || sp.name} style={{ cursor: onSelectCandidate ? 'pointer' : 'default' }}
                  onClick={() => onSelectCandidate && onSelectCandidate(sp.name)}>
                  
                  {/* Rank Badge */}
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-flex', width: 28, height: 28, borderRadius: '50%',
                      background: medalBg, color: medalColor, fontWeight: 900,
                      alignItems: 'center', justifyContent: 'center', fontSize: rank <= 3 ? 14 : 11.5
                    }}>
                      {medalEmoji}
                    </span>
                  </td>

                  {/* Candidate Name & Initials */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-dim)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                        {(sp.name || 'B')[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{sp.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>ID: #{sp.user_id || sp.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Manager Tag */}
                  <td>
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 12, background: 'var(--bg-input)', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {sp.manager_name?.split(' ')[0] || 'Manager'}
                    </span>
                  </td>

                  {/* Day Start Time */}
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 10, background: 'var(--bg-input)', color: 'var(--text-heading)', fontWeight: 700 }}>
                      ⏰ {sp.start_day_time || '--:--'}
                    </span>
                  </td>

                  {/* FTD Sales & Revenue (Today) */}
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, color: (sp.ftd_sales || 0) > 0 ? '#10b981' : 'var(--text-faint)' }}>
                      {sp.ftd_sales || 0} Sales
                    </div>
                    <div style={{ fontSize: 10.5, color: '#10b981', fontWeight: 700 }}>
                      {fmtCurr(sp.ftd_revenue)}
                    </div>
                  </td>

                  {/* MTD Sales & Revenue (Month) */}
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, color: '#2563eb' }}>
                      {sp.mtd_sales || 0} Sales
                    </div>
                    <div style={{ fontSize: 10.5, color: '#2563eb', fontWeight: 700 }}>
                      {fmtCurr(sp.mtd_revenue)}
                    </div>
                  </td>

                  {/* MTD Visits */}
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{sp.mtd_visits || 0}</span>
                  </td>

                  {/* Attendance Rate */}
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontWeight: 800, color: '#0ea5e9' }}>{sp.mtd_attendance_pct ?? sp.attendance_rate ?? 85}%</span>
                  </td>

                  {/* AI Risk Rating */}
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: `${riskColor}12`, color: riskColor, fontWeight: 800, border: `1px solid ${riskColor}30` }}>
                      {sp.risk_level || 'LOW'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BDRankingLeaderboard;
