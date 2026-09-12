import { neon } from '@neondatabase/serverless';
import { BotUser, VisitorStats, BotStats, GeoAndReferrerStats } from './types';

export function getPostgresSql() {
  const url =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING;
  if (!url) return null;
  try {
    return neon(url);
  } catch {
    return null;
  }
}

export async function recordBotUserDb(user: BotUser) {
  const sql = getPostgresSql();
  if (!sql) return null;
  try {
    const uid = String(user.userId);
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
      INSERT INTO bot_users (user_id, username, full_name, language, joined_at, last_active)
      VALUES (${uid}, ${user.username || null}, ${user.fullName}, ${user.language || 'uz'}, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        username = EXCLUDED.username,
        full_name = EXCLUDED.full_name,
        last_active = NOW();
    `;
    return true;
  } catch (err) {
    console.warn('Postgres record bot user error:', err);
    return false;
  }
}

export async function getVisitorStatsDb(): Promise<VisitorStats> {
  const fallback: VisitorStats = {
    totalVisits: 0,
    todayVisits: 0,
    uniqueIps: 0,
    topCities: [],
    deviceStats: { mobile: 0, desktop: 0 },
  };
  const sql = getPostgresSql();
  if (!sql) return fallback;
  try {
    const [totalRow] = await sql`SELECT COUNT(*)::int AS count FROM portfolio_visitors;`;
    const [todayRow] = await sql`SELECT COUNT(*)::int AS count FROM portfolio_visitors WHERE visited_at >= CURRENT_DATE;`;
    const [uniqueIpsRow] = await sql`SELECT COUNT(DISTINCT ip)::int AS count FROM portfolio_visitors WHERE ip IS NOT NULL AND ip != '';`;
    const cityRows = await sql`
      SELECT city, COUNT(*)::int AS count FROM portfolio_visitors
      WHERE city IS NOT NULL AND city != ''
      GROUP BY city ORDER BY count DESC LIMIT 5;
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
    console.warn('Postgres visitor stats error:', err);
    return fallback;
  }
}

export async function getRecentVisitorsDb(limit = 5) {
  const sql = getPostgresSql();
  if (!sql) return [];
  try {
    return await sql`
      SELECT id, visitor_name, visitor_role, ip, country, city, street,
             device_type, os, browser, latitude, longitude,
             TO_CHAR(visited_at AT TIME ZONE 'Asia/Samarkand', 'YYYY-MM-DD HH24:MI:SS') AS visited_at
      FROM portfolio_visitors
      ORDER BY id DESC
      LIMIT ${limit};
    `;
  } catch (err) {
    console.warn('Postgres recent visitors error:', err);
    return [];
  }
}

export async function getBotUserStatsDb(): Promise<BotStats> {
  const sql = getPostgresSql();
  if (!sql) return { totalUsers: 0, totalMessages: 0 };
  try {
    const [usersRow] = await sql`SELECT COUNT(*)::int AS count FROM bot_users;`;
    let msgCount = 0;
    try {
      const [msgRow] = await sql`SELECT COUNT(*)::int AS count FROM portfolio_messages;`;
      msgCount = msgRow?.count || 0;
    } catch {
      msgCount = 0;
    }
    return {
      totalUsers: usersRow?.count || 0,
      totalMessages: msgCount,
    };
  } catch (err) {
    console.warn('Postgres bot stats error:', err);
    return { totalUsers: 0, totalMessages: 0 };
  }
}

export async function getGeoAndReferrerStatsDb(): Promise<GeoAndReferrerStats> {
  const sql = getPostgresSql();
  if (!sql) return { countries: [], referrers: [], total: 0 };
  try {
    const [totalRow] = await sql`SELECT COUNT(*)::int AS count FROM portfolio_visitors;`;
    const total = totalRow?.count || 0;
    const countryRows = await sql`
      SELECT COALESCE(NULLIF(country, ''), 'Noma\'lum') AS country, COUNT(*)::int AS count
      FROM portfolio_visitors
      GROUP BY country
      ORDER BY count DESC
      LIMIT 5;
    `;
    const referrerRows = await sql`
      SELECT COALESCE(NULLIF(referrer, ''), 'Direct URL (To\'g\'ridan-to\'g\'ri)') AS referrer, COUNT(*)::int AS count
      FROM portfolio_visitors
      GROUP BY referrer
      ORDER BY count DESC
      LIMIT 5;
    `;
    return {
      total,
      countries: countryRows.map((r: any) => ({ country: r.country, count: Number(r.count) })),
      referrers: referrerRows.map((r: any) => ({ referrer: r.referrer, count: Number(r.count) })),
    };
  } catch (err) {
    console.warn('Postgres geo/referrer stats error:', err);
    return { countries: [], referrers: [], total: 0 };
  }
}

export async function getRecentBotUsersDb(limit = 5) {
  const sql = getPostgresSql();
  if (!sql) return [];
  try {
    return await sql`
      SELECT user_id, username, full_name, language,
             TO_CHAR(last_active AT TIME ZONE 'Asia/Samarkand', 'YYYY-MM-DD HH24:MI:SS') AS last_active
      FROM bot_users
      ORDER BY last_active DESC
      LIMIT ${limit};
    `;
  } catch (err) {
    console.warn('Postgres recent bot users error:', err);
    return [];
  }
}

export async function getRecentMessagesDb(limit = 5) {
  const sql = getPostgresSql();
  if (!sql) return [];
  try {
    return await sql`
      SELECT id, user_name, contact_info, message_text, device_type,
             TO_CHAR(created_at AT TIME ZONE 'Asia/Samarkand', 'YYYY-MM-DD HH24:MI:SS') AS created_at
      FROM portfolio_messages
      ORDER BY id DESC
      LIMIT ${limit};
    `;
  } catch (err) {
    console.warn('Postgres recent messages error:', err);
    return [];
  }
}
