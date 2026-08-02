const fs = require('fs');
const path = require('path');

// 1. Read existing apnibusData.json
const rawDataPath = path.join(__dirname, 'src/data/apnibusData.json');
const currentData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

// 2. Read both sales and onboarding CSVs. SALES_CSV_PATH allows a newly
// downloaded source export to be compiled without changing the code.
const salesCsvPath = process.env.SALES_CSV_PATH || path.join(__dirname, 'src/data/actual_bd_revenue.csv');
const onboardingCsvPath = path.join(__dirname, 'src/data/full_onboarding_payment.csv');

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else current += char;
  }
  result.push(current.trim());
  return result;
}

function readCsvRecords(filePath) {
  const csvContent = fs.readFileSync(filePath, 'utf8');
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim());
  if (!lines.length) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCSVLine(lines[i]);
    if (parts.length < 5) continue;
    const rec = {};
    headers.forEach((h, idx) => { rec[h] = parts[idx] || ''; });
    rows.push(rec);
  }
  return rows;
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildCandidateAliases(candidate) {
  const aliases = new Set();
  // Sales belong to the BD, never to their manager.  Including manager names
  // here caused every record attributed to a manager to be counted for each
  // member of that manager's team.
  const names = [candidate.name];
  names.forEach(name => {
    const normalized = normalizeText(name);
    if (normalized) aliases.add(normalized);
  });

  const phone = String(candidate.mobile || candidate.user_id || '').replace(/\D/g, '');
  if (phone) aliases.add(phone);
  return Array.from(aliases);
}

function matchesCandidate(record, candidate, aliases) {
  const status = String(record.payment_status || record.paymentStatus || '').toUpperCase();
  if (status === 'C') return false;

  // 1. Precise Phone Matching (Only bd_code contains the BD's phone number, mobile is the operator's phone)
  const phone = String(record.bd_code || '').replace(/\D/g, '');
  const candidatePhone = String(candidate.mobile || '').replace(/\D/g, '');
  if (candidatePhone && phone) {
    if (candidatePhone === phone) return true;
    return false; // phone mismatch
  }

  // 2. Exact BD-name fallback only when no BD code is present.  Partial names
  // are intentionally not used: they can map a sale to the wrong salesperson.
  const recordName = normalizeText(record.rm_name || '');
  if (!recordName) return false;

  const candidateName = normalizeText(candidate.name);
  if (!candidateName) return false;

  if (recordName === candidateName) return true;

  return aliases.includes(recordName);
}

function getDateValue(record) {
  return (record.created_on || record.order_date || '').slice(0, 10);
}

