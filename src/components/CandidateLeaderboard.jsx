import React, { useState, useMemo } from 'react';
import { getCandidatesUnderManager, getStats, getData } from '../data/dataService';
import { UserCheck, Flame, Zap, Percent, Clock } from 'lucide-react';

const CandidateLeaderboard = ({ selectedManagerId, setSelectedManagerId, onSelectCandidate, selectedCandidateName }) => {
  const allData = getData();
  const managers = allData.managers;

  const candidates = useMemo(() => getCandidatesUnderManager(selectedManagerId), [selectedManagerId, allData]);
  const stats = useMemo(() => getStats({ managerId: selectedManagerId }), [selectedManagerId, allData]);

  const kpis = [
    { label: 'Candidates', value: stats.totalCandidates, icon: UserCheck, color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
    { label: "Today's Visits", value: stats.todayVisits, icon: Flame, color: '#f43f5e', bg: 'rgba(244,63,94,0.08)' },
    { label: 'MTD Visits', value: stats.mtdVisits.toLocaleString(), icon: Zap, color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h2>Candidate Leaderboard</h2>
          <p>Click a row to view detailed productivity &amp; daily timeline</p>
        </div>
        <div className="page-actions">
          <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Filter by Manager</label>
          <select className="select" style={{ width: 'auto' }} value={selectedManagerId || ''}
            onChange={e => setSelectedManagerId(e.target.value ? parseInt(e.target.value) : null)}>
            <option value="">All Managers</option>
            {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: k.bg, color: k.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 3 }}>{k.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-header)', color: 'var(--text-heading)' }}>{k.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Performance Ranking</div>
            <div className="card-subtitle">Sorted by MTD visits · {candidates.length} candidates</div>
          </div>
        </div>
        <div className="card-body">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Manager</th>
                  <th>Today</th>
                  <th>MTD</th>
                  <th>Verified %</th>
                  <th>Last Visit</th>
                  <th>Day Start</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((s, i) => (
                  <tr key={s.id} onClick={() => onSelectCandidate(s.name)}
                    className={selectedCandidateName === s.name ? 'row-selected' : ''}
                    style={{ cursor: 'pointer' }}>
                    <td>
                      <span style={{ width: 26, height: 26, borderRadius: 7, background: i < 3 ? 'var(--primary-dim)' : 'var(--bg-input)', color: i < 3 ? 'var(--primary)' : 'var(--text-muted)', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{s.name}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.manager_name.split(' ')[0]}</td>
                    <td>{s.today_visits}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{s.mtd_visits}</td>
                    <td>
                      <span className={`badge ${s.verified_percent >= 50 ? 'badge-success' : 'badge-warning'}`}>
                        <span className="badge-dot" />{s.verified_percent}%
                      </span>
                    </td>
                    <td style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{s.last_visit_time}</td>
                    <td>
                      <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 8, background: 'var(--bg-input)', color: 'var(--text-heading)', fontWeight: 700 }}>
                        ⏰ {s.start_day_time || '--:--'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateLeaderboard;
