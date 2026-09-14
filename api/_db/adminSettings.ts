import { getPostgresSql } from '../_bot/db';
import { ensureAllTables } from './migration';
import { hashPin } from './authUtil';

export async function getAdminPin(): Promise<string> {
  const sql = getPostgresSql();
  if (!sql) return process.env.ADMIN_PIN || '';

  try {
    await ensureAllTables();
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
    await ensureAllTables();
    const hashed = hashPin(newPin);
    await sql`
      INSERT INTO admin_settings (key, value) 
      VALUES ('admin_pin', ${hashed})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
    `;
    return true;
  } catch (err) {
    console.error('DB error setting admin pin:', err);
    return false;
  }
}