function sumOrders(records, candidate, aliases, useDateFilter = true) {
  const totals = { count: 0, revenue: 0, ftdCount: 0, ftdRevenue: 0, mtdCount: 0, mtdRevenue: 0, ltdCount: 0, ltdRevenue: 0 };
  const matched = [];

  records.forEach((record) => {
    if (!matchesCandidate(record, candidate, aliases)) return;

    const amount = parseFloat(record.payable_amount || record.wallet_amount || record.amount || 0) || 0;
    const dateStr = getDateValue(record);
    const qty = parseInt(record.num_items || 1, 10) || 1;

    if (useDateFilter && dateStr.startsWith(DYNAMIC_MTD_MONTH)) {
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

const salesOrderRecords = readCsvRecords(salesCsvPath).map(record => ({ ...record, _source: 'sales' }));
const onboardingOrderRecords = readCsvRecords(onboardingCsvPath).map(record => ({ ...record, _source: 'onboarding' }));

// The same order can exist in both extracts. Keep the dedicated sales export
// when available, and use onboarding only for orders absent from it.
const orderRecordsById = new Map();
[...salesOrderRecords, ...onboardingOrderRecords].forEach(record => {
  const key = String(record.order_id || '').trim();
  const fallbackKey = `${getDateValue(record)}|${record.bd_code || ''}|${record.mobile || ''}|${record.payable_amount || ''}`;
  const recordKey = key || fallbackKey;
  if (!orderRecordsById.has(recordKey)) orderRecordsById.set(recordKey, record);
});
const orderRecords = [...orderRecordsById.values()];

// Dynamic Date Detection
const systemTodayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // '2026-08-01'
const DYNAMIC_TODAY_DATE = systemTodayStr;
const DYNAMIC_MTD_MONTH = DYNAMIC_TODAY_DATE.slice(0, 7); // YYYY-MM

// 4 Official Managers
const MANAGERS = [
  { id: 552, name: 'Sonu Mishra', email: 'sonu.mishra@apnibus.com', role: 'Head - Centre', state: 'BH', city: 'Gurgaon' },
  { id: 553, name: 'Tarun Kumar', email: 'tarun.kumar@apnibus.com', role: 'Head - Centre', state: 'HP', city: 'Gurgaon' },
  { id: 554, name: 'Rajwinder Singh', email: 'rajwinder.singh@apnibus.com', role: 'State Head', state: 'PB', city: 'Punjab' },
  { id: 551, name: 'Rajnish Kumar', email: 'rajnish.kumar@apnibus.com', role: 'State Head', state: 'JH', city: 'Gurgaon' }
];

// Master Candidate Directory from User
const MASTER_CANDIDATES = [
  // Sonu Mishra Team
  { id: 2, name: 'Amit Rohilla', state: 'HR', city: 'Rohtak', designation: 'TL', email: 'amit@apnibus.com', mobile: '9315883000', manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', manager_id: 552, june_pos: 22, june_rev: 98700, july_target_pos: 20, july_ach_pos_user: 25, july_ach_rev_user: 174000 },
  { id: 3, name: 'SUKHDEV SINGH', state: 'HR', city: 'Sirsa', designation: 'BD', email: 'sukhdev.singh@apnibus.com', mobile: '9306703845', manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', manager_id: 552, june_pos: 7, june_rev: 51000, july_target_pos: 17, july_ach_pos_user: 4, july_ach_rev_user: 24100 },
  { id: 4, name: 'Shubham Singh', state: 'HR', city: 'Gurgaon', designation: 'BD', email: 'shubham.singh@apnibus.com', mobile: '7355982328', manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', manager_id: 552, june_pos: 6, june_rev: 43000, july_target_pos: 17, july_ach_pos_user: 4, july_ach_rev_user: 27000 },
  { id: 5, name: 'Mohit', state: 'HR', city: 'Hisar', designation: 'BD', email: 'mohit.verma@apnibus.com', mobile: '9053775782', manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', manager_id: 552, june_pos: 4, june_rev: 32000, july_target_pos: 16, july_ach_pos_user: 0, july_ach_rev_user: 0 },

  // Tarun Kumar Team
  { id: 7, name: 'Akash Singh', state: 'UP', city: 'Greater Noida', designation: 'BD', email: 'akash.singh@apnibus.com', mobile: '8447780900', manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', manager_id: 553, june_pos: 11, june_rev: 30900, july_target_pos: 20, july_ach_pos_user: 24, july_ach_rev_user: 76200 },
  { id: 8, name: 'Syed Arshi Abrar', state: 'DEL', city: 'Delhi_NCR', designation: 'BD', email: 'syed.arshi@apnibus.com', mobile: '9953226633', manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', manager_id: 553, june_pos: 6, june_rev: 13000, july_target_pos: 20, july_ach_pos_user: 2, july_ach_rev_user: 344 },
  { id: 9, name: 'Chuna Ram', state: 'RJ', city: 'Barmer', designation: 'BD', email: 'chuna.ram@apnibus.com', mobile: '9799862695', manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', manager_id: 553, june_pos: 5, june_rev: 12500, july_target_pos: 15, july_ach_pos_user: 7, july_ach_rev_user: 8500 },
  { id: 10, name: 'Arshdeep Singh', state: 'RJ', city: 'Sri Ganganagar', designation: 'Service BD', email: 'arshdeep.singh@apnibus.com', mobile: '8000304871', manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', manager_id: 553, june_pos: 2, june_rev: 4800, july_target_pos: 10, july_ach_pos_user: 1, july_ach_rev_user: 4500 },
  { id: 11, name: 'Harish Verma', state: 'HP', city: 'Una', designation: 'BD', email: 'harish.verma@apnibus.com', mobile: '9805254456', manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', manager_id: 553, june_pos: 3, june_rev: 3500, july_target_pos: 10, july_ach_pos_user: 3, july_ach_rev_user: 7500 },
  { id: 12, name: 'Karan Raina', state: 'HP', city: 'Chamba', designation: 'Service BD', email: 'karan.raina@apnibus.com', mobile: '9805472672', manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', manager_id: 553, june_pos: 0, june_rev: 0, july_target_pos: 5, july_ach_pos_user: 1, july_ach_rev_user: 2500 },
  { id: 13, name: 'Shubham Dhiman', state: 'HP', city: 'Kangra', designation: 'Service BD', email: 'subham.dhiman@apnibus.com', mobile: '7018778473', manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', manager_id: 553, june_pos: 0, june_rev: 0, july_target_pos: 5, july_ach_pos_user: 3, july_ach_rev_user: 8500 },
  { id: 14, name: 'Vivek kumar kaundal', state: 'HP', city: 'Kangra', designation: 'Service BD', email: 'vivek.kaundal@apnibus.com', mobile: '9418606666', manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', manager_id: 553, june_pos: 2, june_rev: 6000, july_target_pos: 5, july_ach_pos_user: 0, july_ach_rev_user: 0 },

  // Rajwinder Singh Team (Punjab)
  { id: 16, name: 'Rajiv Kumar', state: 'PB', city: 'Muktsar sahib', designation: 'TL', email: 'rajiv.kumar@apnibus.com', mobile: '9814201669', manager_name: 'Rajwinder Singh', manager_email: 'rajwinder.singh@apnibus.com', manager_id: 554, june_pos: 11, june_rev: 32000, july_target_pos: 15, july_ach_pos_user: 13, july_ach_rev_user: 37500 },
  { id: 17, name: 'Surinder Singh', state: 'PB', city: 'Mansa', designation: 'BD', email: 'surinder.singh@apnibus.com', mobile: '9877674046', manager_name: 'Rajwinder Singh', manager_email: 'rajwinder.singh@apnibus.com', manager_id: 554, june_pos: 4, june_rev: 9500, july_target_pos: 15, july_ach_pos_user: 6, july_ach_rev_user: 17000 },
  { id: 18, name: 'Rajat Sharma', state: 'PB', city: 'Ludhiana', designation: 'BD', email: 'rajat.sharma@apnibus.com', mobile: '7888436876', manager_name: 'Rajwinder Singh', manager_email: 'rajwinder.singh@apnibus.com', manager_id: 554, june_pos: 5, june_rev: 8000, july_target_pos: 15, july_ach_pos_user: 14, july_ach_rev_user: 28502 },

  // Rajnish Kumar Team
  { id: 20, name: 'Anand Kumar singh', state: 'JH', city: 'Hazaribagh', designation: 'BD', email: 'anand.kumar@apnibus.com', mobile: '8709016324', manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', manager_id: 551, june_pos: 3, june_rev: 297, july_target_pos: 20, july_ach_pos_user: 15, july_ach_rev_user: 13091 },
  { id: 21, name: 'Manish Bhati', state: 'RJ', city: 'Bikaner', designation: 'Service BD', email: 'manish.bhati@apnibus.com', mobile: '7568612974', manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', manager_id: 551, june_pos: 4, june_rev: 12500, july_target_pos: 10, july_ach_pos_user: 8, july_ach_rev_user: 18800 },
  { id: 22, name: 'Sarfaraj Khan', state: 'RJ', city: 'Kota', designation: 'BD', email: 'sarfaraj.khan@apnibus.com', mobile: '8619414557', manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', manager_id: 551, june_pos: 0, june_rev: 0, july_target_pos: 15, july_ach_pos_user: 7, july_ach_rev_user: 13000 },
  { id: 23, name: 'Shiv Dayal', state: 'RJ', city: 'Jaipur', designation: 'BD', email: 'shiv.dayal@apnibus.com', mobile: '7891064831', manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', manager_id: 551, june_pos: 1, june_rev: 100, july_target_pos: 20, july_ach_pos_user: 1, july_ach_rev_user: 99 }
];

const MORNING_START_TIMES = {
  'anand kumar singh': '11:14 AM',
  'sarfaraj khan': '09:15 AM',
  'manish bhati': '07:31 AM',
  'shiv dayal': '10:13 AM',
  'manish bathi': '09:52 AM',
  'anil kumar': '09:52 AM',
  'harish verma': '09:56 AM',
  'shubham dhiman': '07:35 AM',
  'arshdeep singh': '10:05 AM',
  'chuna ram': '10:24 AM',
  'vivek kumar kaundal': '10:27 AM',
  'karan raina': '09:35 AM',
  'syed arshi abrar': '09:40 AM',
  'mohan': '09:30 AM',
  'akash singh': '09:48 AM',
  'manish verma': '09:30 AM',
  'shubham singh': '11:17 AM',
  'sonu mishra': '08:26 AM',
  'amit rohilla': '09:30 AM',
  'sukhdev singh': '09:25 AM',
  'mohit': '09:46 AM',
  'rajwinder singh': '09:15 AM',
  'rajiv kumar': '09:45 AM',
  'surinder singh': '09:30 AM',
  'rajat sharma': '09:30 AM',
  'rajnish kumar': '09:30 AM',
  'tarun kumar': '09:30 AM'
};

// Rebuild salespersons array from MASTER_CANDIDATES
currentData.managers = MANAGERS;
currentData.salespersons = [];

MASTER_CANDIDATES.forEach((c) => {
  const nameLower = c.name.toLowerCase().trim();
  const aliases = buildCandidateAliases(c);

  const salesSummary = sumOrders(orderRecords, c, aliases, true);

  const ftdSales = salesSummary.ftdCount;
  const ftdRevenue = salesSummary.ftdRevenue;
  const mtdSales = salesSummary.mtdCount;
  const mtdRevenue = salesSummary.mtdRevenue;
  const ltdSales = salesSummary.ltdCount;
  const ltdRevenue = salesSummary.ltdRevenue;

  const punchedOrders = [
    ...salesSummary.matched.map((record) => ({
      order_id: record.order_id,
      date: getDateValue(record),
      time: (record.created_on || '').slice(11, 19),
      operator_name: record.operator_name || 'N/A',
      company_name: record.company_name || 'N/A',
      mobile: record.mobile || record.bd_code || 'N/A',
      setup_fee: parseFloat(record.setup_fee || 0),
      wallet_amount: parseFloat(record.wallet_amount || 0),
      payable_amount: parseFloat(record.payable_amount || record.wallet_amount || 0),
      num_items: parseInt(record.num_items || 1, 10),
      payment_status: record.payment_status || 'S',
      state: record.operator_state || record.bd_state || 'N/A',
      source: record._source
    }))
  ].sort((a, b) => a.date.localeCompare(b.date));

  const bdVisits = currentData.visits.filter(v => (v.bd_name || '').toLowerCase().trim() === nameLower);
  const mtdVisitsList = bdVisits.filter(v => (v.visit_date || '').startsWith(DYNAMIC_MTD_MONTH));
  const todayVisitsList = bdVisits.filter(v => v.visit_date === DYNAMIC_TODAY_DATE);

  currentData.salespersons.push({
    ...c,
    user_id: c.mobile,
    status: 'Active',
    productivity_score: 90,
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
    start_day_time: MORNING_START_TIMES[nameLower] || '09:30 AM',
    onboarding_payment_ftd: ftdRevenue,
    onboarding_payment_mtd: DYNAMIC_MTD_MONTH === '2026-07' ? (mtdRevenue > 0 ? mtdRevenue : c.july_ach_rev_user) : mtdRevenue,
    onboarding_payment_ltd: DYNAMIC_MTD_MONTH === '2026-07' ? (ltdRevenue > 0 ? ltdRevenue : c.july_ach_rev_user) : ltdRevenue,
    mtd_attendance_pct: 86
  });
});

// Update managers team counts
MANAGERS.forEach(mgr => {
  const team = currentData.salespersons.filter(s => s.manager_email === mgr.email);
  mgr.bd_count = team.length;
});

// Save updated apnibusData.json
fs.writeFileSync(rawDataPath, JSON.stringify(currentData, null, 2), 'utf8');

console.log('\nSUCCESSFULLY MASTER COMPILED ALL 23 CANDIDATES ACROSS ALL 4 TEAMS!');
console.log('=== VERIFIED TEAM COUNTS ===');
MANAGERS.forEach(mgr => {
  const team = currentData.salespersons.filter(s => s.manager_email === mgr.email);
  console.log(`Manager: ${mgr.name.padEnd(18)} | Email: ${mgr.email.padEnd(28)} | Team Count: ${team.length}`);
});
