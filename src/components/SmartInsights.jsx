import React from 'react';
import { getData, getStats } from '../data/dataService';
import {
  Activity, AlertTriangle, BadgeIndianRupee, CheckCircle2, CircleDollarSign,
  Sparkles, Target, TrendingUp, UsersRound
} from 'lucide-react';

const currency = value => `₹${Math.round(value || 0).toLocaleString('en-IN')}`;

const InsightCard = ({ icon, color, title, text }) => (
  <div style={{ padding: '18px', borderRadius: 'var(--radius-md)', background: `${color}0d`, border: `1px solid ${color}25` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
      <div style={{ width: 32, height: 32, display: 'grid', placeItems: 'center', borderRadius: 9, background: `${color}18`, color }}>{React.createElement(icon, { size: 16 })}</div>
      <span style={{ fontSize: 13, fontWeight: 750, color: 'var(--text-heading)' }}>{title}</span>
    </div>
    <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: 'var(--text-muted)' }}>{text}</p>
  </div>
);

const MetricCard = ({ icon, label, value, note, color }) => (
  <div className="kpi-tile" style={{ '--kpi-color': color, borderTop: `3px solid ${color}` }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, display: 'grid', placeItems: 'center', color, background: `${color}16`, marginBottom: 11 }}>{React.createElement(icon, { size: 17 })}</div>
    <div className="kpi-label">{label}</div>
    <div className="kpi-value" style={{ fontSize: 24 }}>{value}</div>
    <div style={{ marginTop: 6, fontSize: 11.5, color: 'var(--text-muted)' }}>{note}</div>
  </div>
);

const SmartInsights = ({ filters = {} }) => {
  const stats = getStats(filters);
  const { salespersons, managers } = getData();

  let sales = [...salespersons];
  if (filters.managerId) sales = sales.filter(s => s.manager_id === Number(filters.managerId));
  if (filters.salespersonName) sales = sales.filter(s => s.name.toLowerCase() === filters.salespersonName.toLowerCase());
  if (filters.state) sales = sales.filter(s => s.state === filters.state);

  const mtd = (() => {
    const totalSales = sales.reduce((sum, bd) => sum + (bd.mtd_sales || 0), 0);
    const totalRevenue = sales.reduce((sum, bd) => sum + (bd.mtd_revenue || 0), 0);
    const target = sales.reduce((sum, bd) => sum + (bd.july_target_pos || 0), 0);
    const activeSellers = sales.filter(bd => (bd.mtd_sales || 0) > 0);
    const topSeller = [...sales].sort((a, b) => (b.mtd_revenue || 0) - (a.mtd_revenue || 0))[0];
    const zeroSales = sales.filter(bd => (bd.mtd_sales || 0) === 0);
    return {
      totalSales, totalRevenue, target, activeSellers, topSeller, zeroSales,
      achievement: target ? Math.round((totalSales / target) * 100) : 0,
      avgRevenue: totalSales ? Math.round(totalRevenue / totalSales) : 0,
    };
  })();

  const scope = filters.managerId ? managers.find(m => m.id === Number(filters.managerId))?.name || 'selected team' : 'all teams';
  const priorityText = mtd.zeroSales.length
    ? `${mtd.zeroSales.length} BD${mtd.zeroSales.length > 1 ? 's have' : ' has'} no MTD sale. Prioritise ${mtd.zeroSales.slice(0, 3).map(bd => bd.name).join(', ')}${mtd.zeroSales.length > 3 ? ' and others' : ''}.`
    : 'Every BD in this view has recorded at least one MTD sale.';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div className="page-header">
        <div>
          <h2>Smart Insights</h2>
          <p>Actionable month-to-date sales and field-performance signals for {scope}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <MetricCard icon={Target} label="MTD Sales" value={mtd.totalSales.toLocaleString()} note={`${mtd.achievement}% of ${mtd.target.toLocaleString()} sales target`} color="#2563eb" />
        <MetricCard icon={BadgeIndianRupee} label="MTD Revenue" value={currency(mtd.totalRevenue)} note={`Average ${currency(mtd.avgRevenue)} per sale`} color="#059669" />
        <MetricCard icon={UsersRound} label="Active Sellers" value={`${mtd.activeSellers.length}/${sales.length}`} note={`${mtd.zeroSales.length} BD${mtd.zeroSales.length === 1 ? '' : 's'} without an MTD sale`} color="#7c3aed" />
        <MetricCard icon={Activity} label="MTD Field Visits" value={stats.mtdVisits.toLocaleString()} note={`${stats.avgVisitsPerCandidate} visits per BD on average`} color="#ea580c" />
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title"><Sparkles size={16} color="var(--primary)" /> MTD actions to take</div>
            <div className="card-subtitle">These insights use month-to-date sales and visits — not FTD numbers.</div>
          </div>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
            <InsightCard icon={TrendingUp} color="#059669" title="Revenue leader" text={mtd.topSeller && mtd.topSeller.mtd_sales > 0 ? `${mtd.topSeller.name} leads with ${mtd.topSeller.mtd_sales} MTD sales and ${currency(mtd.topSeller.mtd_revenue)} in revenue.` : 'No MTD sales have been recorded in this view yet.'} />
            <InsightCard icon={Target} color="#2563eb" title="Target progress" text={mtd.target ? `${mtd.totalSales} of ${mtd.target} targeted sales are complete (${mtd.achievement}%). ${Math.max(0, mtd.target - mtd.totalSales)} sales remain to meet the target.` : 'No MTD sales target is configured for this view.'} />
            <InsightCard icon={mtd.zeroSales.length ? AlertTriangle : CheckCircle2} color={mtd.zeroSales.length ? '#d97706' : '#059669'} title={mtd.zeroSales.length ? 'Follow-up priority' : 'Seller coverage'} text={priorityText} />
            <InsightCard icon={CheckCircle2} color="#0ea5e9" title="Visit quality" text={`${stats.verificationRate}% of MTD field visits are verified. ${stats.pendingVisits.toLocaleString()} visit${stats.pendingVisits === 1 ? '' : 's'} still need verification.`} />
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 12.5 }}>
        <CircleDollarSign size={17} color="#2563eb" />
        Sales metrics are based on correctly mapped, de-duplicated MTD orders. FTD is intentionally excluded from this page.
      </div>
    </div>
  );
};

export default SmartInsights;
