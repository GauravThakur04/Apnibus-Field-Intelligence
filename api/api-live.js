import https from 'https';
import http from 'http';
import { URL } from 'url';
import zlib from 'zlib';

export const config = { maxDuration: 60 };

// All possible date column names across every CSV source
const DATE_COLUMN_NAMES = [
  'visit_date',
  'created_on',
  'order_date',
  'date',
  'attendance_date',
  'punch_date',
  'start_date',
  'transaction_date',
  'record_date',
];

export default async function handler(req, res) {
  const target = req.query.target;
  if (!target) {
    res.status(400).json({ error: 'Missing target URL' });
    return;
  }

  let targetUrl;
  try {
    targetUrl = new URL(target);
  } catch (err) {
    res.status(400).json({ error: 'Invalid target URL', details: err.message });
    return;
  }

  try {
    const csvText = await fetchFollowRedirects(targetUrl.toString(), 5);

    // ── Dynamic MTD filter ──
    // Current month in IST (UTC+5:30), e.g. "2026-08"
    const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    const currentMonth = `${nowIST.getUTCFullYear()}-${String(nowIST.getUTCMonth() + 1).padStart(2, '0')}`;

    const filtered = filterCSVToMonth(csvText, currentMonth);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const rowCount = (filtered.match(/\n/g) || []).length;
    res.setHeader('X-MTD-Rows', String(rowCount));
    res.setHeader('X-MTD-Month', currentMonth);
    res.status(200).send(filtered);
  } catch (err) {
    res.status(502).json({ error: 'Proxy failed', details: err.message });
  }
}

function filterCSVToMonth(csvText, monthPrefix) {
  const lines = csvText.split('\n');
  if (lines.length < 2) return csvText;

  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map(h => h.replace(/"/g, '').trim().toLowerCase());

  let dateIdx = -1;
  let foundColName = '';
  for (const colName of DATE_COLUMN_NAMES) {
    const idx = headers.indexOf(colName);
    if (idx !== -1) {
      dateIdx = idx;
      foundColName = colName;
      break;
    }
  }

  if (dateIdx === -1) {
    return csvText;
  }

  const filteredLines = [headerLine];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const cols = parseCSVLine(line);
    const dateVal = (cols[dateIdx] || '').replace(/"/g, '').trim();

    if (!dateVal || dateVal.startsWith(monthPrefix)) {
      filteredLines.push(line);
    }
  }
  return filteredLines.join('\n');
}

function parseCSVLine(line) {
  const cols = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQ = !inQ; cur += c; }
    else if (c === ',' && !inQ) { cols.push(cur); cur = ''; }
    else cur += c;
  }
  cols.push(cur);
  return cols;
}

function fetchFollowRedirects(url, maxRedirects) {
  return new Promise((resolve, reject) => {
    const doRequest = (reqUrl, redirectsLeft) => {
      const parsedUrl = new URL(reqUrl);
      const lib = parsedUrl.protocol === 'https:' ? https : http;

      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'User-Agent': 'ApniBus-Vercel-Proxy/3.0',
          'Accept': 'text/csv,*/*',
          'Accept-Encoding': 'identity',
        }
      };

      const req = lib.request(options, (proxyRes) => {
        if ([301, 302, 303, 307, 308].includes(proxyRes.statusCode) && proxyRes.headers.location) {
          if (redirectsLeft <= 0) return reject(new Error('Too many redirects'));
          const nextUrl = proxyRes.headers.location.startsWith('http')
            ? proxyRes.headers.location
            : new URL(proxyRes.headers.location, reqUrl).toString();
          proxyRes.resume();
          return doRequest(nextUrl, redirectsLeft - 1);
        }

        if (proxyRes.statusCode !== 200) {
          proxyRes.resume();
          return reject(new Error(`HTTP ${proxyRes.statusCode} from ${reqUrl}`));
        }

        const encoding = (proxyRes.headers['content-encoding'] || '').toLowerCase();
        let stream = proxyRes;
        if (encoding === 'gzip')    stream = proxyRes.pipe(zlib.createGunzip());
        else if (encoding === 'deflate') stream = proxyRes.pipe(zlib.createInflate());
        else if (encoding === 'br') stream = proxyRes.pipe(zlib.createBrotliDecompress());

        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        stream.on('error', reject);
      });

      req.on('error', reject);
      req.setTimeout(55000, () => {
        req.destroy();
        reject(new Error('Metabase request timed out after 55s'));
      });
      req.end();
    };

    doRequest(url, maxRedirects);
  });
}
