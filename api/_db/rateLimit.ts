import { getPostgresSql } from '../_bot/db';
import { ensureAllTables } from './migration';

export async function checkRateLimitDb(
  ip: string,
  endpoint: string,
  maxAttempts: number,
  windowMs: number
): Promise<{ allowed: boolean; remainingTime?: number }> {
  const sql = getPostgresSql();
  
  // Best-effort fallback to in-memory if DB is completely unavailable (e.g., missing env)
  if (!sql) {
    console.warn('Postgres not available. Rate limit defaulting to ALLOW.');
    return { allowed: true };
  }

  try {
    await ensureAllTables();

    // Atomic insert/update in a single query with row-level lock (eliminates TOCTOU race condition)
    const cap = maxAttempts + 1;
    const [record] = await sql`
      INSERT INTO rate_limits (ip, endpoint, attempts, last_attempt)
      VALUES (${ip}, ${endpoint}, 1, NOW())
      ON CONFLICT (ip, endpoint) DO UPDATE
      SET 
        attempts = CASE
          WHEN EXTRACT(EPOCH FROM (NOW() - rate_limits.last_attempt)) * 1000 >= ${windowMs} THEN 1
          ELSE LEAST(rate_limits.attempts + 1, ${cap})
        END,
        last_attempt = CASE
          WHEN EXTRACT(EPOCH FROM (NOW() - rate_limits.last_attempt)) * 1000 >= ${windowMs} THEN NOW()
          ELSE rate_limits.last_attempt
        END
      RETURNING attempts, EXTRACT(EPOCH FROM (NOW() - last_attempt)) * 1000 AS ms_since_last;
    `;

    if (!record) {
      return { allowed: true };
    }

    const attempts = Number(record.attempts);
    const msSinceLast = Number(record.ms_since_last);

    if (attempts > maxAttempts && msSinceLast < windowMs) {
      const remainingTime = Math.max(1, Math.ceil((windowMs - msSinceLast) / 1000));
      return { allowed: false, remainingTime };
    }

    return { allowed: true };
  } catch (err) {
    console.error('Rate limit DB error:', err);
    // Fail open to avoid breaking production during transient DB issues
    return { allowed: true };
  }
}
