import https from 'https';
import http from 'http';
import { URL } from 'url';
import zlib from 'zlib';

export const config = { maxDuration: 60 };

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

    // ── MTD filter: keep only header + rows for current month ──
    // Current month in IST (UTC+5:30)
    const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    const currentMonth = `${nowIST.getUTCFullYear()}-${String(nowIST.getUTCMonth() + 1).padStart(2, '0')}`; // e.g. "2026-08"

    const filtered = filterCSVToMonth(csvText, currentMonth);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(filtered);
  } catch (err) {
    res.status(502).json({ error: 'Proxy failed', details: err.message });
  }
}

/**
 * Filter a CSV string to only include rows where the visit_date column
 * starts with the given month prefix (YYYY-MM).
 * Always returns the header row regardless.
 */
function filterCSVToMonth(csvText, monthPrefix) {
  const lines = csvText.split('\n');
  if (lines.length === 0) return csvText;

  const header = lines[0];
  // Find visit_date column index
  const headers = parseCSVLine(header);
  const dateIdx = headers.findIndex(h =>
    h.replace(/"/g, '').trim().toLowerCase() === 'visit_date'
  );

  if (dateIdx === -1) {
    // No visit_date column found — return as-is (sales/onboarding CSVs)
    return csvText;
  }

  const filteredLines = [header];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cols = parseCSVLine(line);
    const dateVal = (cols[dateIdx] || '').replace(/"/g, '').trim();
    if (dateVal.startsWith(monthPrefix)) {
      filteredLines.push(line);
    }
  }

  return filteredLines.join('\n');
}

/** Minimal CSV line splitter (handles quoted commas) */
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
          'User-Agent': 'ApniBus-Vercel-Proxy/2.0',
          'Accept': 'text/csv,*/*',
          'Accept-Encoding': 'identity', // plain text — no gzip compression
        }
      };

      const req = lib.request(options, (proxyRes) => {
        // Follow redirects
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

        // Decompress if needed
        const encoding = (proxyRes.headers['content-encoding'] || '').toLowerCase();
        let stream = proxyRes;
        if (encoding === 'gzip') stream = proxyRes.pipe(zlib.createGunzip());
        else if (encoding === 'deflate') stream = proxyRes.pipe(zlib.createInflate());
        else if (encoding === 'br') stream = proxyRes.pipe(zlib.createBrotliDecompress());

        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        stream.on('error', reject);
      });

      req.on('error', reject);
      req.setTimeout(55000, () => { req.destroy(); reject(new Error('Request timeout after 55s')); });
      req.end();
    };

    doRequest(url, maxRedirects);
  });
}
