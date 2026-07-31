const fs = require('fs');
const path = require('path');

// 1. Read existing apnibusData.json
const rawDataPath = path.join(__dirname, 'src/data/apnibusData.json');
const currentData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

// 2. Read actual_bd_revenue.csv
const csvPath = path.join(__dirname, 'src/data/actual_bd_revenue.csv');
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

console.log(`Loaded ${orderRecords.length} actual revenue order records.`);

// Comprehensive Map of Phone / RM Name aliases to exact Salesperson ID/Name
const ALIAS_MAP = {
  // Anand Kumar Singh
  '8709016324': 'anand kumar singh',
  'anand kumar singh': 'anand kumar singh',
  'anand kumar': 'anand kumar singh',

  // Sarfaraj Khan
  '8619414557': 'sarfaraj khan',
  'sarfaraj khan': 'sarfaraj khan',

  // Manish Bhati
  '7568612974': 'manish bhati',
  'manish bhati': 'manish bhati',

  // Shiv Dayal
  '7891064831': 'shiv dayal',
  'shiv dayal': 'shiv dayal',

  // Harish Verma
  '9805254456': 'harish verma',
  'harish verma': 'harish verma',

  // Shubham Dhiman
  '7018778473': 'shubham dhiman',
  'shubham dhiman': 'shubham dhiman',

  // Arshdeep Singh
  '8000304871': 'arshdeep singh',
  'arshdeep singh': 'arshdeep singh',

  // Chuna Ram
  '9799862695': 'chuna ram',
  'chuna ram': 'chuna ram',

  // Vivek kumar kaundal
  '8219990300': 'vivek kumar kaundal',
  'vivek kumar kaundal': 'vivek kumar kaundal',

  // Karan Raina
  '9805472672': 'karan raina',
  'karan raina': 'karan raina',

  // Syed Arshi Abrar
  '9953226633': 'syed arshi abrar',
  'syed arshi abrar': 'syed arshi abrar',

  // Rahul Kumar Uppal (Punjab - 9814201669 is strictly Rahul Kumar Uppal)
  '9814201669': 'rahul kumar uppal',
  'rahul kumar uppal': 'rahul kumar uppal',

  // Akash Singh
  '8447780900': 'akash singh',
  'akash singh': 'akash singh',

  // Shubham Singh
  '7355982328': 'shubham singh',
  'shubham singh': 'shubham singh',

  // Sonu Mishra
  '8750710855': 'sonu mishra',
  '9315883000': 'sonu mishra',
  'sonu mishra': 'sonu mishra',

  // Sukhdev Singh
  '9306703845': 'sukhdev singh',
  'sukhdev singh': 'sukhdev singh',

  // Surinder Singh
  '9877674046': 'surinder singh',
  'surinder singh': 'surinder singh',

  // Rajat Sharma
  '7888436876': 'rajat sharma',
  'rajat sharma': 'rajat sharma'
};

const TODAY_DATE = '2026-07-30';

// Calculate exact candidate stats and attach order punches to each BD
currentData.salespersons.forEach((sp) => {
  const nameLower = sp.name.toLowerCase().trim();
  
  let ftdSales = 0, ftdRevenue = 0;
  let mtdSales = 0, mtdRevenue = 0;
  let ltdSales = 0, ltdRevenue = 0;
  const punchedOrders = [];

  orderRecords.forEach(o => {
    if (o.payment_status === 'C') return; // exclude cancelled orders
    
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
      state: o.operator_state || o.bd_state || 'Punjab'
    });

    ltdSales += qty;
    ltdRevenue += amt;

    if (dateStr.startsWith('2026-07')) {
      mtdSales += qty;
      mtdRevenue += amt;
    }

    if (dateStr === TODAY_DATE) {
      ftdSales += qty;
      ftdRevenue += amt;
    }
  });

  sp.ftd_sales = ftdSales;
  sp.ftd_revenue = ftdRevenue;
  sp.mtd_sales = mtdSales;
  sp.mtd_revenue = mtdRevenue;
  sp.ltd_sales = ltdSales;
  sp.ltd_revenue = ltdRevenue;
  sp.sale_punches = mtdSales;
  sp.punched_orders = punchedOrders; // Attach order punching history!
});

// Save updated apnibusData.json
fs.writeFileSync(rawDataPath, JSON.stringify(currentData, null, 2), 'utf8');

console.log('Successfully updated apnibusData.json with RAHUL KUMAR UPPAL FIX & ORDER PUNCHING HISTORY!');
console.log('=== VERIFIED RESULTS ===');
currentData.salespersons.forEach(sp => {
  console.log(`BD: ${sp.name.padEnd(20)} | Orders Punched: ${String(sp.punched_orders.length).padEnd(4)} | FTD: ${sp.ftd_sales} (₹ ${sp.ftd_revenue}) | MTD: ${sp.mtd_sales} (₹ ${sp.mtd_revenue.toLocaleString()}) | LTD: ${sp.ltd_sales} (₹ ${sp.ltd_revenue.toLocaleString()})`);
});
