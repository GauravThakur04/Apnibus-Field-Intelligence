import React from 'react';

const formatMoney = value => value >= 100000
  ? `₹ ${(value / 100000).toFixed(1)}L`
  : `₹ ${(value / 1000).toFixed(1)}k`;

const RoleKpiMatrix = ({ metrics, scope = 'Team' }) => {
  const rows = [
    { label: 'Team count', get: r => r.count },
    { label: 'Day started today', get: r => `${r.activeToday} / ${r.count}` },
    { label: 'MTD visits', get: r => r.mtdVisits.toLocaleString() },
    { label: 'FTD visits', get: r => r.ftdVisits.toLocaleString() },
    { label: 'Cities covered (MTD)', get: r => r.cities.toLocaleString() },
    { label: 'FTD sales / revenue', get: r => `${r.ftdSales} · ${formatMoney(r.ftdRevenue)}` },
    { label: 'MTD sales / revenue', get: r => `${r.mtdSales} · ${formatMoney(r.mtdRevenue)}` },
    { label: 'MTD attendance', get: r => `${r.attendance}%` },
  ];

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="card-header" style={{ paddingBottom: 12 }}>
        <div>
          <div className="card-title">{scope} role performance</div>
          <div className="card-subtitle">Attendance is sourced from day-start records, not from visit count.</div>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="table" style={{ minWidth: 760, margin: 0 }}>
          <thead>
            <tr>
              <th>Metric</th>
              {metrics.map(role => <th key={role.key} style={{ textAlign: 'center' }}>{role.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.label}>
                <td style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{row.label}</td>
                {metrics.map(role => <td key={role.key} style={{ textAlign: 'center', fontWeight: 700 }}>{row.get(role)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleKpiMatrix;
