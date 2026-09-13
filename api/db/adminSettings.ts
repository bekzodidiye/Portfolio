import { getPostgresSql } from '../bot/db';

export async function getAdminPin(): Promise<string> {
  const sql = getPostgresSql();
  if (!sql) return process.env.ADMIN_PIN || '';

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS admin_settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `;

    const [record] = await sql`SELECT value FROM admin_settings WHERE key = 'admin_pin'`;
    if (record && record.value) {
      return record.value;
    }
  } catch (err) {
    console.error('DB error getting admin pin:', err);
  }
  
  return process.env.ADMIN_PIN || '';
}

export async function setAdminPin(newPin: string): Promise<boolean> {
  const sql = getPostgresSql();
  if (!sql) return false;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS admin_settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `;

    await sql`
      INSERT INTO admin_settings (key, value) 
      VALUES ('admin_pin', ${newPin})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
    `;
    return true;
  } catch (err) {
    console.error('DB error setting admin pin:', err);
    return false;
  }
}
