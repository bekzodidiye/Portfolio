export const config = {
  runtime: 'nodejs',
};

// Simple rate limiter implementation using in-memory store
// Note: In a serverless environment, this is best-effort as memory is not shared across instances.
// For production, use Redis or a database.
const attempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutes

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  
  // Rate limiting check
  const now = Date.now();
  const userAttempts = attempts.get(ip as string);
  if (userAttempts) {
    if (userAttempts.count >= MAX_ATTEMPTS && now - userAttempts.lastAttempt < LOCKOUT_TIME) {
      const remainingTime = Math.ceil((LOCKOUT_TIME - (now - userAttempts.lastAttempt)) / 1000);
      return res.status(429).json({ error: `Too many attempts. Try again in ${remainingTime} seconds.` });
    }
    // Reset if lockout time has passed
    if (now - userAttempts.lastAttempt >= LOCKOUT_TIME) {
      attempts.delete(ip as string);
    }
  }

  try {
    const { pin } = req.body || {};

    if (!pin || typeof pin !== 'string') {
      return res.status(400).json({ success: false, error: 'PIN is required' });
    }

    // A small artificial delay to mitigate brute force timing attacks
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    const expectedPin = process.env.ADMIN_PIN;
    if (!expectedPin) {
      console.error('ADMIN_PIN environment variable is not set.');
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    if (pin.trim() === expectedPin.trim()) {
      // Success: reset attempts
      attempts.delete(ip as string);
      return res.status(200).json({ success: true });
    } else {
      // Failure: increment attempts
      const current = attempts.get(ip as string) || { count: 0, lastAttempt: now };
      attempts.set(ip as string, { count: current.count + 1, lastAttempt: now });

      return res.status(401).json({ success: false, error: 'Invalid PIN' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
