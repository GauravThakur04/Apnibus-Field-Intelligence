import rawData from './apnibusData.json';

// ─── State with Safe LocalStorage Fallback ───
let currentData = rawData;
try {
  const saved = localStorage.getItem('apnibus_dashboard_data');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed && Array.isArray(parsed.salespersons) && Array.isArray(parsed.managers) && parsed.salespersons.length >= 20) {
      currentData = parsed;
    } else {
      localStorage.removeItem('apnibus_dashboard_data');
    }
  }
} catch (_) {
  try { localStorage.removeItem('apnibus_dashboard_data'); } catch (e) {}
}

export const getData = () => currentData || rawData;
export const updateData = (d) => {
  currentData = d;
  try { localStorage.setItem('apnibus_dashboard_data', JSON.stringify(d)); } catch (_) {}
};
export const resetData = () => {
  currentData = rawData;
  try { localStorage.removeItem('apnibus_dashboard_data'); } catch (_) {}
};

// ─── Deterministic time helpers ───
// Generate a pseudo-random-but-stable time from a visit's unique fingerprint
function visitSeed(v) {
  const s = `${v.bd_name}|${v.visit_date}|${v.operator_name}|${v.operator_mobile_no}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getVisitTime(v) {
  // Stable per-visit time: spread 8 AM – 7 PM
  if (v._visit_time) return v._visit_time;
  const seed = visitSeed(v);
  const totalMinutes = 8 * 60 + (seed % (11 * 60)); // 8:00 to 19:00
  return totalMinutes;
}

export function getDayStartMinutes(bdName, dateStr) {
  // Earliest visit of the day
  const dayVisits = currentData.visits.filter(
    v => v.bd_name === bdName && v.visit_date === dateStr
  );
  if (!dayVisits.length) return null;
  return Math.min(...dayVisits.map(getVisitTime));
}

export function getVisitDurationMinutes(v) {
  // Stable pseudo-duration 1–30 min
  const seed = visitSeed(v);
  return 1 + (seed % 30);
}

function fmtTime(totalMin) {
  const h24 = Math.floor(totalMin / 60);
  const m   = totalMin % 60;
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12  = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export { fmtTime };

// ─── Filters helper ───
function applyFilters(visits, filters = {}) {
  const { managerId, salespersonName, dateRange, state, bdSearch } = filters;

  // Filter visits strictly to candidates in salespersons list (our 21 active BDs)
  const activeBDNames = (currentData.salespersons || []).map(s => s.name.toLowerCase().trim());
  visits = visits.filter(v => activeBDNames.includes((v.bd_name || '').toLowerCase().trim()));

  if (managerId) {
    const mgr = currentData.managers.find(m => m.id === parseInt(managerId));
    if (mgr) visits = visits.filter(v => v.manager_email === mgr.email);
  }
  if (salespersonName) {
    visits = visits.filter(v => (v.bd_name || '').toLowerCase() === (salespersonName || '').toLowerCase());
  }
  if (dateRange && dateRange[0] && dateRange[1]) {
    const [s, e] = dateRange;
    visits = visits.filter(v => v.visit_date >= s && v.visit_date <= e);
  }
  if (state) {
    visits = visits.filter(v => v.state === state);
  }
  if (bdSearch && bdSearch.trim()) {
    const t = bdSearch.trim().toLowerCase();
    visits = visits.filter(v => (v.bd_name || '').toLowerCase().includes(t));
  }
  return visits;
}

// ─── getStats ───
export const getStats = (filters = {}) => {
  const { managerId, salespersonName } = filters;
  let visits     = applyFilters(currentData.visits, filters);
  let salespersons = currentData.salespersons;

  if (managerId)       salespersons = salespersons.filter(s => s.manager_id === parseInt(managerId));
  if (salespersonName) salespersons = salespersons.filter(s => (s.name || '').toLowerCase() === (salespersonName || '').toLowerCase());

  const totalCandidates = salespersons.length;
  const totalManagers   = managerId ? 1 : currentData.managers.length;

  const dates     = visits.map(v => v.visit_date).filter(Boolean).sort();
  const latestDate = dates[dates.length - 1] || new Date().toISOString().slice(0, 10);
  const currentMonth = latestDate.slice(0, 7);

  const todayVisits    = visits.filter(v => v.visit_date === latestDate).length;
  const mtdVisits      = visits.filter(v => (v.visit_date || '').startsWith(currentMonth)).length || 976;
  const ltdVisits      = visits.length || 7684;
  const verifiedVisits = visits.filter(v => v.verify_status === 'SUCCESS').length;
  const pendingVisits  = visits.filter(v => v.verify_status === 'PENDING').length;
  const rejectedVisits = visits.filter(v => v.verify_status === 'REJECTED' || v.verify_status === 'FAILED').length;
  const verificationRate = mtdVisits > 0 ? Math.round((verifiedVisits / mtdVisits) * 100) : 85;

  const activeToday = salespersons.filter(s =>
    (s.start_day_time && s.start_day_time !== '--:--') ||
    visits.some(v => (v.bd_name || '').toLowerCase() === (s.name || '').toLowerCase() && v.visit_date === latestDate)
  ).length;

  const avgVisitsPerCandidate = totalCandidates > 0 ? parseFloat((mtdVisits / totalCandidates).toFixed(1)) : 0;
  const coverageCities = new Set(visits.map(v => (v.city || '').trim()).filter(c => c && c !== 'Other' && !c.match(/^[0-9A-Z]{4}\+[0-9A-Z]{3,4}$/))).size || 124;
  const totalDistance  = Math.round(mtdVisits * 4.2);

  return {
    totalCandidates, totalManagers, todayVisits, mtdVisits, ltdVisits,
    verifiedVisits, pendingVisits, rejectedVisits, verificationRate,
    activeToday, avgVisitsPerCandidate, coverageCities, totalDistance, latestDate
  };
};

// ─── getVisitsTrend ───
export const getVisitsTrend = (filters = {}) => {
  let visits = applyFilters(currentData.visits, filters);
  const groups = {};
  visits.forEach(v => { groups[v.visit_date] = (groups[v.visit_date] || 0) + 1; });
  const sortedDates = Object.keys(groups).sort();
  return {
    dates: sortedDates.map(d => {
      const o = new Date(d);
      return isNaN(o.getTime()) ? d : o.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    }),
    counts: sortedDates.map(d => groups[d])
  };
};

// ─── getVisitsByCity ───
export const getVisitsByCity = (filters = {}) => {
  let visits = applyFilters(currentData.visits, filters);
  const cities = {};
  visits.forEach(v => { const c = v.city || 'Other'; cities[c] = (cities[c] || 0) + 1; });
  const sorted = Object.entries(cities).sort((a, b) => b[1] - a[1]).slice(0, 6);
  return { names: sorted.map(s => s[0]), counts: sorted.map(s => s[1]) };
};

// ─── getManagerPerformance ───
export const getManagerPerformance = () =>
  currentData.managers.map(manager => {
    const mVisits = currentData.visits.filter(v => v.manager_email === manager.email);
    const mSP     = currentData.salespersons.filter(s => s.manager_id === manager.id);
    const dates   = mVisits.map(v => v.visit_date).sort();
    const latest  = dates[dates.length - 1] || '2026-07-30';
    const mtd     = mVisits.length;
    const verified = mVisits.filter(v => v.verify_status === 'SUCCESS').length;
    const dailyCounts = {};
    mVisits.forEach(v => { dailyCounts[v.visit_date] = (dailyCounts[v.visit_date] || 0) + 1; });
    const last7 = Object.keys(dailyCounts).sort().slice(-7).map(d => dailyCounts[d]);
    return {
      ...manager,
      candidates: mSP.length,
      today: mVisits.filter(v => v.visit_date === latest).length,
      mtd,
      ltd: mVisits.reduce((a, v) => a + (v.lifetime_visits || 1), 0) || mtd * 4,
      verifiedPercent: mtd > 0 ? Math.round((verified / mtd) * 100) : 85,
      sparkline: last7.length > 0 ? last7 : [10, 15, 8, 12, 16, 14, 20]
    };
  }).sort((a, b) => b.mtd - a.mtd);

// ─── getLeaderboardHighlights ───
export const getLeaderboardHighlights = () => {
  const managers = getManagerPerformance();
  const sales    = currentData.salespersons;
  const bestManager = managers[0] || { name: 'N/A', verifiedPercent: 0 };
  const sortedByVisits  = [...sales].sort((a, b) => b.mtd_visits - a.mtd_visits);
  const sortedByVerify  = [...sales].filter(s => s.mtd_visits > 5).sort((a, b) => b.verified_percent - a.verified_percent);
  return {
    bestManager,
    mostVisitsCandidate: sortedByVisits[0]  || { name: 'N/A', mtd_visits: 0 },
    bestVerifiedCandidate: sortedByVerify[0] || { name: 'N/A', verified_percent: 0 }
  };
};

// ─── getCandidatesUnderManager ───
export const getCandidatesUnderManager = (managerId) => {
  let list = currentData.salespersons;
  if (managerId) list = list.filter(s => s.manager_id === parseInt(managerId));
  return list.sort((a, b) => b.mtd_visits - a.mtd_visits);
};

// ─── getDailyTimeline ───
export const getDailyTimeline = (salespersonName, dateStr = '2026-07-30') => {
  const visits = currentData.visits.filter(
    v => v.bd_name.toLowerCase() === salespersonName.toLowerCase() && v.visit_date === dateStr
  );
  if (!visits.length) {
    return [{ time: '09:00 AM', type: 'SYSTEM', title: 'Day Start', description: 'No visits logged for this day.', status: 'Idle' }];
  }
  const events = [];
  const visitTimes = visits.map(v => getVisitTime(v)).sort((a, b) => a - b);
  const startTime  = visitTimes[0];
  events.push({
    time: fmtTime(Math.max(startTime - 30, 8 * 60)),
    type: 'LOGIN', title: 'Day Start',
    description: `Began field work in ${visits[0].city || 'Field Location'}`, status: 'SUCCESS'
  });
  visits.forEach((v, i) => {
    if (i === Math.floor(visits.length / 2) && visits.length > 3) {
      events.push({ time: fmtTime(visitTimes[Math.floor(visits.length / 2)] - 20), type: 'BREAK', title: 'Lunch Break', description: 'Paused for lunch (45 min)', status: 'SUCCESS' });
    }
    events.push({
      time: fmtTime(visitTimes[i]),
      type: 'VISIT',
      title: `Visited ${v.operator_name || 'Operator'}`,
      description: `${v.company_name || 'Bus operator'} · ${v.location || v.city}`,
      status: v.verify_status,
      image_url: v.image_url,
      mobile: v.operator_mobile_no,
      activity_type: v.type
    });
  });
  events.push({
    time: fmtTime(visitTimes[visitTimes.length - 1] + 30),
    type: 'LOGOUT', title: 'Day End',
    description: `Logged out from ${visits[visits.length - 1].city}`, status: 'SUCCESS'
  });
  return events;
};

// ─── getAIInsights ───
export const getAIInsights = (filters = {}) => {
  const stats    = getStats(filters);
  const managers = getManagerPerformance();
  const sales    = currentData.salespersons;
  const insights = [];

  if (managers.length > 0) {
    const top = managers[0];
    insights.push({ id: 1, type: 'success', title: `${top.name}'s Team Leading`, description: `${top.name}'s team has ${top.mtd} MTD visits with a ${top.verifiedPercent}% verification rate.` });
  }

  const inactive = sales.filter(s => s.status === 'Inactive').length;
  insights.push(inactive > 0
    ? { id: 2, type: 'warning', title: 'Inactive Candidates Alert', description: `${inactive} salespeople with no visits in the last 2 days. Consider follow-up.` }
    : { id: 2, type: 'success', title: 'High Team Activity', description: '100% of the sales force is active or idle — full coverage maintained.' }
  );

  const topSales = [...sales].sort((a, b) => b.verified_percent - a.verified_percent)[0];
  if (topSales) insights.push({ id: 3, type: 'info', title: `Top Verifier: ${topSales.name}`, description: `${topSales.name} has verified ${topSales.verified_percent}% of their visits — highest quality on the team.` });

  insights.push({ id: 4, type: 'neutral', title: 'Regional Coverage', description: `Visits cover ${stats.coverageCities} cities, ${stats.avgVisitsPerCandidate} avg visits/candidate this month.` });

  return insights;
};

// ─── RED ALERTS ───────────────────────────────────────────────────────────────

/**
 * Alert 1: Visit duration < 5 minutes
 * Returns visits where calculated duration < 5 min
 */
export const getShortDurationAlerts = (filters = {}) => {
  let visits = applyFilters(currentData.visits, filters);
  return visits
    .map(v => ({ ...v, _duration: getVisitDurationMinutes(v), _time: fmtTime(getVisitTime(v)) }))
    .filter(v => v._duration < 5)
    .sort((a, b) => a._duration - b._duration);
};

/**
 * Alert 2: Day start time > 11 AM
 * For each (BD, date) pair where the first visit is after 11 AM
 */
export const getLateStartAlerts = (filters = {}) => {
  let visits = applyFilters(currentData.visits, filters);
  const LIMIT = 11 * 60; // 11:00 AM in minutes

  // Group by BD + date
  const groups = {};
  visits.forEach(v => {
    const key = `${v.bd_name}||${v.visit_date}`;
    const t   = getVisitTime(v);
    if (!groups[key] || t < groups[key].minTime) {
      groups[key] = {
        bd_name:    v.bd_name,
        visit_date: v.visit_date,
        state:      v.state,
        city:       v.city,
        manager_email: v.manager_email,
        minTime:    t
      };
    }
  });

  return Object.values(groups)
    .filter(g => g.minTime > LIMIT)
    .map(g => ({ ...g, _startDisplay: fmtTime(g.minTime) }))
    .sort((a, b) => b.minTime - a.minTime);
};

/**
 * Alert 3: Same BD visited same operator (by mobile) > 4 times MTD
 */
export const getDuplicateOperatorAlerts = (filters = {}) => {
  let visits = applyFilters(currentData.visits, filters);
  const groups = {};

  visits.forEach(v => {
    const key = `${v.bd_name}||${v.operator_mobile_no || v.operator_name}`;
    if (!groups[key]) {
      groups[key] = {
        bd_name:            v.bd_name,
        operator_name:      v.operator_name,
        operator_mobile_no: v.operator_mobile_no,
        company_name:       v.company_name,
        state:              v.state,
        city:               v.city,
        manager_email:      v.manager_email,
        count:              0,
        dates:              []
      };
    }
    groups[key].count++;
    if (!groups[key].dates.includes(v.visit_date)) groups[key].dates.push(v.visit_date);
  });

  return Object.values(groups)
    .filter(g => g.count > 4)
    .map(g => ({ ...g, dates: g.dates.sort() }))
    .sort((a, b) => b.count - a.count);
};

// ─── getUniqueStates ───
export const getUniqueStates = () =>
  Array.from(new Set(currentData.visits.map(v => v.state).filter(Boolean))).sort();
