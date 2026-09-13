import { getPostgresSql } from '../bot/db';

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
    // 1. Ensure table exists (safe to run, will be a no-op if exists)
    await sql`
      CREATE TABLE IF NOT EXISTS rate_limits (
        ip TEXT,
        endpoint TEXT,
        attempts INT DEFAULT 1,
        last_attempt TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (ip, endpoint)
      );
    `;

    // 2. Fetch existing limit record
    const [record] = await sql`
      SELECT attempts, EXTRACT(EPOCH FROM (NOW() - last_attempt)) * 1000 AS ms_since_last
      FROM rate_limits
      WHERE ip = ${ip} AND endpoint = ${endpoint};
    `;

    if (record) {
      const msSinceLast = Number(record.ms_since_last);
      
      // If within window and over attempts limit -> BLOCK
      if (record.attempts >= maxAttempts && msSinceLast < windowMs) {
        const remainingTime = Math.ceil((windowMs - msSinceLast) / 1000);
        return { allowed: false, remainingTime };
      }

      // If outside window -> RESET
      if (msSinceLast >= windowMs) {
        await sql`
          UPDATE rate_limits
          SET attempts = 1, last_attempt = NOW()
          WHERE ip = ${ip} AND endpoint = ${endpoint};
        `;
        return { allowed: true };
      } else {
        // If within window but not over limit -> INCREMENT
        await sql`
          UPDATE rate_limits
          SET attempts = attempts + 1, last_attempt = NOW()
          WHERE ip = ${ip} AND endpoint = ${endpoint};
        `;
        return { allowed: true };
      }
    } else {
      // 3. New record
      await sql`
        INSERT INTO rate_limits (ip, endpoint, attempts, last_attempt)
        VALUES (${ip}, ${endpoint}, 1, NOW());
      `;
      return { allowed: true };
    }
  } catch (err) {
    console.error('Rate limit DB error:', err);
    // Fail open to avoid breaking production during transient DB issues
    return { allowed: true };
  }
}
