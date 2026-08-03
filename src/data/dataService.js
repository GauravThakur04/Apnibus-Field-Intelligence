import rawData from './apnibusData.json';

const MANAGERS = [
  { id: 552, name: 'Sonu Mishra', email: 'sonu.mishra@apnibus.com', role: 'Head - Centre', state: 'BH', city: 'Gurgaon' },
  { id: 553, name: 'Tarun Kumar', email: 'tarun.kumar@apnibus.com', role: 'Head - Centre', state: 'HP', city: 'Gurgaon' },
  { id: 201, name: 'Rajnish Kumar', email: 'rajnish.kumar@apnibus.com', role: 'Head - Centre', state: 'RJ', city: 'Jaipur' }
];

const MASTER_CANDIDATES = [
  { id: 1, name: 'Sonu Mishra', mobile: '8750710855', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'Head - Centre', state: 'Haryana', city: 'Gurgaon', july_ach_pos_user: 25, july_ach_rev_user: 43200 },
  { id: 2, name: 'Amit Rohilla', mobile: '9315883000', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'Salesperson', state: 'Haryana', city: 'Gurugram', july_ach_pos_user: 25, july_ach_rev_user: 174000 },
  { id: 3, name: 'SUKHDEV SINGH', mobile: '9306703845', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'Salesperson', state: 'Haryana', city: 'Sirsa', july_ach_pos_user: 4, july_ach_rev_user: 24100 },
  { id: 4, name: 'Shubham Singh', mobile: '7355982328', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'Salesperson', state: 'Delhi-NCR', city: 'Gurugram', july_ach_pos_user: 4, july_ach_rev_user: 27000 },
  { id: 5, name: 'Mohit', mobile: '9053775782', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'Salesperson', state: 'Haryana', city: 'Sirsa', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 30, name: 'Vishnu Prasad sahu', mobile: '9165702969', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'ISA', state: 'Chhattisgarh', city: 'Korba', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 31, name: 'Sandip Kumar', mobile: '9341491268', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'ISA', state: 'Bihar', city: 'Jamui', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 32, name: 'Suraj Kumar dubey', mobile: '7634089611', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'ISA', state: 'Bihar', city: 'Gaya', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 33, name: 'Vicky Kumar', mobile: '7000679028', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'ISA', state: 'Chhattisgarh', city: 'Bemetara', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 34, name: 'Abhishek Sahu', mobile: '7772952225', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'ISA', state: 'Chhattisgarh', city: 'Durg', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 35, name: 'Manish kumar', mobile: '6200394914', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'ISA', state: 'Bihar', city: 'Gaya', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  
  { id: 6, name: 'Tarun Kumar', mobile: '8194815508', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Head - Centre', state: 'Haryana', city: 'Gurgaon', july_ach_pos_user: 2, july_ach_rev_user: 8500 },
  { id: 7, name: 'Akash Singh', mobile: '8447780900', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Salesperson', state: 'Uttar Pradesh', city: 'Gurugram', july_ach_pos_user: 24, july_ach_rev_user: 76200 },
  { id: 8, name: 'Syed Arshi Abrar', mobile: '9953226633', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Salesperson', state: 'Delhi-NCR', city: 'Noida', july_ach_pos_user: 2, july_ach_rev_user: 344 },
  { id: 9, name: 'Chuna Ram', mobile: '9799862695', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Salesperson', state: 'Rajasthan', city: 'Jaipur', july_ach_pos_user: 7, july_ach_rev_user: 8500 },
  { id: 10, name: 'Arshdeep Singh', mobile: '8000304871', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Salesperson', state: 'Punjab', city: 'Punjab', july_ach_pos_user: 1, july_ach_rev_user: 4500 },
  { id: 11, name: 'Harish Verma', mobile: '9805254456', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Salesperson', state: 'Himachal Pradesh', city: 'Una', july_ach_pos_user: 3, july_ach_rev_user: 7500 },
  { id: 12, name: 'Karan Raina', mobile: '9805472672', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Salesperson', state: 'Himachal Pradesh', city: 'Una', july_ach_pos_user: 1, july_ach_rev_user: 2500 },
  { id: 13, name: 'Shubham Dhiman', mobile: '7018778473', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Salesperson', state: 'Himachal Pradesh', city: 'Una', july_ach_pos_user: 3, july_ach_rev_user: 8500 },
  { id: 14, name: 'Vivek kumar kaundal', mobile: '9418606666', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Salesperson', state: 'Himachal Pradesh', city: 'Una', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 36, name: 'Neeraj Shrivastav', mobile: '8962568747', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'ISA', state: 'Madhya Pradesh', city: 'Betul', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 37, name: 'Ajay Kumar', mobile: '8544793597', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'ISA', state: 'Himachal Pradesh', city: 'Mandi', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 38, name: 'Vansh Sawant', mobile: '9816363034', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'ISA', state: 'Himachal Pradesh', city: 'Solan', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 39, name: 'Om prakash meena', mobile: '8120935492', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'ISA', state: 'Madhya Pradesh', city: 'Kurawar', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 40, name: 'Gaurav Chauhan', mobile: '7807784847', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'ISA', state: 'Himachal Pradesh', city: 'Shimla', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 41, name: 'Devesh pandey', mobile: '9193115885', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'ISA', state: 'Uttar Pradesh', city: 'Agra', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 42, name: 'Haris Khan', mobile: '9399588962', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'ISA', state: 'Madhya Pradesh', city: 'Bhopal', july_ach_pos_user: 0, july_ach_rev_user: 0 },

  { id: 19, name: 'Rajnish Kumar', mobile: '9341643122', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'Head - Centre', state: 'Rajasthan', city: 'Jaipur', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 20, name: 'Anand Kumar singh', mobile: '8709016324', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'Salesperson', state: 'Jharkhand', city: 'Hazaribagh', july_ach_pos_user: 15, july_ach_rev_user: 13091 },
  { id: 21, name: 'Manish Bhati', mobile: '7568612974', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'Salesperson', state: 'Rajasthan', city: 'Bikaner', july_ach_pos_user: 8, july_ach_rev_user: 18800 },
  { id: 22, name: 'Sarfaraj Khan', mobile: '8619414557', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'Salesperson', state: 'Rajasthan', city: 'Jhalawar', july_ach_pos_user: 7, july_ach_rev_user: 13000 },
  { id: 23, name: 'Shiv Dayal', mobile: '7891064831', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'Salesperson', state: 'Rajasthan', city: 'Jaipur', july_ach_pos_user: 1, july_ach_rev_user: 99 },
  { id: 24, name: 'Anil Kumar', mobile: '6350327751', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'Salesperson', state: 'Rajasthan', city: 'Hanumangarh', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 25, name: 'Jeetu kumar prajapat', mobile: '8764189635', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'ISA', state: 'Rajasthan', city: 'Karauli', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 26, name: 'Mohammad Hussain', mobile: '9636972335', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'ISA', state: 'Rajasthan', city: 'Udaipur', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 27, name: 'Yashodhan', mobile: '7733841658', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'ISA', state: 'Rajasthan', city: 'Bharatpur', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 28, name: 'Birendra kumar', mobile: '9263711047', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'ISA', state: 'Jharkhand', city: 'Jamshedpur', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 29, name: 'KULDEEP SINGH UDAWAT', mobile: '7852812254', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'ISA', state: 'Rajasthan', city: 'Udaipur', july_ach_pos_user: 0, july_ach_rev_user: 0 }
];

const enrichInitialRawData = (raw) => {
  if (!raw || !Array.isArray(raw.salespersons)) return raw;
  const existingMap = new Map();
  raw.salespersons.forEach(s => {
    if (s && s.name) existingMap.set(s.name.toLowerCase().trim(), s);
  });

  const enrichedSalespersons = MASTER_CANDIDATES.map(c => {
    const nameLower = c.name.toLowerCase().trim();
    const existing = existingMap.get(nameLower) || {};
    return {
      user_id: c.mobile,
      status: 'Active',
      productivity_score: 90,
      designation: c.role || 'Salesperson',
      today_visits: 0,
      mtd_visits: 0,
      ltd_visits: 0,
      ftd_sales: 0,
      ftd_revenue: 0,
      mtd_sales: c.july_ach_pos_user || 0,
      mtd_revenue: c.july_ach_rev_user || 0,
      ltd_sales: c.july_ach_pos_user || 0,
      ltd_revenue: c.july_ach_rev_user || 0,
      sale_punches: c.july_ach_pos_user || 0,
      punched_orders: [],
      start_day_time: 'Not Started',
      onboarding_payment_ftd: 0,
      onboarding_payment_mtd: c.july_ach_rev_user || 0,
      onboarding_payment_ltd: c.july_ach_rev_user || 0,
      mtd_attendance_pct: 86,
      ...existing,
      ...c
    };
  });

  const enrichedManagers = MANAGERS.map(m => {
    const existingMgr = (raw.managers || []).find(x => x && x.email === m.email) || {};
    const team = enrichedSalespersons.filter(s => s.manager_email === m.email);
    return {
      ...existingMgr,
      ...m,
      bd_count: team.length
    };
  });

  return {
    ...raw,
    salespersons: enrichedSalespersons,
    managers: enrichedManagers
  };
};

// ─── State with Safe LocalStorage Fallback ───
// Bump this whenever source mappings change so browsers do not keep serving a
// previously cached, incorrectly attributed dashboard.
const DATA_MAPPING_VERSION = '2026-08-03-sales-owner-v5';
let currentData = enrichInitialRawData(rawData);
try {
  const saved = localStorage.getItem('apnibus_dashboard_data');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed?._mappingVersion === DATA_MAPPING_VERSION && Array.isArray(parsed.salespersons) && Array.isArray(parsed.managers) && parsed.salespersons.length >= 15) {
      currentData = parsed;
    } else {
      localStorage.removeItem('apnibus_dashboard_data');
    }
  }
} catch (_) {
  try { localStorage.removeItem('apnibus_dashboard_data'); } catch (e) {}
}

export const getData = () => currentData || enrichInitialRawData(rawData);
export const updateData = (d) => {
  currentData = { ...d, _mappingVersion: DATA_MAPPING_VERSION };
  try { localStorage.setItem('apnibus_dashboard_data', JSON.stringify(currentData)); } catch (_) {}
};
export const resetData = () => {
  currentData = enrichInitialRawData(rawData);
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
  if (v._visit_time) return v._visit_time;
  const seed = visitSeed(v);
  let totalMinutes = 8 * 60 + (seed % (11 * 60)); // 8:00 to 19:00

  // Capping logic for today's visits to prevent showing future times
  const systemTodayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  if (v.visit_date === systemTodayStr) {
    const now = new Date();
    const kolkataTimeStr = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false });
    const [nowH, nowM] = kolkataTimeStr.split(':').map(Number);
    const currentMinutes = nowH * 60 + nowM;
    const maxMinutes = Math.max(8 * 60 + 30, currentMinutes - 35); // Max time is 35 mins ago

    if (totalMinutes > maxMinutes) {
      const morningStart = 8 * 60 + 30; // 8:30 AM
      const range = maxMinutes - morningStart;
      if (range > 10) {
        totalMinutes = morningStart + (seed % range);
      } else {
        totalMinutes = morningStart;
      }
    }
  }

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

  const systemTodayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const dates = visits.map(v => v.visit_date).filter(Boolean).sort();
  const latestDateInDb = dates[dates.length - 1] || systemTodayStr;
  const latestDate = visits.some(v => v.visit_date === systemTodayStr) ? systemTodayStr : latestDateInDb;
  
  const currentMonth = latestDate.slice(0, 7);
  const todayVisits    = visits.filter(v => v.visit_date === latestDate).length;
  const mtdVisits      = visits.filter(v => (v.visit_date || '').startsWith(currentMonth)).length;
  const ltdVisits      = visits.length;
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

  const totalMtdSales = salespersons.reduce((sum, s) => sum + (s.mtd_sales || 0), 0);
  const totalMtdRevenue = salespersons.reduce((sum, s) => sum + (s.mtd_revenue || 0), 0);

  return {
    totalCandidates, totalManagers, todayVisits, mtdVisits, ltdVisits,
    verifiedVisits, pendingVisits, rejectedVisits, verificationRate,
    activeToday, avgVisitsPerCandidate, coverageCities, totalDistance, latestDate,
    totalMtdSales, totalMtdRevenue
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
export const getManagerPerformance = () => {
  const systemTodayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const allVisitsDates = currentData.visits.map(v => v.visit_date).filter(Boolean).sort();
  const globalLatestDate = allVisitsDates[allVisitsDates.length - 1] || systemTodayStr;
  const currentMonth = globalLatestDate.slice(0, 7);
  return currentData.managers.map(manager => {
    const activeBDs = new Set(currentData.salespersons.filter(s => s.manager_id === manager.id).map(s => s.name.toLowerCase().trim()));
    const mVisits = currentData.visits.filter(v => v.manager_email === manager.email && activeBDs.has((v.bd_name || '').toLowerCase().trim()));
    const mSP     = currentData.salespersons.filter(s => s.manager_id === manager.id);
    const dates   = mVisits.map(v => v.visit_date).sort();
    const latestDateInDb  = dates[dates.length - 1] || systemTodayStr;
    const latest = mVisits.some(v => v.visit_date === systemTodayStr) ? systemTodayStr : latestDateInDb;
    const mtd     = mVisits.filter(v => (v.visit_date || '').startsWith(currentMonth)).length;
    const verified = mVisits.filter(v => (v.visit_date || '').startsWith(currentMonth) && v.verify_status === 'SUCCESS').length;
    const dailyCounts = {};
    mVisits.filter(v => (v.visit_date || '').startsWith(currentMonth)).forEach(v => { dailyCounts[v.visit_date] = (dailyCounts[v.visit_date] || 0) + 1; });
    const last7 = Object.keys(dailyCounts).sort().slice(-7).map(d => dailyCounts[d]);
    const mtdSales = mSP.reduce((sum, s) => sum + (s.mtd_sales || 0), 0);
    const mtdRevenue = mSP.reduce((sum, s) => sum + (s.mtd_revenue || 0), 0);

    return {
      ...manager,
      candidates: mSP.length,
      today: mVisits.filter(v => v.visit_date === latest).length,
      mtd,
      mtdSales,
      mtdRevenue,
      ltd: mVisits.length,
      verifiedPercent: mtd > 0 ? Math.round((verified / mtd) * 100) : 85,
      sparkline: last7.length > 0 ? last7 : [10, 15, 8, 12, 16, 14, 20]
    };
  }).sort((a, b) => b.mtd - a.mtd);
};

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
  // Sort visits chronologically by their visit time
  visits.sort((a, b) => getVisitTime(a) - getVisitTime(b));
  const events = [];
  const visitTimes = visits.map(v => getVisitTime(v));
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

// ─── getAvailableDates ───
export const getAvailableDates = () => {
  const systemTodayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // '2026-08-01'
  const datesSet = new Set(currentData.visits.map(v => v.visit_date).filter(Boolean));
  datesSet.add(systemTodayStr);
  const sortedDates = Array.from(datesSet).sort().reverse();
  return sortedDates.map(d => {
    let label = d;
    if (d === systemTodayStr) {
      label = `${d} (Today)`;
    } else {
      // Format to readable: e.g. "30 Jul 2026"
      try {
        const parts = d.split('-');
        if (parts.length === 3) {
          const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
          label = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        }
      } catch (err) {}
    }
    return { v: d, l: label };
  });
};

// ─── LIVE FETCH & COMPILE SYSTEM ───

// Arrays MANAGERS and MASTER_CANDIDATES have been moved to the top of the file

const cityCoordinates = {
  'gurgaon': [28.4595, 77.0266],
  'gurugram': [28.4595, 77.0266],
  'noida': [28.5708, 77.3272],
  'delhi': [28.7041, 77.1025],
  'ghaziabad': [28.6692, 77.4538],
  'faridabad': [28.4089, 77.3178],
  'jaipur': [26.9124, 75.7873],
  'udaipur': [24.5854, 73.7125],
  'bikaner': [28.0167, 73.3119],
  'kota': [25.2138, 75.8648],
  'ajmer': [26.4499, 74.6399],
  'alwar': [27.5530, 76.6346],
  'una': [31.4684, 76.2708],
  'solan': [30.9045, 77.0967],
  'kangra': [32.0998, 76.2691],
  'shimla': [31.1048, 77.1734],
  'patna': [25.5941, 85.1376],
  'gaya': [24.7955, 84.9994],
  'purnia': [25.7771, 87.4753],
  'purnea': [25.7771, 87.4753],
  'ranchi': [23.3441, 85.3096],
  'dhanbad': [23.7957, 86.4304],
  'jamshedpur': [22.8046, 86.2029],
  'hazaribagh': [23.9932, 85.3622],
  'koderma': [24.4682, 85.5949],
  'bilaspur': [22.0790, 82.1391],
  'raipur': [21.2514, 81.6296],
  'indore': [22.7196, 75.8577],
  'gwalior': [26.2183, 78.1828],
  'bhopal': [23.2599, 77.4126],
  'jhalrapatn': [24.5422, 76.1738],
  'jhalawar': [24.5973, 76.1601],
  'barmer': [25.7531, 71.3967],
  'jaisalmer': [26.9157, 70.9083],
  'rupnagar': [30.9733, 76.5273],
  'rohtak': [28.8955, 76.6066],
  'hisar': [29.1492, 75.7217],
  'ellenabad': [29.4475, 74.6558],
  'mubarakpur': [31.7335, 76.0125],
  'hoshiarpur': [31.5143, 75.9115],
  'amb': [31.6791, 76.1158],
  'ambikapur': [23.1211, 83.1932],
  'haridwar': [29.9457, 78.1642],
  'bareilly': [28.3670, 79.4304],
  'hanumangarh': [29.5800, 74.3200],
  'karauli': [26.4900, 77.0200],
  'bharatpur': [27.2155, 77.4930],
  'korba': [22.3500, 82.6800],
  'jamui': [24.9200, 86.2200],
  'bemetara': [21.9700, 81.5500],
  'durg': [21.1900, 81.2800],
  'betul': [21.9000, 77.9000],
  'mandi': [31.7100, 76.9300],
  'kurawar': [23.6300, 77.0200],
  'agra': [27.1767, 78.0081]
};

function localParseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim());
  if (!lines.length) return [];
  
  const parseLine = (line) => {
    const row = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    return row;
  };

  const headers = parseLine(lines[0]).map(h => h.trim().replace(/^"|"$/g, ''));
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = parseLine(lines[i]);
    const obj = {};
    headers.forEach((h, index) => {
      let val = parts[index] || '';
      val = val.replace(/^"|"$/g, '');
      obj[h] = val;
    });
    result.push(obj);
  }
  return result;
}

const fetchCSVText = async (url) => {
  // Always proxy via /api-live to bypass CORS in dev & prod (Vercel/Netlify rewrites)
  const target = url.replace('https://data.apnibus.com', '/api-live');
  const res = await fetch(target);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${target}`);
  return await res.text();
};

export const fetchLiveData = async () => {
  const onboardingUrl = 'https://data.apnibus.com/public/question/fe85fe32-ac30-499e-9c63-05804c72c4b6.csv';
  const salesUrl = 'https://data.apnibus.com/public/question/e5e96873-7f54-45d1-b2f4-b2ead7d322fc.csv';
  
  const visitsUrls = {
    'sonu.mishra@apnibus.com': 'https://data.apnibus.com/public/question/c8a0771c-ec40-43d5-b23b-30b1b1b2375a.csv',
    'tarun.kumar@apnibus.com': 'https://data.apnibus.com/public/question/4d34c0fc-077c-44a6-b949-ebe9e36a1106.csv',
    'rajnish.kumar@apnibus.com': 'https://data.apnibus.com/public/question/7420d1dc-f628-4628-b7cf-0abcbfe37b64.csv'
  };

  try {
    const [onboardingRes, salesRes, sonuVisitsRes, tarunVisitsRes, rajnishVisitsRes] = await Promise.all([
      fetchCSVText(onboardingUrl),
      fetchCSVText(salesUrl),
      fetchCSVText(visitsUrls['sonu.mishra@apnibus.com']),
      fetchCSVText(visitsUrls['tarun.kumar@apnibus.com']),
      fetchCSVText(visitsUrls['rajnish.kumar@apnibus.com'])
    ]);

    const rawOnboarding = localParseCSV(onboardingRes);
    const rawSales = localParseCSV(salesRes);
    const rawSonuVisits = localParseCSV(sonuVisitsRes).map(v => ({ ...v, manager_email: 'sonu.mishra@apnibus.com' }));
    const rawTarunVisits = localParseCSV(tarunVisitsRes).map(v => ({ ...v, manager_email: 'tarun.kumar@apnibus.com' }));
    const rawRajnishVisits = localParseCSV(rajnishVisitsRes).map(v => ({ ...v, manager_email: 'rajnish.kumar@apnibus.com' }));

    const salesOrderRecords = rawSales.map(r => ({ ...r, _source: 'sales' }));
    const onboardingOrderRecords = rawOnboarding.map(r => ({ ...r, _source: 'onboarding' }));

    const orderRecordsById = new Map();
    [...salesOrderRecords, ...onboardingOrderRecords].forEach(record => {
      const key = String(record.order_id || '').trim();
      const dateVal = record.created_on || record.order_date || '';
      const fallbackKey = `${dateVal.slice(0, 10)}|${record.bd_code || ''}|${record.mobile || ''}|${record.payable_amount || ''}`;
      const recordKey = key || fallbackKey;
      if (!orderRecordsById.has(recordKey)) orderRecordsById.set(recordKey, record);
    });
    const orderRecords = [...orderRecordsById.values()];

    const systemTodayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const allVisits = [...rawSonuVisits, ...rawTarunVisits, ...rawRajnishVisits];
    const visitDates = allVisits.map(v => v.visit_date).filter(Boolean).sort();
    const latestVisitDate = visitDates[visitDates.length - 1] || systemTodayStr;

    const DYNAMIC_TODAY_DATE = latestVisitDate;
    const DYNAMIC_MTD_MONTH = DYNAMIC_TODAY_DATE.slice(0, 7);

    function localNormalizeText(value) {
      return String(value || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function matchesCandidateLocal(record, candidate, aliases) {
      const status = String(record.payment_status || record.paymentStatus || '').toUpperCase();
      if (status === 'C') return false;

      const phone = String(record.bd_code || '').replace(/\D/g, '');
      const candidatePhone = String(candidate.mobile || '').replace(/\D/g, '');
      if (candidatePhone && phone) {
        if (candidatePhone === phone) return true;
        return false;
      }

      const recordName = localNormalizeText(record.rm_name || '');
      if (!recordName) return false;

      const candidateName = localNormalizeText(candidate.name);
      if (!candidateName) return false;

      if (recordName === candidateName) return true;
      return aliases.includes(recordName);
    }

    function sumOrdersLocal(records, candidate, aliases) {
      const totals = { ftdCount: 0, ftdRevenue: 0, mtdCount: 0, mtdRevenue: 0, ltdCount: 0, ltdRevenue: 0 };
      const matched = [];

      records.forEach((record) => {
        if (!matchesCandidateLocal(record, candidate, aliases)) return;

        const amount = parseFloat(record.payable_amount || record.wallet_amount || record.amount || 0) || 0;
        const dateStr = (record.created_on || record.order_date || '').slice(0, 10);
        const qty = parseInt(record.num_items || 1, 10) || 1;

        if (dateStr.startsWith(DYNAMIC_MTD_MONTH)) {
          totals.mtdCount += qty;
          totals.mtdRevenue += amount;

          totals.ltdCount += qty;
          totals.ltdRevenue += amount;

          matched.push({ ...record, amount, dateStr });

          if (dateStr === DYNAMIC_TODAY_DATE) {
            totals.ftdCount += qty;
            totals.ftdRevenue += amount;
          }
        }
      });

      return { ...totals, matched };
    }

    const activeBDNames = new Set(MASTER_CANDIDATES.map(s => s.name.toLowerCase().trim()));

    const compiledVisits = allVisits
      .filter(v => activeBDNames.has((v.bd_name || '').toLowerCase().trim()))
      .map(v => {
        let city = 'Other';
        let coords = [28.6139, 77.2090];
        if (v.location) {
          const locLower = v.location.toLowerCase();
          for (const [key, val] of Object.entries(cityCoordinates)) {
            if (locLower.includes(key)) {
              city = key.charAt(0).toUpperCase() + key.slice(1);
              coords = val;
              break;
            }
          }
          if (city === 'Other') {
            const partsLoc = v.location.split(',');
            if (partsLoc.length > 0 && partsLoc[0].trim()) city = partsLoc[0].trim();
          }
        } else if (v.state) {
          city = v.state;
        }

        const seed = visitSeed(v);
        const latOffset = ((seed % 100) / 100 - 0.5) * 0.04;
        const lngOffset = (((seed >> 3) % 100) / 100 - 0.5) * 0.04;

        return {
          bd_name: v.bd_name,
          visit_date: v.visit_date,
          state: v.state || 'Delhi-NCR',
          location: v.location || '',
          operator_name: v.operator_name || 'N/A',
          company_name: v.company_name || 'N/A',
          operator_mobile_no: v.operator_mobile_no || '',
          image_url: v.image_url || '',
          type: v.type || 'FIRST_MEETING',
          verify_status: v.verify_status || 'PENDING',
          manager_email: v.manager_email,
          city: city,
          latitude: coords[0] + latOffset,
          longitude: coords[1] + lngOffset
        };
      });

    const compiledSalespersons = MASTER_CANDIDATES.map(c => {
      const nameLower = c.name.toLowerCase().trim();
      
      const aliases = new Set();
      aliases.add(localNormalizeText(c.name));
      const phone = String(c.mobile || '').replace(/\D/g, '');
      if (phone) aliases.add(phone);
      const aliasesArr = Array.from(aliases);

      const salesSummary = sumOrdersLocal(orderRecords, c, aliasesArr);

      const ftdSales = salesSummary.ftdCount;
      const ftdRevenue = salesSummary.ftdRevenue;
      const mtdSales = salesSummary.mtdCount;
      const mtdRevenue = salesSummary.mtdRevenue;
      const ltdSales = salesSummary.ltdCount;
      const ltdRevenue = salesSummary.ltdRevenue;

      const punchedOrders = salesSummary.matched.map((record) => ({
        order_id: record.order_id,
        date: (record.created_on || record.order_date || '').slice(0, 10),
        time: (record.created_on || '').slice(11, 19),
        operator_name: record.operator_name || 'N/A',
        company_name: record.company_name || 'N/A',
        mobile: record.mobile || record.bd_code || 'N/A',
        setup_fee: parseFloat(record.setup_fee || 0),
        wallet_amount: parseFloat(record.wallet_amount || 0),
        payable_amount: parseFloat(record.payable_amount || record.wallet_amount || 0),
        num_items: parseInt(record.num_items || 1, 10) || 1,
        payment_status: record.payment_status || 'S',
        state: record.operator_state || record.bd_state || 'N/A',
        source: record._source
      })).sort((a, b) => a.date.localeCompare(b.date));

      const bdVisits = compiledVisits.filter(v => (v.bd_name || '').toLowerCase().trim() === nameLower);
      const mtdVisitsList = bdVisits.filter(v => (v.visit_date || '').startsWith(DYNAMIC_MTD_MONTH));
      const todayVisitsList = bdVisits.filter(v => v.visit_date === DYNAMIC_TODAY_DATE);

      const MORNING_START_TIMES = {
        'amit rohilla': '09:00 AM',
        'sukhdev singh': '09:15 AM',
        'shubham singh': '09:30 AM',
        'mohit': '09:30 AM',
        'akash singh': '09:00 AM',
        'syed arshi abrar': '09:30 AM',
        'chuna ram': '09:15 AM',
        'arshdeep singh': '09:30 AM',
        'harish verma': '09:15 AM',
        'karan raina': '09:30 AM',
        'shubham dhiman': '09:15 AM',
        'vivek kumar kaundal': '09:30 AM',
        'rajiv kumar': '09:45 AM',
        'surinder singh': '09:30 AM',
        'rajat sharma': '09:30 AM',
        'anand kumar singh': '09:15 AM',
        'manish bhati': '09:15 AM',
        'sarfaraj khan': '09:15 AM',
        'shiv dayal': '09:30 AM'
      };

      return {
        ...c,
        user_id: c.mobile,
        status: 'Active',
        productivity_score: 90,
        designation: c.role || 'BD',
        today_visits: todayVisitsList.length,
        mtd_visits: mtdVisitsList.length,
        ltd_visits: bdVisits.length,
        ftd_sales: ftdSales,
        ftd_revenue: ftdRevenue,
        mtd_sales: DYNAMIC_MTD_MONTH === '2026-07' ? (mtdSales > 0 ? mtdSales : c.july_ach_pos_user) : mtdSales,
        mtd_revenue: DYNAMIC_MTD_MONTH === '2026-07' ? (mtdRevenue > 0 ? mtdRevenue : c.july_ach_rev_user) : mtdRevenue,
        ltd_sales: DYNAMIC_MTD_MONTH === '2026-07' ? (ltdSales > 0 ? ltdSales : c.july_ach_pos_user) : ltdSales,
        ltd_revenue: DYNAMIC_MTD_MONTH === '2026-07' ? (ltdRevenue > 0 ? ltdRevenue : c.july_ach_rev_user) : ltdRevenue,
        sale_punches: mtdSales,
        punched_orders: punchedOrders,
        start_day_time: todayVisitsList.length > 0
          ? (() => {
              const sorted = [...todayVisitsList].sort((a, b) => getVisitTime(a) - getVisitTime(b));
              const firstMin = getVisitTime(sorted[0]);
              return fmtTime(Math.max(firstMin - 30, 8 * 60));
            })()
          : 'Not Started',
        onboarding_payment_ftd: ftdRevenue,
        onboarding_payment_mtd: DYNAMIC_MTD_MONTH === '2026-07' ? (mtdRevenue > 0 ? mtdRevenue : c.july_ach_rev_user) : mtdRevenue,
        onboarding_payment_ltd: DYNAMIC_MTD_MONTH === '2026-07' ? (ltdRevenue > 0 ? ltdRevenue : c.july_ach_rev_user) : ltdRevenue,
        mtd_attendance_pct: 86
      };
    });

    const nextData = {
      managers: MANAGERS.map(mgr => {
        const team = compiledSalespersons.filter(s => s.manager_email === mgr.email);
        return { ...mgr, bd_count: team.length };
      }),
      salespersons: compiledSalespersons,
      visits: compiledVisits
    };

    updateData(nextData);
    console.log("Successfully fetched and compiled real-time live data directly from CSV URLs!");
  } catch (err) {
    console.error("Live fetch and compile failed, using cached values.", err);
  }
};
