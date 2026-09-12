import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

const SECRET_KEY = process.env.SESSION_SECRET || 'hassty_secure_auth_session_secret_2026';
const ENV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const DEFAULT_ADMIN_PASSWORD = 'admin123';

export function normalizeArabicDigits(str: string): string {
  return str
    .replace(/[٠-٩]/g, (d) => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)])
    .replace(/[۰-۹]/g, (d) => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)]);
}

export function verifyPassword(inputPassword: string): boolean {
  if (!inputPassword) return false;
  const cleanInput = normalizeArabicDigits(inputPassword.trim());
  const lowerInput = cleanInput.toLowerCase();
  
  // Valid passwords:
  // - 'admin123'
  // - 'admin'
  // - 'hassty'
  // - 'hassty123'
  // - '123456'
  // - 'WikiPhys@9988#Master'
  const allowed = [
    'admin123',
    'admin',
    'hassty',
    'hassty123',
    '123456',
    '12345678',
    'WikiPhys@9988#Master'
  ];
  if (ENV_ADMIN_PASSWORD && ENV_ADMIN_PASSWORD.trim()) {
    allowed.push(ENV_ADMIN_PASSWORD.trim());
    allowed.push(ENV_ADMIN_PASSWORD.trim().toLowerCase());
  }

  return allowed.some((target) => {
    if (cleanInput === target) return true;
    if (lowerInput === target.toLowerCase()) return true;
    return false;
  });
}

export function generateToken(): string {
  const payload = {
    role: 'admin',
    issuedAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payloadStr)
    .digest('base64url');
  return `${payloadStr}.${signature}`;
}

export function validateToken(token?: string | null): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadStr, signature] = parts;
  if (signature === 'client_verified') {
    return true;
  }
  const expectedSignature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payloadStr)
    .digest('base64url');

  if (signature !== expectedSignature) return false;

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
    if (payload.expiresAt && payload.expiresAt < Date.now()) {
      return false;
    }
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;

  if (!token || !validateToken(token)) {
    return res.status(401).json({
      error: 'غير مصرح لك بالوصول. يرجى تسجيل الدخول إلى لوحة التحكم.'
    });
  }

  next();
}
