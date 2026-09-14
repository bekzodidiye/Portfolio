import crypto from 'crypto';

const AUTH_SECRET =
  process.env.ADMIN_AUTH_SECRET ||
  process.env.TELEGRAM_BOT_TOKEN ||
  process.env.POSTGRES_URL ||
  'bekzod-portfolio-admin-secret-key-fallback';

/**
 * Creates a signed admin token valid for 24 hours.
 */
export function createAdminSessionToken(): string {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const payload = `admin:${expiresAt}`;
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64url');
}

/**
 * Validates the admin session token.
 */
export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf-8');
    const [prefix, expiresAtStr, signature] = raw.split(':');
    if (prefix !== 'admin' || !expiresAtStr || !signature) return false;

    const expiresAt = Number(expiresAtStr);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

    const payload = `${prefix}:${expiresAtStr}`;
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
    
    if (signature.length !== expectedSig.length) return false;
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
  } catch {
    return false;
  }
}

/**
 * Helper to check Authorization header (Bearer <token>) or x-admin-token header
 */
export function isAuthenticatedAdmin(req: any): boolean {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (verifyAdminSessionToken(token)) return true;
  }

  const customHeader = req.headers?.['x-admin-token'];
  if (typeof customHeader === 'string' && verifyAdminSessionToken(customHeader.trim())) {
    return true;
  }

  return false;
}

/**
 * Hashes a PIN using scrypt with a random salt.
 */
export function hashPin(pin: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(pin.trim(), salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

/**
 * Verifies a PIN against a stored hash or plaintext PIN (with timing-safe comparison).
 */
export function verifyPin(inputPin: string, storedPinOrHash: string): boolean {
  if (!inputPin || !storedPinOrHash) return false;
  const cleanInput = inputPin.trim();
  const cleanStored = storedPinOrHash.trim();

  if (cleanStored.startsWith('scrypt:')) {
    const parts = cleanStored.split(':');
    if (parts.length !== 3) return false;
    const [, salt, hash] = parts;
    const computed = crypto.scryptSync(cleanInput, salt, 64).toString('hex');
    if (hash.length !== computed.length) return false;
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(computed));
  }

  // Backward compatibility with plaintext PIN
  if (cleanInput.length !== cleanStored.length) return false;
  return crypto.timingSafeEqual(Buffer.from(cleanInput), Buffer.from(cleanStored));
}
