import { checkRateLimitDb } from './db/rateLimit';
import { getAdminPin } from './db/adminSettings';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  
  // Rate limiting check using DB
  const rateLimit = await checkRateLimitDb(ip as string, 'auth', 5, 5 * 60 * 1000);
  if (!rateLimit.allowed) {
    return res.status(429).json({ error: `Too many attempts. Try again in ${rateLimit.remainingTime} seconds.` });
  }

  try {
    const { pin } = req.body || {};

    if (!pin || typeof pin !== 'string') {
      return res.status(400).json({ success: false, error: 'PIN is required' });
    }

    // A small artificial delay to mitigate brute force timing attacks
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    const expectedPin = await getAdminPin();
    if (!expectedPin) {
      console.error('ADMIN_PIN is not set in DB or env.');
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    if (pin.trim() === expectedPin.trim()) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, error: 'Invalid PIN' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
