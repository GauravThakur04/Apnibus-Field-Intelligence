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

  // Follow redirects and decompress response, returning plain CSV text
  try {
    const csvText = await fetchFollowRedirects(targetUrl.toString(), 5);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(csvText);
  } catch (err) {
    res.status(502).json({ error: 'Proxy failed', details: err.message });
  }
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
          // Request plain text — no compression so we can read it directly
          'Accept-Encoding': 'identity',
        }
      };

      const req = lib.request(options, (res) => {
        // Follow redirects
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          if (redirectsLeft <= 0) return reject(new Error('Too many redirects'));
          const nextUrl = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, reqUrl).toString();
          // Drain the redirect response body
          res.resume();
          return doRequest(nextUrl, redirectsLeft - 1);
        }

        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode} from ${reqUrl}`));
        }

        // Handle any compression that slipped through
        const encoding = (res.headers['content-encoding'] || '').toLowerCase();
        let stream = res;
        if (encoding === 'gzip') stream = res.pipe(zlib.createGunzip());
        else if (encoding === 'deflate') stream = res.pipe(zlib.createInflate());
        else if (encoding === 'br') stream = res.pipe(zlib.createBrotliDecompress());

        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        stream.on('error', reject);
      });

      req.on('error', reject);
      req.setTimeout(55000, () => { req.destroy(); reject(new Error('Request timeout')); });
      req.end();
    };

    doRequest(url, maxRedirects);
  });
}
