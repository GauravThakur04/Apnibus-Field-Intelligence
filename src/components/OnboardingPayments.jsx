import React, { useState, useMemo } from 'react';
import { Filter, Search, DollarSign } from 'lucide-react';
import { getData } from '../data/dataService';

const OnboardingPayments = ({ theme }) => {
  const allData = getData() || { salespersons: [] };
  const [searchTerm, setSearchTerm] = useState('');
  const [filterManager, setFilterManager] = useState('ALL');
  const [filterDate, setFilterDate] = useState('');
  const [timeframe, setTimeframe] = useState('MTD');

  const systemTodayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const DYNAMIC_MTD_MONTH = systemTodayStr.slice(0, 7);


  // Collect ALL punched_orders from all salespersons (sales + onboarding — same revenue data)
  const allOrders = useMemo(() => {
    const orders = [];
    const seen = new Set();
    (allData.salespersons || []).forEach(sp => {
      if (!Array.isArray(sp.punched_orders)) return;
      sp.punched_orders.forEach(o => {
        // Deduplicate by order_id so union entries are not double-counted
        const key = o.order_id ? String(o.order_id) : `${o.date}|${o.payable_amount}|${sp.name}`;
        if (seen.has(key)) return;
        seen.add(key);
        orders.push({
          ...o,
          bd_name: sp.name,
          bd_role: sp.role || 'BD',
          manager_email: sp.manager_email,
          manager_name: sp.manager_name || '',
        });
      });
    });
    return orders.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [allData]);

  // Apply filters
  const filteredOrders = useMemo(() => {
    return allOrders.filter(o => {
      if (filterManager !== 'ALL' && o.manager_email !== filterManager) return false;
      if (searchTerm && !
        (o.bd_name || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(o.operator_name || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(o.company_name || '').toLowerCase().includes(searchTerm.toLowerCase())
      ) return false;
      if (filterDate && o.date !== filterDate) return false;
      if (!filterDate) {
        if (timeframe === 'FTD' && o.date !== systemTodayStr) return false;
        if (timeframe === 'MTD' && !(o.date || '').startsWith(DYNAMIC_MTD_MONTH)) return false;
      }
      return true;
    });
  }, [allOrders, filterManager, searchTerm, filterDate, timeframe, systemTodayStr, DYNAMIC_MTD_MONTH]);

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.payable_amount || 0), 0);
  const uniqueBDs = new Set(filteredOrders.map(o => o.bd_name)).size;
  const totalOrders = filteredOrders.length;

  const managers = [
    { email: 'ALL', name: 'All Managers' },
    { email: 'sonu.mishra@apnibus.com', name: 'Sonu Mishra' },
    { email: 'tarun.kumar@apnibus.com', name: 'Tarun Kumar' },
    { email: 'rajnish.kumar@apnibus.com', name: 'Rajnish Kumar' },
    { email: 'rajwinder.singh@apnibus.com', name: 'Rajwinder Singh' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{
        padding: '22px 28px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#fff',
        boxShadow: '0 8px 24px rgba(16,185,129,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: 21, fontWeight: 900, fontFamily: 'var(--font-header)' }}>Onboarding Payments</div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>All payment orders — filtered & searchable in real-time</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, background: 'rgba(255,255,255,0.15)', padding: '12px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>Revenue</div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-header)' }}>
              {totalRevenue >= 100000 ? `₹${(totalRevenue/100000).toFixed(1)}L` : `₹${(totalRevenue/1000).toFixed(1)}k`}
            </div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>Orders</div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-header)' }}>{totalOrders}</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>Active BDs</div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-header)' }}>{uniqueBDs}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', padding: '14px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={15} color='var(--text-muted)' />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)' }}>Filters</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Timeframe pills */}
          <div style={{ display: 'flex', gap: 4, background: 'var(--bg-input)', padding: 3, borderRadius: 8 }}>
            {['FTD', 'MTD', 'ALL'].map(t => (
              <button key={t}
                onClick={() => { setTimeframe(t); setFilterDate(''); }}
                style={{
                  padding: '5px 12px', border: 'none', borderRadius: 6, fontSize: 11,
                  fontWeight: 700, cursor: 'pointer',
                  background: timeframe === t && !filterDate ? 'var(--bg-card)' : 'transparent',
                  color: timeframe === t && !filterDate ? '#10b981' : 'var(--text-muted)',
                  boxShadow: timeframe === t && !filterDate ? 'var(--shadow-sm)' : 'none'
                }}
              >{t === 'FTD' ? 'Today (FTD)' : t === 'MTD' ? 'Month (MTD)' : 'All Time'}</button>
            ))}
          </div>

          {/* Date filter */}
          <input type="date" className="input" value={filterDate}
            onChange={e => { setFilterDate(e.target.value); setTimeframe('CUSTOM'); }}
            style={{ height: 32, padding: '4px 8px', fontSize: 12, width: 140 }} />
          {filterDate && <button className="btn btn-ghost" onClick={() => { setFilterDate(''); setTimeframe('MTD'); }} style={{ height: 32, fontSize: 11, padding: '0 10px' }}>Clear</button>}

          {/* Manager filter */}
          <select className="input" value={filterManager} onChange={e => setFilterManager(e.target.value)}
            style={{ height: 32, padding: '4px 8px', fontSize: 12, width: 160 }}>
            {managers.map(m => <option key={m.email} value={m.email}>{m.name}</option>)}
          </select>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input" placeholder="Search BD, operator, company..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 30, height: 32, fontSize: 12, width: 220 }} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Payment Records ({filteredOrders.length})</div>
            <div className="card-subtitle">
              Live payment punches from Metabase — same data used for FTD / MTD revenue
              {allOrders.length === 0 && ' · Fetching live data…'}
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="table-wrap">
            <table className="table" style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>BD Name</th>
                  <th>Role</th>
                  <th>Operator</th>
                  <th>Company</th>
                  <th>State</th>
                  <th>Order ID</th>
                  <th>Setup Fee</th>
                  <th>Wallet</th>
                  <th>Payable</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr><td colSpan={11} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>
                    {allOrders.length === 0 ? '⏳ Loading live data… (fetching from Metabase CSV)' : 'No payment records match the selected filters.'}
                  </td></tr>
                ) : filteredOrders.map((o, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{o.date || '—'}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{o.bd_name || '—'}</td>
                    <td><span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'var(--bg-input)', fontWeight: 700 }}>{o.bd_role}</span></td>
                    <td>{o.operator_name || '—'}</td>
                    <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.company_name || '—'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>{o.state || '—'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text-muted)' }}>{(o.order_id || '').toString().slice(0, 18)}</td>
                    <td>₹{(o.setup_fee || 0).toLocaleString()}</td>
                    <td>₹{(o.wallet_amount || 0).toLocaleString()}</td>
                    <td style={{ fontWeight: 800, color: '#10b981' }}>₹{(o.payable_amount || 0).toLocaleString()}</td>
                    <td>
                      <span style={{
                        fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700,
                        background: o.payment_status === 'S' ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
                        color: o.payment_status === 'S' ? '#10b981' : '#f43f5e'
                      }}>{ o.payment_status === 'S' ? 'Success' : o.payment_status || 'N/A'}</span>
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

export default OnboardingPayments;
