import https from 'https';
import { URL } from 'url';

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

  const options = {
    method: 'GET',
    headers: {
      'User-Agent': 'ApniBus-Vercel-Proxy/1.0',
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br'
    }
  };

  const proxyRequest = https.request(targetUrl, options, (proxyRes) => {
    if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
      const redirectUrl = new URL(proxyRes.headers.location, targetUrl);
      https.get(redirectUrl, (redirectRes) => {
        forwardResponse(redirectRes, res);
      }).on('error', (err) => {
        res.status(502).json({ error: 'Redirect fetch failed', details: err.message });
      });
      return;
    }

    forwardResponse(proxyRes, res);
  });

  proxyRequest.on('error', (err) => {
    res.status(502).json({ error: 'Proxy request failed', details: err.message });
  });

  proxyRequest.end();
}

function forwardResponse(sourceRes, destRes) {
  const headers = { ...sourceRes.headers };
  if (headers['content-security-policy']) delete headers['content-security-policy'];
  if (headers['x-frame-options']) delete headers['x-frame-options'];
  if (headers['x-content-type-options']) delete headers['x-content-type-options'];
  destRes.writeHead(sourceRes.statusCode || 200, headers);
  sourceRes.pipe(destRes);
}
