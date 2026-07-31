const fs = require('fs');
const path = require('path');

// 1. Read existing apnibusData.json
const rawDataPath = path.join(__dirname, 'src/data/apnibusData.json');
const currentData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

// 2. Read full_onboarding_payment.csv (fe85fe32-ac30-499e-9c63-05804c72c4b6.csv)
const csvPath = path.join(__dirname, 'src/data/full_onboarding_payment.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

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

const lines = csvContent.split('\n');
const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

const orderRecords = [];
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const parts = parseCSVLine(lines[i]);
  if (parts.length < 5) continue;
  
  const rec = {};
  headers.forEach((h, idx) => { rec[h] = parts[idx] || ''; });
  orderRecords.push(rec);
}

// Dynamic Date Detection
const validDates = orderRecords
  .map(o => (o.created_on || '').slice(0, 10))
  .filter(d => d && d.match(/^\d{4}-\d{2}-\d{2}$/))
  .sort();

const DYNAMIC_TODAY_DATE = validDates[validDates.length - 1] || new Date().toISOString().slice(0, 10);
const DYNAMIC_MTD_MONTH = DYNAMIC_TODAY_DATE.slice(0, 7); // YYYY-MM

// Map aliases (including manual data for Sonu Mishra team)
const ALIAS_MAP = {
  // Sonu Mishra Team (EXACT MANUAL DATA)
  '8750710855': 'sonu mishra',
  'sonu mishra': 'sonu mishra',

  '9315883000': 'amit rohilla',
  'amit rohilla': 'amit rohilla',
  'amit': 'amit rohilla',

  '9306703845': 'sukhdev singh',
  'sukhdev singh': 'sukhdev singh',

  '7355982328': 'shubham singh',
  'shubham singh': 'shubham singh',

  '9053775782': 'mohit',
  'mohit': 'mohit',

  // Rajnish Kumar Team
  '8709016324': 'anand kumar singh',
  'anand kumar singh': 'anand kumar singh',

  '8619414557': 'sarfaraj khan',
  'sarfaraj khan': 'sarfaraj khan',

  '7568612974': 'manish bhati',
  'manish bhati': 'manish bhati',

  '7891064831': 'shiv dayal',
  'shiv dayal': 'shiv dayal',

  // Tarun Kumar Team
  '9805254456': 'harish verma',
  'harish verma': 'harish verma',

  '7018778473': 'shubham dhiman',
  'shubham dhiman': 'shubham dhiman',

  '8000304871': 'arshdeep singh',
  'arshdeep singh': 'arshdeep singh',

  '9799862695': 'chuna ram',
  'chuna ram': 'chuna ram',

  '8219990300': 'vivek kumar kaundal',
  'vivek kumar kaundal': 'vivek kumar kaundal',

  '9805472672': 'karan raina',
  'karan raina': 'karan raina',

  '9953226633': 'syed arshi abrar',
  'syed arshi abrar': 'syed arshi abrar',

  '8447780900': 'akash singh',
  'akash singh': 'akash singh'
};

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
  'mohit': '09:46 AM'
};

// Remove Rahul Kumar Uppal
currentData.salespersons = currentData.salespersons.filter(s => s.name.toLowerCase().trim() !== 'rahul kumar uppal');

currentData.salespersons.forEach((sp) => {
  const nameLower = sp.name.toLowerCase().trim();
  
  let ftdOrderCount = 0, ftdRevenue = 0;
  let mtdOrderCount = 0, mtdRevenue = 0;
  let ltdOrderCount = 0, ltdRevenue = 0;
  const punchedOrders = [];

  orderRecords.forEach(o => {
    if (o.payment_status === 'C') return;
    
    const rm = (o.rm_name || '').trim().toLowerCase();
    const code = (o.bd_code || '').trim();

    const matchedKey = ALIAS_MAP[code] || ALIAS_MAP[rm];
    const isMatch = matchedKey === nameLower || (rm && rm === nameLower);
    if (!isMatch) return;

    const qty = parseInt(o.num_items) || 1;
    const amt = parseFloat(o.payable_amount) || parseFloat(o.wallet_amount) || 0;
    const setupFee = parseFloat(o.setup_fee) || 0;
    const walletAmt = parseFloat(o.wallet_amount) || 0;
    const dateStr = (o.created_on || '').slice(0, 10);
    const timeStr = (o.created_on || '').slice(11, 19);

    punchedOrders.push({
      order_id: o.order_id,
      date: dateStr,
      time: timeStr,
      operator_name: o.operator_name || 'N/A',
      company_name: o.company_name || 'N/A',
      mobile: o.mobile || 'N/A',
      setup_fee: setupFee,
      wallet_amount: walletAmt,
      payable_amount: amt,
      num_items: qty,
      payment_status: o.payment_status || 'S',
      state: o.operator_state || o.bd_state || 'N/A'
    });

    ltdOrderCount++;
    ltdRevenue += amt;

    if (dateStr.startsWith(DYNAMIC_MTD_MONTH)) {
      mtdOrderCount++;
      mtdRevenue += amt;

      if (dateStr === DYNAMIC_TODAY_DATE) {
        ftdOrderCount++;
        ftdRevenue += amt;
      }
    }
  });

  const bdVisits = currentData.visits.filter(v => (v.bd_name || '').toLowerCase().trim() === nameLower);
  const mtdVisitsList = bdVisits.filter(v => (v.visit_date || '').startsWith(DYNAMIC_MTD_MONTH));
  const todayVisitsList = bdVisits.filter(v => v.visit_date === DYNAMIC_TODAY_DATE);

  sp.today_visits = todayVisitsList.length;
  sp.mtd_visits = mtdVisitsList.length;
  sp.ltd_visits = bdVisits.length;

  sp.ftd_sales = ftdOrderCount;
  sp.ftd_revenue = ftdRevenue;
  sp.mtd_sales = mtdOrderCount;
  sp.mtd_revenue = mtdRevenue;
  sp.ltd_sales = ltdOrderCount;
  sp.ltd_revenue = ltdRevenue;
  sp.sale_punches = mtdOrderCount;
  sp.punched_orders = punchedOrders;
  sp.onboarding_payment_ftd = ftdRevenue;
  sp.onboarding_payment_mtd = mtdRevenue;
  sp.onboarding_payment_ltd = ltdRevenue;

  if (MORNING_START_TIMES[nameLower]) {
    sp.start_day_time = MORNING_START_TIMES[nameLower];
  }
});

// Save updated apnibusData.json
fs.writeFileSync(rawDataPath, JSON.stringify(currentData, null, 2), 'utf8');

console.log('\nSuccessfully saved Sonu Mishra team exact manual mapping to apnibusData.json!');
console.log('=== VERIFIED SONU MISHRA TEAM IN APNIBUSDATA.JSON ===');
const sonuTeam = currentData.salespersons.filter(s => s.manager_name.includes('Sonu'));
sonuTeam.forEach(s => {
  console.log(`BD: ${s.name.padEnd(16)} | Phone: ${s.mobile} | June POS: ${s.june_pos || 0} | June Rev: ₹ ${(s.june_rev || 0).toLocaleString()} | July Target: ${s.july_target_pos || 0} | July Ach POS: ${s.mtd_sales || 0} | July Revenue: ₹ ${s.mtd_revenue.toLocaleString()}`);
});
