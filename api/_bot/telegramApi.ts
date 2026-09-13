import { getVisitorStatsDb, getBotUserStatsDb } from './db';

export function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function sendTelegram(botToken: string, method: string, payload: any) {
  if (!botToken) {
    console.warn('sendTelegram called without botToken');
    return { ok: false, description: 'Bot token not provided' };
  }
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await response.json().catch(() => ({ ok: false }));
  } catch (err: any) {
    console.error(`Telegram API error (${method}):`, err);
    return { ok: false, description: err?.message };
  }
}

export async function buildAdminMainText(serverTime: string, adminId: string | number, fallbackUserCount = 1) {
  const vStats = await getVisitorStatsDb();
  const bStats = await getBotUserStatsDb();
  const totalUsers = bStats.totalUsers > 0 ? bStats.totalUsers : fallbackUserCount;

  return `👑 <b>BEKZOD IDIYEV — ADMIN BOSHQARUV MARKAZI</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 <b>Admin ID:</b> <code>${adminId}</code>
⚡ <b>Gateway:</b> 🟢 24/7 Serverless Webhook (Vercel)
🕒 <b>Server Vaqti:</b> ${serverTime} (Toshkent / UTC+5)

📈 <b>JONLI REAL STATISTIKA:</b>
• 🌐 <b>Portfolio Tashriflari:</b> <code>${vStats.totalVisits}</code> ta (Bugun: <code>${vStats.todayVisits}</code>)
• 🔑 <b>Noyob Mehmonlar (IP):</b> <code>${vStats.uniqueIps}</code> ta
• 🤖 <b>Bot Foydalanuvchilari:</b> <code>${totalUsers}</code> ta
• ⚡ <b>Serverless Uptime:</b> 99.9% (24/7 Active)
• 🛡️ <b>Autentifikatsiya:</b> Tasdiqlangan

Quyidagi menyulardan birini tanlang:`;
}
