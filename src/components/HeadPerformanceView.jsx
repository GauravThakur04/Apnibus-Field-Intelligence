import React from 'react';

const money = value => value >= 100000
  ? `₹ ${(value / 100000).toFixed(1)}L`
  : `₹ ${(value / 1000).toFixed(1)}k`;

const Progress = ({ value, color = '#2563eb' }) => (
  <div style={{ height: 5, borderRadius: 99, background: 'var(--border)', overflow: 'hidden', marginTop: 6 }}>
    <div style={{ height: '100%', width: `${Math.min(100, Math.max(0, value))}%`, background: color, borderRadius: 99 }} />
  </div>
);

const HeadPerformanceView = ({ metrics, stats, rmSales }) => {
  const total = key => metrics.reduce((sum, role) => sum + (role[key] || 0), 0);
  const totalTeam = stats.totalCandidates || total('count');
  const overview = {
    key: 'Overview', label: 'Total team', count: totalTeam, activeToday: total('activeToday'),
    mtdVisits: stats.mtdVisits, ftdVisits: stats.todayVisits, cities: stats.coverageCities,
    ftdSales: stats.totalFtdSales, ftdRevenue: stats.totalFtdRevenue, mtdSales: stats.totalMtdSales,
    mtdRevenue: stats.totalMtdRevenue, attendance: stats.avgAttendance,
  };

  const rm = rmSales || { ftdCount: 0, ftdRevenue: 0, mtdCount: 0, mtdRevenue: 0 };

  return (
    <section>
      <div style={{ marginBottom: 12 }}>
        <div className="card-title">Head portal performance</div>
        <div className="card-subtitle">Live attendance, visits, coverage, sales, and revenue by team role</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
        {[overview, ...metrics].map((role, index) => {
          const startedPct = role.count ? Math.round((role.activeToday / role.count) * 100) : 0;
          return (
            <div key={role.key} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', background: index === 0 ? 'rgba(37,99,235,0.08)' : 'var(--bg-input)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{role.label}</div>
                <div style={{ marginTop: 5, fontSize: 23, fontWeight: 900, color: 'var(--text-heading)', fontFamily: 'var(--font-header)' }}>{role.count}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>team members</div>
              </div>
              <div style={{ padding: '6px 16px 12px' }}>
                <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Day started today</span><strong style={{ fontSize: 13 }}>{role.activeToday} / {role.count}</strong></div>
                  <Progress value={startedPct} />
                </div>
                {[
                  ['MTD visits', role.mtdVisits],
                  ['FTD visits', role.ftdVisits],
                  ['Cities covered', role.cities],
                  ['FTD sales / revenue', `${role.ftdSales} · ${money(role.ftdRevenue)}`],
                  ['MTD sales / revenue', `${role.mtdSales} · ${money(role.mtdRevenue)}`],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '9px 0', borderBottom: '1px solid var(--border)', fontSize: 11 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{label}</span><strong style={{ color: 'var(--text-heading)', textAlign: 'right' }}>{value}</strong>
                  </div>
                ))}
                <div style={{ paddingTop: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>MTD attendance</span><strong style={{ fontSize: 13 }}>{role.attendance}%</strong></div>
                  <Progress value={role.attendance} color="#10b981" />
                </div>
              </div>
            </div>
          );
        })}

        {/* RM Combined Sales Card */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', background: 'rgba(245,158,11,0.10)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, color: '#d97706', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>RM Combined Sales</div>
            <div style={{ marginTop: 5, fontSize: 23, fontWeight: 900, color: 'var(--text-heading)', fontFamily: 'var(--font-header)' }}>{rm.mtdCount}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>MTD punches by RH</div>
          </div>
          <div style={{ padding: '6px 16px 12px' }}>
            <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 8, background: 'rgba(245,158,11,0.12)', color: '#d97706', fontWeight: 700 }}>bd_code = 1</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>→ Punched by RH</span>
            </div>
            {[
              ['FTD Sales', rm.ftdCount],
              ['FTD Revenue', money(rm.ftdRevenue)],
              ['MTD Sales', rm.mtdCount],
              ['MTD Revenue', money(rm.mtdRevenue)],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '9px 0', borderBottom: '1px solid var(--border)', fontSize: 11 }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span><strong style={{ color: 'var(--text-heading)', textAlign: 'right' }}>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeadPerformanceView;
