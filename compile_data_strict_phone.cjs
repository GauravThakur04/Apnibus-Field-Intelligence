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

// Exact Phone Number Mapping per BD
const BD_PHONE_MAP = {
  'anand kumar singh': ['8709016324'],
  'sarfaraj khan': ['8619414557'],
  'manish bhati': ['7568612974'],
  'shiv dayal': ['7891064831'],
  'manish bathi': ['7568612974'],
  'anil kumar': ['9814201669'],
  'harish verma': ['9805254456'],
  'shubham dhiman': ['7018778473', '9814201669'],
  'arshdeep singh': ['8000304871'],
  'chuna ram': ['9799862695'],
  'vivek kumar kaundal': ['8219990300'],
  'karan raina': ['9805472672'],
  'syed arshi abrar': ['9953226633'],
  'mohan': ['9315883000'],
  'rahul kumar uppal': ['9814201669'],
  'akash singh': ['8447780900'],
  'manish verma': ['9805255456'],
  'amit kumar': ['9315883000'],
  'shubham singh': ['7355982328'],
  'sonu mishra': ['8750710855', '9315883000'],
  'sukhdev singh': ['9306703845'],
  'mannu rai': ['9315883000']
};

const TODAY_DATE = '2026-07-30';

currentData.salespersons.forEach((sp) => {
  const nameKey = sp.name.toLowerCase().trim();
  const phones = BD_PHONE_MAP[nameKey] || [];
  
  let ftdSales = 0;
  let ftdRevenue = 0;
  let mtdSales = 0;
  let mtdRevenue = 0;
  let ltdSales = 0;
  let ltdRevenue = 0;

  orderRecords.forEach(o => {
    if (o.payment_status && o.payment_status !== 'S') return; // successful payments only
    const bdCode = (o.bd_code || '').trim();
    if (!phones.includes(bdCode)) return; // STRICT PHONE NUMBER MATCHING ONLY!
    
    const dateStr = (o.created_on || '').slice(0, 10);
    const amount = parseFloat(o.payable_amount) || parseFloat(o.wallet_amount) || 0;

    ltdSales += 1;
    ltdRevenue += amount;

    if (dateStr.startsWith('2026-07')) {
      mtdSales += 1;
      mtdRevenue += amount;
    }

    if (dateStr === TODAY_DATE) {
      ftdSales += 1;
      ftdRevenue += amount;
    }
  });

  sp.phone_numbers = phones;
  sp.ftd_sales = ftdSales;
  sp.ftd_revenue = ftdRevenue;
  sp.mtd_sales = mtdSales;
  sp.mtd_revenue = mtdRevenue;
  sp.ltd_sales = ltdSales;
  sp.ltd_revenue = ltdRevenue;
  sp.sale_punches = mtdSales;
});

// Save updated apnibusData.json
fs.writeFileSync(rawDataPath, JSON.stringify(currentData, null, 2), 'utf8');

console.log('Successfully updated apnibusData.json with STRICT PHONE NUMBER ONLY mapping!');
console.log('=== STRICT PHONE MATCHED RESULTS ===');
currentData.salespersons.forEach(sp => {
  console.log(`BD: ${sp.name.padEnd(20)} | Phone: ${sp.phone_numbers.join(',').padEnd(22)} | FTD Sales: ${sp.ftd_sales} (₹ ${sp.ftd_revenue}) | MTD Sales: ${sp.mtd_sales} (₹ ${sp.mtd_revenue.toLocaleString()})`);
});
