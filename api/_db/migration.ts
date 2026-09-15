import { getPostgresSql } from '../_bot/db.js';

let tablesEnsured = false;

/**
 * Ensures all required tables exist. Safe to call multiple times —
 * the DDL only runs once per container lifetime (not per request).
 */
export async function ensureAllTables(): Promise<void> {
  if (tablesEnsured) return;

  const sql = getPostgresSql();
  if (!sql) return;

  try {
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
      CREATE TABLE IF NOT EXISTS portfolio_messages (
        id SERIAL PRIMARY KEY,
        user_name TEXT,
        contact_info TEXT,
        message_text TEXT,
        ip TEXT,
        device_type TEXT,
        language TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS rate_limits (
        ip TEXT,
        endpoint TEXT,
        attempts INT DEFAULT 1,
        last_attempt TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (ip, endpoint)
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS admin_settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS bot_admin_state (
        chat_id TEXT PRIMARY KEY,
        reply_type TEXT,
        reply_target TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    tablesEnsured = true;
  } catch (err) {
    console.warn('ensureAllTables error:', err);
    // Don't set tablesEnsured = true so it retries next request
  }
}
