import { getPostgresSql } from '../_bot/db';
import { ensureAllTables } from './migration';

export async function setAdminState(
  chatId: string | number,
  type: 'email' | 'user' | null,
  target: string | number | null
) {
  const sql = getPostgresSql();
  if (!sql) return;
  try {
    await ensureAllTables();
    await sql`
      INSERT INTO bot_admin_state (chat_id, reply_type, reply_target, updated_at)
      VALUES (${String(chatId)}, ${type}, ${target ? String(target) : null}, NOW())
      ON CONFLICT (chat_id) DO UPDATE 
      SET reply_type = EXCLUDED.reply_type, 
          reply_target = EXCLUDED.reply_target, 
          updated_at = NOW();
    `;
  } catch (err) {
    console.warn('Postgres setAdminState error:', err);
  }
}

export async function getAdminState(
  chatId: string | number
): Promise<{ type: 'email' | 'user' | null; target: string | null }> {
  const sql = getPostgresSql();
  if (!sql) return { type: null, target: null };
  try {
    const rows = await sql`
      SELECT reply_type, reply_target FROM bot_admin_state WHERE chat_id = ${String(chatId)}
    `.catch(() => []);
    
    if (rows.length > 0) {
      return {
        type: rows[0].reply_type as 'email' | 'user' | null,
        target: rows[0].reply_target,
      };
    }
  } catch (err) {
    console.warn('Postgres getAdminState error:', err);
  }
  return { type: null, target: null };
}
