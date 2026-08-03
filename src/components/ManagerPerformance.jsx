import React from 'react';
import { getManagerPerformance, getLeaderboardHighlights } from '../data/dataService';
import { Award, Flame, Target, TrendingUp, Users, CheckSquare } from 'lucide-react';

const Sparkline = ({ data = [] }) => {
  if (!data.length) return null;
  const max = Math.max(...data, 1), min = Math.min(...data, 0), range = max - min || 1;
  const W = 80, H = 26, P = 2;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (W - P * 2) + P;
    const y = H - ((v - min) / range) * (H - P * 2) - P;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg className="sparkline-svg">
      <polyline fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
};

const HighlightCard = ({ icon: Icon, color, bg, label, name, sub }) => (
  <div className="card" style={{ padding: '18px 20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
    <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
      <Icon size={20} />
    </div>
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-faint)', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 3 }}>{name}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>
    </div>
  </div>
);

const ManagerPerformance = () => {
  const managers = getManagerPerformance();
  const highlights = getLeaderboardHighlights();
  const totalToday = managers.reduce((a, m) => a + m.today, 0);
  const totalMTD = managers.reduce((a, m) => a + m.mtd, 0);
  const avgVer = Math.round(managers.reduce((a, m) => a + m.verifiedPercent, 0) / (managers.length || 1));

  const colors = ['#2563eb', '#10b981', '#f59e0b'];
  const bgs = ['rgba(37,99,235,0.08)', 'rgba(16,185,129,0.08)', 'rgba(245,158,11,0.08)'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
        {[
          { label: 'Managers', value: managers.length, icon: Users, color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
          { label: "Today's Visits", value: totalToday, icon: Flame, color: '#f43f5e', bg: 'rgba(244,63,94,0.08)' },
          { label: 'MTD Visits', value: totalMTD.toLocaleString(), icon: TrendingUp, color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
          { label: 'Avg Verification', value: `${avgVer}%`, icon: CheckSquare, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
        ].map((t, i) => {
          const Icon = t.icon;
          return (
            <div key={i} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: t.bg, color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 4 }}>{t.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-header)', color: 'var(--text-heading)' }}>{t.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Manager Performance Overview</div>
            <div className="card-subtitle">Ranked by MTD visits</div>
          </div>
        </div>
        <div className="card-body">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Manager</th>
                  <th>Candidates</th>
                  <th>Today Visits</th>
                  <th>MTD Visits</th>
                  <th>MTD Sales</th>
                  <th>MTD Revenue</th>
                  <th>Verified %</th>
                  <th>7-Day Trend</th>
                </tr>
              </thead>
              <tbody>
                {managers.map((m, i) => (
                  <tr key={m.id}>
                    <td>
                      <span style={{ width: 24, height: 24, borderRadius: 6, background: bgs[i % 3], color: colors[i % 3], fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                    </td>
                    <td>
                      <div className="cell-avatar">
                        <div className="avatar-circle" style={{ background: bgs[i % 3], color: colors[i % 3] }}>
                          {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{m.candidates}</td>
                    <td>{m.today}</td>
                    <td>{m.mtd}</td>
                    <td style={{ fontWeight: 700, color: '#f59e0b' }}>{m.mtdSales || 0}</td>
                    <td style={{ fontWeight: 700, color: '#10b981' }}>
                      {m.mtdRevenue >= 100000 ? `₹ ${(m.mtdRevenue / 100000).toFixed(1)} L` : `₹ ${(m.mtdRevenue / 1000).toFixed(1)}k`}
                    </td>
                    <td>
                      <span className={`badge ${m.verifiedPercent >= 50 ? 'badge-success' : 'badge-warning'}`}>
                        <span className="badge-dot" />
                        {m.verifiedPercent}%
                      </span>
                    </td>
                    <td><Sparkline data={m.sparkline} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
        <HighlightCard
          icon={Award} color="#f59e0b" bg="rgba(245,158,11,0.1)"
          label="Best Performance" name={highlights.bestManager.name}
          sub={`${highlights.bestManager.verifiedPercent}% team verification`}
        />
        <HighlightCard
          icon={Flame} color="#f43f5e" bg="rgba(244,63,94,0.08)"
          label="Most Visits (MTD)" name={highlights.mostVisitsCandidate.name}
          sub={`${highlights.mostVisitsCandidate.mtd_visits} visits logged`}
        />
        <HighlightCard
          icon={Target} color="#10b981" bg="rgba(16,185,129,0.08)"
          label="Top Verifier" name={highlights.bestVerifiedCandidate.name}
          sub={`${highlights.bestVerifiedCandidate.verified_percent}% verified rate`}
        />
      </div>
    </div>
  );
};

export default ManagerPerformance;
