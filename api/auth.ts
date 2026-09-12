export const config = {
  runtime: 'nodejs',
};

// Simple rate limiter implementation using in-memory store
// Note: In a serverless environment, this is best-effort as memory is not shared across instances.
// For production, use Redis or a database.
const attempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutes

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  
  // Rate limiting check
  const now = Date.now();
  const userAttempts = attempts.get(ip);
  if (userAttempts) {
    if (userAttempts.count >= MAX_ATTEMPTS && now - userAttempts.lastAttempt < LOCKOUT_TIME) {
      const remainingTime = Math.ceil((LOCKOUT_TIME - (now - userAttempts.lastAttempt)) / 1000);
      return new Response(
        JSON.stringify({ error: `Too many attempts. Try again in ${remainingTime} seconds.` }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // Reset if lockout time has passed
    if (now - userAttempts.lastAttempt >= LOCKOUT_TIME) {
      attempts.delete(ip);
    }
  }

  try {
    const body = await req.json();
    const { pin } = body;

    if (!pin || typeof pin !== 'string') {
      return new Response(JSON.stringify({ success: false, error: 'PIN is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // A small artificial delay to mitigate brute force timing attacks
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    const expectedPin = process.env.ADMIN_PIN;
    if (!expectedPin) {
      console.error('ADMIN_PIN environment variable is not set.');
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (pin.trim() === expectedPin.trim()) {
      // Success: reset attempts
      attempts.delete(ip);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Failure: increment attempts
      const current = attempts.get(ip) || { count: 0, lastAttempt: now };
      attempts.set(ip, { count: current.count + 1, lastAttempt: now });

      return new Response(JSON.stringify({ success: false, error: 'Invalid PIN' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
