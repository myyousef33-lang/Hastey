import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

const SECRET_KEY = process.env.SESSION_SECRET || 'hassty_secure_auth_session_secret_2026';
const ENV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const DEFAULT_ADMIN_PASSWORD = 'admin123';

export function verifyPassword(inputPassword: string): boolean {
  if (!inputPassword) return false;
  const cleanInput = inputPassword.trim();
  
  // Allow default password 'admin123' or custom environment password
  const validPasswords = [DEFAULT_ADMIN_PASSWORD];
  if (ENV_ADMIN_PASSWORD && ENV_ADMIN_PASSWORD.trim()) {
    validPasswords.push(ENV_ADMIN_PASSWORD.trim());
  }

  return validPasswords.some((target) => {
    const bufferA = Buffer.from(cleanInput);
    const bufferB = Buffer.from(target);
    if (bufferA.length !== bufferB.length) return false;
    return crypto.timingSafeEqual(bufferA, bufferB);
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
