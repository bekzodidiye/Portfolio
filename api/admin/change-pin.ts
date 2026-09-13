import { getAdminPin, setAdminPin } from '../db/adminSettings';
import { checkRateLimitDb } from '../db/rateLimit';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Secure IP extraction (Vercel specific headers first)
  const forwardedFor = (req.headers['x-forwarded-for'] as string) || '';
  const ip = req.headers['x-vercel-forwarded-for'] 
          || req.headers['x-real-ip'] 
          || (forwardedFor ? forwardedFor.split(',')[0].trim() : null)
          || req.socket?.remoteAddress 
          || 'unknown';

  // Rate limit
  const rateLimit = await checkRateLimitDb(ip as string, 'change-pin', 5, 5 * 60 * 1000);
  if (!rateLimit.allowed) {
    return res.status(429).json({ error: `Too many attempts. Try again in ${rateLimit.remainingTime} seconds.` });
  }

  try {
    const { oldPin, newPin } = req.body || {};

    if (!oldPin || !newPin || typeof oldPin !== 'string' || typeof newPin !== 'string') {
      return res.status(400).json({ success: false, error: 'oldPin and newPin are required' });
    }

    if (newPin.trim().length < 4) {
      return res.status(400).json({ success: false, error: 'Yangi PIN-kod kamida 4 ta belgidan iborat bo\'lishi kerak.' });
    }

    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    const expectedPin = await getAdminPin();
    if (!expectedPin) {
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    // Verify old PIN
    if (oldPin.trim() === expectedPin.trim()) {
      const success = await setAdminPin(newPin.trim());
      if (success) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(500).json({ success: false, error: 'Database update failed.' });
      }
    } else {
      return res.status(401).json({ success: false, error: 'Hozirgi PIN-kod noto\'g\'ri kiritildi.' });
    }
  } catch (error) {
    console.error('Change PIN error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
