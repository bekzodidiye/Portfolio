import { neon } from '@neondatabase/serverless';

/**
 * Get SQL query client for Vercel / Neon PostgreSQL
 * Reads POSTGRES_URL or DATABASE_URL provided automatically by Vercel
 */
function getConnectionString(): string | null {
  return (
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    null
  );
}

export function isPostgresConfigured(): boolean {
  return !!getConnectionString();
}

export function getSql() {
  const url = getConnectionString();
  if (!url) return null;
  return neon(url);
}

let dbInitialized = false;

/**
 * Automatically creates required PostgreSQL tables on first query
 */
export async function ensureTablesExist() {
  if (dbInitialized) return;
  const sql = getSql();
  if (!sql) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_visitors (
        id SERIAL PRIMARY KEY,
        visitor_name TEXT,
        visitor_role TEXT,
        ip TEXT,
        country TEXT,
        city TEXT,
        region TEXT,
        street TEXT,
        device_type TEXT,
        os TEXT,
        browser TEXT,
        gpu TEXT,
        referrer TEXT,
        latitude REAL,
        longitude REAL,
        visited_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS bot_users (
        user_id BIGINT PRIMARY KEY,
        username TEXT,
        full_name TEXT,
        language TEXT DEFAULT 'uz',
        joined_at TIMESTAMPTZ DEFAULT NOW(),
        last_active TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id BIGINT,
        user_name TEXT,
        contact_info TEXT,
        message_text TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    dbInitialized = true;
  } catch (err) {
    console.warn('PostgreSQL table init error:', err);
  }
}

/**
 * Save real visitor to PostgreSQL database
 */
export async function recordVisitorDb(data: {
  visitorName?: string;
  visitorRole?: string;
  ip?: string;
  country?: string;
  city?: string;
  region?: string;
  street?: string;
  deviceType?: string;
  os?: string;
  browser?: string;
  gpu?: string;
  referrer?: string;
  latitude?: number;
  longitude?: number;
}) {
  const sql = getSql();
  if (!sql) return null;

  try {
    await ensureTablesExist();
    await sql`
      INSERT INTO portfolio_visitors (
        visitor_name, visitor_role, ip, country, city, region, street,
        device_type, os, browser, gpu, referrer, latitude, longitude
      ) VALUES (
        ${data.visitorName || 'Anonim'},
        ${data.visitorRole || null},
        ${data.ip || null},
        ${data.country || null},
        ${data.city || null},
        ${data.region || null},
        ${data.street || null},
        ${data.deviceType || null},
        ${data.os || null},
        ${data.browser || null},
        ${data.gpu || null},
        ${data.referrer || null},
        ${data.latitude ?? null},
        ${data.longitude ?? null}
      );
    `;
    return true;
  } catch (err) {
    console.error('Failed to record visitor in Postgres:', err);
    return false;
  }
}

/**
 * Register or update active Telegram Bot user in PostgreSQL
 */
export async function recordBotUserDb(user: {
  userId: number | string;
  username?: string;
  fullName: string;
  language?: string;
}) {
  const sql = getSql();
  if (!sql) return null;

  try {
    await ensureTablesExist();
    const uid = BigInt(user.userId);
    await sql`
      INSERT INTO bot_users (user_id, username, full_name, language, joined_at, last_active)
      VALUES (${uid.toString()}, ${user.username || null}, ${user.fullName}, ${user.language || 'uz'}, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        username = EXCLUDED.username,
        full_name = EXCLUDED.full_name,
        last_active = NOW();
    `;
    return true;
  } catch (err) {
    console.error('Failed to record bot user in Postgres:', err);
    return false;
  }
}

/**
 * Fetch real visitor statistics from PostgreSQL
 */
export async function getVisitorStatsDb(): Promise<{
  totalVisits: number;
  todayVisits: number;
  uniqueIps: number;
  topCities: Array<{ city: string; count: number }>;
  deviceStats: { mobile: number; desktop: number };
}> {
  const sql = getSql();
  if (!sql) {
    return {
      totalVisits: 0,
      todayVisits: 0,
      uniqueIps: 0,
      topCities: [],
      deviceStats: { mobile: 0, desktop: 0 },
    };
  }

  try {
    await ensureTablesExist();

    const [totalRow] = await sql`SELECT COUNT(*)::int AS count FROM portfolio_visitors;`;
    const [todayRow] = await sql`
      SELECT COUNT(*)::int AS count FROM portfolio_visitors
      WHERE visited_at >= CURRENT_DATE;
    `;
    const [uniqueIpsRow] = await sql`
      SELECT COUNT(DISTINCT ip)::int AS count FROM portfolio_visitors
      WHERE ip IS NOT NULL AND ip != '';
    `;

    const cityRows = await sql`
      SELECT city, COUNT(*)::int AS count FROM portfolio_visitors
      WHERE city IS NOT NULL AND city != ''
      GROUP BY city
      ORDER BY count DESC
      LIMIT 5;
    `;

    const deviceRows = await sql`
      SELECT
        COUNT(*) FILTER (WHERE device_type ILIKE '%mobile%' OR os ILIKE '%ios%' OR os ILIKE '%android%')::int AS mobile_count,
        COUNT(*) FILTER (WHERE NOT (device_type ILIKE '%mobile%' OR os ILIKE '%ios%' OR os ILIKE '%android%'))::int AS desktop_count
      FROM portfolio_visitors;
    `;

    return {
      totalVisits: totalRow?.count || 0,
      todayVisits: todayRow?.count || 0,
      uniqueIps: uniqueIpsRow?.count || 0,
      topCities: cityRows.map((r: any) => ({ city: r.city, count: Number(r.count) })),
      deviceStats: {
        mobile: deviceRows[0]?.mobile_count || 0,
        desktop: deviceRows[0]?.desktop_count || 0,
      },
    };
  } catch (err) {
    console.error('Error fetching visitor stats from Postgres:', err);
    return {
      totalVisits: 0,
      todayVisits: 0,
      uniqueIps: 0,
      topCities: [],
      deviceStats: { mobile: 0, desktop: 0 },
    };
  }
}

/**
 * Fetch most recent real visitors from PostgreSQL
 */
export async function getRecentVisitorsDb(limit = 5) {
  const sql = getSql();
  if (!sql) return [];

  try {
    await ensureTablesExist();
    const rows = await sql`
      SELECT id, visitor_name, visitor_role, ip, country, city, street,
             device_type, os, browser, latitude, longitude,
             TO_CHAR(visited_at AT TIME ZONE 'Asia/Samarkand', 'YYYY-MM-DD HH24:MI:SS') AS visited_at
      FROM portfolio_visitors
      ORDER BY id DESC
      LIMIT ${limit};
    `;
    return rows;
  } catch (err) {
    console.error('Error fetching recent visitors from Postgres:', err);
    return [];
  }
}

/**
 * Fetch real bot user count and message count from PostgreSQL
 */
export async function getBotUserStatsDb(): Promise<{
  totalUsers: number;
  totalMessages: number;
}> {
  const sql = getSql();
  if (!sql) {
    return { totalUsers: 0, totalMessages: 0 };
  }

  try {
    await ensureTablesExist();
    const [usersRow] = await sql`SELECT COUNT(*)::int AS count FROM bot_users;`;
    const [messagesRow] = await sql`SELECT COUNT(*)::int AS count FROM messages;`;

    return {
      totalUsers: usersRow?.count || 0,
      totalMessages: messagesRow?.count || 0,
    };
  } catch (err) {
    console.error('Error fetching bot user stats from Postgres:', err);
    return { totalUsers: 0, totalMessages: 0 };
  }
}
