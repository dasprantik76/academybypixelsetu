import { createPublicKey, createVerify, randomBytes } from 'node:crypto';

const GOOGLE_CLIENT_ID = '330236506368-38k618t0l8ick1rosohr9g3ui1teljhg.apps.googleusercontent.com';
const GOOGLE_CERTS_URL = 'https://www.googleapis.com/oauth2/v3/certs';

function decodeBase64Url(value) {
  return Buffer.from(value, 'base64url');
}

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map(part => {
    const separator = part.indexOf('=');
    if (separator < 0) return ['', ''];
    return [part.slice(0, separator).trim(), decodeURIComponent(part.slice(separator + 1).trim())];
  }).filter(([key]) => key));
}

async function verifyGoogleCredential(credential) {
  const parts = String(credential || '').split('.');
  if (parts.length !== 3) throw new Error('Malformed credential');

  const header = JSON.parse(decodeBase64Url(parts[0]).toString('utf8'));
  const payload = JSON.parse(decodeBase64Url(parts[1]).toString('utf8'));
  if (header.alg !== 'RS256' || !header.kid) throw new Error('Unsupported credential');

  const response = await fetch(GOOGLE_CERTS_URL);
  if (!response.ok) throw new Error('Google signing keys unavailable');
  const { keys = [] } = await response.json();
  const key = keys.find(item => item.kid === header.kid && item.alg === 'RS256');
  if (!key) throw new Error('Unknown signing key');

  const verifier = createVerify('RSA-SHA256');
  verifier.update(`${parts[0]}.${parts[1]}`);
  verifier.end();
  if (!verifier.verify(createPublicKey({ key, format: 'jwk' }), decodeBase64Url(parts[2]))) {
    throw new Error('Invalid signature');
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.aud !== GOOGLE_CLIENT_ID
    || !['accounts.google.com', 'https://accounts.google.com'].includes(payload.iss)
    || !payload.exp || payload.exp <= now
    || !payload.email || payload.email_verified !== true) {
    throw new Error('Invalid credential claims');
  }
  return payload;
}

function redirectToLogin(res) {
  res.setHeader('Location', '/?loginError=1');
  return res.status(303).end();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
  }

  try {
    const body = req.body || {};
    const cookies = parseCookies(req.headers.cookie);
    if (!body.g_csrf_token || !cookies.g_csrf_token || body.g_csrf_token !== cookies.g_csrf_token) {
      throw new Error('Invalid CSRF token');
    }

    const user = await verifyGoogleCredential(body.credential);
    const userEmail = String(user.email).toLowerCase().trim();
    const configuredSuperAdmin = process.env.SUPER_ADMIN_EMAIL || process.env.SUPER_ADMIN_EMAILS || '';
    const superAdminEmails = new Set(
      configuredSuperAdmin.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
    );
    const isSuperAdmin = superAdminEmails.has(userEmail);
    const redirectUrl = isSuperAdmin ? '/superadmin.html' : '/admin.html';

    const session = {
      name: user.name || 'Administrator',
      email: userEmail,
      avatar: user.picture || '',
      provider: 'google',
      isSuperAdmin,
      loggedInAt: Date.now()
    };
    const nonce = randomBytes(16).toString('base64');
    const serializedSession = JSON.stringify(session).replace(/</g, '\\u003c');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Security-Policy', `default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'; frame-ancestors 'none'`);
    return res.status(200).send(`<!doctype html><html><head><meta charset="utf-8"><title>Signing in…</title></head><body><script nonce="${nonce}">localStorage.setItem('educore_admin_session', JSON.stringify(${serializedSession}));location.replace('${redirectUrl}');</script></body></html>`);
  } catch (error) {
    console.error('[Google Login Error]:', error.message);
    return redirectToLogin(res);
  }
}
