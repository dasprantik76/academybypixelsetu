// Vercel Serverless Function: /api/imagekit-auth.js
// Issues short-lived ImageKit client-upload signatures after validating the
// academy registration code. IMAGEKIT_PRIVATE_KEY never leaves this function.

import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { getDatabase } from './lib/mongodb.js';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_BYTES = 2 * 1024 * 1024;

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
}

function codesMatch(activeCode, submittedCode) {
  const expected = Buffer.from(String(activeCode || '').trim());
  const supplied = Buffer.from(String(submittedCode || '').trim());
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

async function resolveOwnerEmail(db, academySlug) {
  if (academySlug === 'prantik') return 'dasprantik76@gmail.com';
  if (academySlug === 'poulami') return 'poulami.13thmay@gmail.com';
  const profile = await db.collection('profile').findOne(
    { slug: academySlug },
    { projection: { _id: 0, ownerEmail: 1 } }
  );
  return profile?.ownerEmail || null;
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
  if (!privateKey || !publicKey || !urlEndpoint) {
    return res.status(503).json({
      success: false,
      code: 'IMAGEKIT_NOT_CONFIGURED',
      error: 'Student photo uploads are not configured.'
    });
  }
  if (!process.env.MONGODB_URI) {
    return res.status(503).json({ success: false, error: 'Registration database is not configured.' });
  }

  const isAdmin = Boolean(req.body?.isAdmin);
  const academySlug = String(req.body?.academySlug || req.body?.ownerEmail || '').toLowerCase().trim();
  const authCode = String(req.body?.authCode || '').trim();
  const courseId = String(req.body?.courseId || '').trim();
  const fileType = String(req.body?.fileType || '').toLowerCase().trim();
  const fileSize = Number(req.body?.fileSize);
  if (!academySlug) {
    return res.status(400).json({ success: false, code: 'ACADEMY_REQUIRED', error: 'Academy identifier is required.' });
  }
  if (!isAdmin && !/^\d{6}$/.test(authCode)) {
    return res.status(400).json({ success: false, code: 'INVALID_CODE', error: 'Authentication code must be exactly 6 digits.' });
  }
  if (!ALLOWED_TYPES.has(fileType) || !Number.isFinite(fileSize) || fileSize <= 0 || fileSize > MAX_FILE_BYTES) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_PHOTO',
      error: 'Choose a JPG, JPEG, PNG or WebP passport photo that is 2 MB or smaller.'
    });
  }

  try {
    const db = await getDatabase();
    const ownerEmail = await resolveOwnerEmail(db, academySlug);
    if (!ownerEmail) {
      return res.status(404).json({ success: false, code: 'ACADEMY_NOT_FOUND', error: 'Academy not found.' });
    }

    if (!isAdmin) {
      const [activeToken, course] = await Promise.all([
        db.collection('auth_token').findOne({ ownerEmail }, { projection: { _id: 0, code: 1, expiresAt: 1 } }),
        db.collection('courses').findOne({ id: courseId, ownerEmail }, { projection: { _id: 1 } })
      ]);
      if (!activeToken?.code) {
        return res.status(403).json({ success: false, code: 'NO_ACTIVE_CODE', error: 'No active authentication code is available.' });
      }
      if (!activeToken.expiresAt || Date.now() > Number(activeToken.expiresAt)) {
        return res.status(403).json({ success: false, code: 'EXPIRED_CODE', error: 'The authentication code has expired.' });
      }
      if (!codesMatch(activeToken.code, authCode)) {
        return res.status(403).json({ success: false, code: 'WRONG_CODE', error: 'The authentication code is incorrect.' });
      }
      if (!course) {
        return res.status(400).json({ success: false, code: 'INVALID_COURSE', error: 'The selected course is unavailable.' });
      }
    }

    const token = randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 5 * 60;
    const signature = createHmac('sha1', privateKey).update(`${token}${expire}`).digest('hex');
    return res.status(200).json({ success: true, token, expire, signature, publicKey, urlEndpoint });
  } catch (error) {
    console.error('[ImageKit Auth Error]:', error);
    return res.status(500).json({ success: false, error: 'Could not authorize the photo upload.' });
  }
}
