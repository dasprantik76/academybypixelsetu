import http from 'node:http';
import { readFile, stat, cp } from 'node:fs/promises';
import { watch } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
try { process.loadEnvFile(path.join(root, '.env.local')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }

const routes = new Set(['google-login', 'data', 'imagekit-auth', 'pincode', 'validate-email']);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.json': 'application/json; charset=utf-8'
};

const liveClients = new Set();
function notifyLiveReload() {
  for (const client of liveClients) {
    try {
      client.write('data: reload\n\n');
    } catch {}
  }
}

const publicFiles = [
  'index.html',
  'admin.html',
  'superadmin.html',
  'superadmin-style.css',
  'superadmin-script.js',
  'admin-config.js',
  'admin-script.js',
  'certificate-canvas.js',
  'admin-style.css',
  'assets',
  'public-site'
];

let syncTimer = null;
function scheduleSync(filename) {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(async () => {
    try {
      const publicRoot = path.join(root, 'public');
      if (filename && publicFiles.includes(filename)) {
        await cp(path.join(root, filename), path.join(publicRoot, filename), { recursive: true });
      } else {
        await Promise.all(
          publicFiles.map(file => cp(path.join(root, file), path.join(publicRoot, file), { recursive: true }))
        );
      }
      notifyLiveReload();
    } catch (err) {
      console.error('Auto-sync error:', err.message);
    }
  }, 80);
}

try {
  watch(root, { recursive: false }, (eventType, filename) => {
    if (filename && publicFiles.includes(filename)) {
      scheduleSync(filename);
    }
  });
  const publicSiteDir = path.join(root, 'public-site');
  watch(publicSiteDir, { recursive: true }, () => {
    notifyLiveReload();
  });
} catch (e) {
  console.warn('Watch notice:', e.message);
}

const LIVE_RELOAD_SNIPPET = `
<!-- Live Reload Client -->
<script>
(() => {
  let retries = 0;
  function initLiveReload() {
    const es = new EventSource('/_live_reload');
    es.onmessage = (e) => {
      if (e.data === 'reload') {
        window.location.reload();
      }
    };
    es.onerror = () => {
      es.close();
      if (++retries < 20) setTimeout(initLiveReload, 1500);
    };
  }
  initLiveReload();
})();
</script>
</body>`;

const server = http.createServer(async (req, res) => {
  res.status = code => { res.statusCode = code; return res; };
  res.send = body => res.end(body);
  res.json = body => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)); };
  try {
    const url = new URL(req.url, 'http://localhost');

    // Live reload SSE endpoint
    if (url.pathname === '/_live_reload') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      res.write('retry: 1500\n\ndata: connected\n\n');
      liveClients.add(res);
      req.on('close', () => liveClients.delete(res));
      return;
    }

    if (url.pathname.startsWith('/api/')) {
      const route = url.pathname.slice(5).replace(/\.js$/, '');
      if (!routes.has(route)) return res.status(404).end('Not found');
      req.query = Object.fromEntries(url.searchParams);
      let size = 0;
      const chunks = [];
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 5 * 1024 * 1024) return res.status(413).end('Request too large');
        chunks.push(chunk);
      }
      const body = Buffer.concat(chunks).toString('utf8');
      try {
        req.body = req.headers['content-type']?.includes('application/json')
          ? (body ? JSON.parse(body) : {}) : Object.fromEntries(new URLSearchParams(body));
      } catch { return res.status(400).end('Invalid request body'); }
      const { default: handler } = await import(`./api/${route}.js?t=${Date.now()}`);
      return await handler(req, res);
    }
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.setHeader('Allow', 'GET, HEAD');
      return res.status(405).end('Method not allowed');
    }
    if (url.pathname === '/login.html') {
      res.setHeader('Location', '/');
      return res.status(302).end();
    }
    if (url.pathname === '/favicon.ico') {
      res.writeHead(204).end();
      return;
    }

    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    let targetRoot = path.join(root, 'public');
    let targetRelative = relative;

    if (url.pathname === '/a' || url.pathname === '/a/') {
      res.setHeader('Location', '/');
      return res.status(302).end();
    }
    if (url.pathname.startsWith('/a/')) {
      const cleanPath = url.pathname.replace(/^\/a\//, '');
      const possibleExt = path.extname(cleanPath);
      if (possibleExt && types[possibleExt]) {
        const targetFilename = cleanPath.split('/').pop();
        let assetPath = path.join(root, 'public-site', targetFilename);
        if (cleanPath.includes('assets/')) {
          const sub = cleanPath.slice(cleanPath.indexOf('assets/'));
          assetPath = path.join(root, 'public-site', sub);
        }
        targetRoot = path.join(root, 'public-site');
        targetRelative = path.relative(targetRoot, assetPath);
      } else {
        targetRoot = path.join(root, 'public-site');
        targetRelative = 'index.html';
      }
    } else if (url.pathname.startsWith('/academy/')) {
      const slug = url.pathname.replace(/^\/academy\/?/, '').trim();
      if (slug) {
        res.setHeader('Location', `/a/${encodeURIComponent(slug)}`);
        return res.status(302).end();
      }
    } else if (relative.startsWith('public-site/') || relative === 'public-site') {
      targetRoot = path.join(root, 'public-site');
      targetRelative = relative.replace(/^public-site\/?/, '') || 'index.html';
    }
    const file = path.resolve(targetRoot, targetRelative);
    if ((!file.startsWith(targetRoot + path.sep) && file !== targetRoot) || relative.split('/').some(part => part.startsWith('.'))) {
      return res.status(404).end('Not found');
    }
    const info = await stat(file);
    if (!info.isFile()) return res.status(404).end('Not found');
    
    const ext = path.extname(file);
    res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'HEAD') {
      return res.end();
    }

    let fileContent = await readFile(file);
    if (ext === '.html') {
      const html = fileContent.toString('utf8');
      if (html.includes('</body>')) {
        fileContent = Buffer.from(html.replace('</body>', LIVE_RELOAD_SNIPPET));
      }
    }
    res.end(fileContent);
  } catch (error) {
    console.error('Local request failed:', error.message);
    if (!res.headersSent) res.status(error.code === 'ENOENT' ? 404 : 500);
    res.end('Request failed');
  }
});

const PORT = Number(process.env.PORT || 4000);
server.listen(PORT, () => {
  console.log(`Live Server running at http://localhost:${PORT} and http://127.0.0.1:${PORT}`);
});

if (PORT !== 3000) {
  const server3000 = http.createServer((req, res) => server.emit('request', req, res));
  server3000.on('error', () => {});
  server3000.listen(3000, () => {
    console.log(`Also listening on port 3000 at http://localhost:3000`);
  });
}
