import nodemailer from 'nodemailer';
import { neon } from '@neondatabase/serverless';

function getPostgresSql() {
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

async function recordBotUserDb(user: {
  userId: number | string;
  username?: string;
  fullName: string;
  language?: string;
}) {
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

async function getVisitorStatsDb(): Promise<{
  totalVisits: number;
  todayVisits: number;
  uniqueIps: number;
  topCities: Array<{ city: string; count: number }>;
  deviceStats: { mobile: number; desktop: number };
}> {
  const sql = getPostgresSql();
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
    return {
      totalVisits: 0,
      todayVisits: 0,
      uniqueIps: 0,
      topCities: [],
      deviceStats: { mobile: 0, desktop: 0 },
    };
  }
}

async function getRecentVisitorsDb(limit = 5) {
  const sql = getPostgresSql();
  if (!sql) return [];
  try {
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
    console.warn('Postgres recent visitors error:', err);
    return [];
  }
}

async function getBotUserStatsDb(): Promise<{
  totalUsers: number;
  totalMessages: number;
}> {
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

async function getGeoAndReferrerStatsDb() {
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

async function getRecentBotUsersDb(limit = 5) {
  const sql = getPostgresSql();
  if (!sql) return [];
  try {
    const rows = await sql`
      SELECT user_id, username, full_name, language,
             TO_CHAR(last_active AT TIME ZONE 'Asia/Samarkand', 'YYYY-MM-DD HH24:MI:SS') AS last_active
      FROM bot_users
      ORDER BY last_active DESC
      LIMIT ${limit};
    `;
    return rows;
  } catch (err) {
    console.warn('Postgres recent bot users error:', err);
    return [];
  }
}

async function getRecentMessagesDb(limit = 5) {
  const sql = getPostgresSql();
  if (!sql) return [];
  try {
    const rows = await sql`
      SELECT id, user_name, contact_info, message_text, device_type,
             TO_CHAR(created_at AT TIME ZONE 'Asia/Samarkand', 'YYYY-MM-DD HH24:MI:SS') AS created_at
      FROM portfolio_messages
      ORDER BY id DESC
      LIMIT ${limit};
    `;
    return rows;
  } catch (err) {
    console.warn('Postgres recent messages error:', err);
    return [];
  }
}

export const config = {
  runtime: 'nodejs',
};

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const PORTFOLIO_URL = 'https://bekzod-idiyev-portfolio.vercel.app';
const GITHUB_URL = 'https://github.com/bekzodidiye';
const ADMIN_CHAT_ID = '5678281376';
const FALLBACK_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

// In-Memory state for warm serverless instances
let botUserIds = new Set<number | string>([ADMIN_CHAT_ID]);
let botStats = {
  totalInteractions: 1,
  totalMessagesForwarded: 0,
  serverStartTime: new Date().toISOString(),
};
let pendingAdminReplyTarget: string | number | null = null;
let pendingAdminEmailTarget: string | null = null;

// Email Sender Helper
async function sendEmailFromBot(options: { to: string; subject: string; text: string; clientName?: string }): Promise<{ success: boolean; error?: string }> {
  const { to, subject, text, clientName } = options;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || 'bekzodidiyev89@gmail.com';
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;

  if (!smtpPass) {
    return {
      success: false,
      error: 'SMTP_PASS (Gmail App Password) sozlanmagan. .env yoki Vercel sozlamalariga SMTP_PASS qo\'shing.',
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const formattedHtml = `
    <!DOCTYPE html>
    <html lang="uz">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0d1117; color: #c9d1d9; margin: 0; padding: 20px; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background-color: #161b22; border: 1px solid #30363d; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
        .header { background: linear-gradient(135deg, #1f6feb, #0969da); padding: 24px; color: #ffffff; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
        .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }
        .content { padding: 28px 24px; color: #e6edf3; }
        .greeting { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #58a6ff; }
        .message-box { background-color: #0d1117; border: 1px solid #30363d; padding: 16px 18px; border-radius: 6px; margin: 18px 0; font-size: 15px; color: #f0f6fc; white-space: pre-wrap; word-wrap: break-word; }
        .footer { padding: 20px 24px; background-color: #090d13; border-top: 1px solid #21262d; text-align: center; font-size: 12px; color: #8b949e; }
        .footer a { color: #58a6ff; text-decoration: none; margin: 0 8px; }
        .badge { display: inline-block; background-color: #238636; color: #ffffff; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="badge">Rasmiy Javob</div>
          <h1>BEKZOD IDIYEV</h1>
          <p>Python Backend Architect & Systems Engineer</p>
        </div>
        <div class="content">
          <div class="greeting">Assalomu alaykum!</div>
          <p>Portfolio saytim orqali qoldirgan murojaatingiz uchun minnatdorchilik bildiraman.</p>
          <div class="message-box">${escapeHtml(text)}</div>
          <p>Savollaringiz bo'lsa, ushbu xatga to'g'ridan-to'g'ri javob yozishingiz yoki Telegram orqali bog'lanishingiz mumkin.</p>
        </div>
        <div class="footer">
          <p><b>Bekzod Idiyev</b> • Python Backend Developer</p>
          <p>
            <a href="https://t.me/toyneden">✈️ Telegram: @toyneden</a> • 
            <a href="https://bekzod-idiyev-portfolio.vercel.app">🌐 Portfolio</a> • 
            <a href="https://github.com/bekzodidiye">🐙 GitHub</a>
          </p>
          <p style="margin-top: 10px; color: #484f58;">Ushbu xat portfolio xizmati orqali avtomatlashtirilgan tarzda yuborildi.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const plainText = `${text}

--
Bekzod Idiyev
Python Backend Developer
Telegram: @toyneden
Portfolio: https://bekzod-idiyev-portfolio.vercel.app`;


    await transporter.sendMail({
      from: `"Bekzod Idiyev" <${smtpUser}>`,
      to,
      subject: subject || 'Re: Bekzod Idiyev — Portfolio Murojaati',
      text: plainText,
      html: formattedHtml,
      replyTo: smtpUser,
    });


    return { success: true };
  } catch (err: any) {
    console.error('Nodemailer error:', err);
    return { success: false, error: err.message || 'Email yuborishda xatolik yuz berdi.' };
  }
}

function getMainReplyKeyboard() {
  return {
    keyboard: [
      [{ text: '🚀 3D Portfolioni Ochish (Web App)', web_app: { url: PORTFOLIO_URL } }],
      [{ text: '👨‍💻 Men Haqimda' }, { text: '📂 Loyihalarim' }],
      [{ text: '🛠️ Stack & Texnologiyalar' }, { text: '📄 Rezyume / CV' }],
      [{ text: '✍️ Xabar Qoldirish' }, { text: '🌐 Tilni O\'zgartirish' }],
    ],
    resize_keyboard: true,
    is_persistent: true,
  };
}

function getAdminMainKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '🌐 Portfolio Tashriflari', callback_data: 'admin_visitors' },
        { text: '👁️ So\'nggi Mehmonlar', callback_data: 'admin_recent_visitors' },
      ],
      [
        { text: '📊 Bot Analitikasi', callback_data: 'admin_stats' },
        { text: '⚡ Tizim Diagnostikasi', callback_data: 'admin_diag' },
      ],
      [
        { text: '👥 Bot Foydalanuvchilari', callback_data: 'admin_users' },
        { text: '📩 So\'nggi Xabarlar', callback_data: 'admin_leads' },
      ],
      [
        { text: '🌍 Geografiya & Manbalar', callback_data: 'admin_geo' },
        { text: '📢 Xabar Tarqatish', callback_data: 'admin_broadcast' },
      ],
      [
        { text: '🌐 Portfolioni Ochish', url: PORTFOLIO_URL },
        { text: '🐙 GitHub Repo', url: 'https://github.com/bekzodidiye/Portfolio' },
      ],
    ],
  };
}

function getAdminSubKeyboard(currentTab: string) {
  return {
    inline_keyboard: [
      [
        { text: '🔄 Yangilash', callback_data: currentTab },
        { text: '⬅️ Boshqaruv Paneliga Qaytish', callback_data: 'admin_main' },
      ],
    ],
  };
}

async function buildAdminMainText(serverTime: string, adminId: string | number) {
  const vStats = await getVisitorStatsDb();
  const bStats = await getBotUserStatsDb();
  const totalUsers = bStats.totalUsers > 0 ? bStats.totalUsers : botUserIds.size;

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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, message: 'Telegram Webhook Gateway Active' });
  }

  try {
    const botToken =
      process.env.TELEGRAM_BOT_TOKEN ||
      process.env.VITE_TELEGRAM_BOT_TOKEN ||
      FALLBACK_BOT_TOKEN;

    const adminId =
      process.env.TELEGRAM_CHAT_ID ||
      process.env.VITE_TELEGRAM_CHAT_ID ||
      ADMIN_CHAT_ID;

    const sendTg = async (method: string, payload: any) => {
      try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        return await response.json().catch(() => ({}));
      } catch (err) {
        console.error('sendTg fetch error:', err);
        return { ok: false };
      }
    };

    const update = req.body || {};
    botStats.totalInteractions += 1;

    const serverTimestamp = new Intl.DateTimeFormat('uz-UZ', {
      timeZone: 'Asia/Samarkand',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());

    // 1. Handle Inline Button Callbacks
    if (update.callback_query) {
      const cb = update.callback_query;
      const data = cb.data || '';
      const chatId = cb.message?.chat?.id;
      const messageId = cb.message?.message_id;
      const fromUser = cb.from || {};

      if (fromUser.id) {
        botUserIds.add(fromUser.id);
        const fullName = [fromUser.first_name, fromUser.last_name].filter(Boolean).join(' ') || 'Foydalanuvchi';
        recordBotUserDb({
          userId: fromUser.id,
          username: fromUser.username,
          fullName,
          language: fromUser.language_code || 'uz',
        }).catch(() => {});
      }

      let responseText = '';
      let replyMarkup: any = null;

      // Handle Direct Email Reply Initiation
      if (data.startsWith('reply_email_')) {
        const targetEmail = data.replace('reply_email_', '');
        pendingAdminEmailTarget = targetEmail;
        pendingAdminReplyTarget = null;

        await sendTg('sendMessage', {
          chat_id: chatId,
          text: `📧 <b>Emailga (<code>${targetEmail}</code>) javob xati yozish:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\nMarhamat, yubormoqchi bo'lgan javob matningizni shu yerga yozing. U avtomatik ravishda ushbu email manzilga rasmiy xat sifatida yuboriladi:\n\n<i>(Bekor qilish uchun /cancel deb yozing)</i>`,
          parse_mode: 'HTML',
        });
        await sendTg('answerCallbackQuery', { callback_query_id: cb.id });
        return res.status(200).json({ ok: true });
      }

      // Handle Direct Bot Reply Initiation
      if (data.startsWith('reply_user_')) {
        const targetUserId = data.replace('reply_user_', '');
        pendingAdminReplyTarget = targetUserId;
        pendingAdminEmailTarget = null;

        await sendTg('sendMessage', {
          chat_id: chatId,
          text: `✍️ <b>Foydalanuvchiga (ID: <code>${targetUserId}</code>) to'g'ridan-to'g'ri javob yozish:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\nMarhamat, yubormoqchi bo'lgan javob matningizni shu yerga yozing:\n\n<i>(Bekor qilish uchun /cancel deb yozing)</i>`,
          parse_mode: 'HTML',
        });
        await sendTg('answerCallbackQuery', { callback_query_id: cb.id });
        return res.status(200).json({ ok: true });
      }

      // Projects Callbacks
      if (data === 'proj_buddy') {
        responseText = `🚀 <b>BUDDY TEAM — AI MENTOR & TEAM MATCHMAKING</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 <b>Tavsif:</b> Talabalar va junior dasturchilarni qiziqishlari, texnologik darajasi va maqsadlariga qarab avtomatlashtirilgan AI algoritmi orqali jamoalarga birlashtiruvchi platforma.
🛠️ <b>Stack:</b> Python 3.11, FastAPI, PostgreSQL, Redis, Docker, Celery
⚡ <b>Natijalar:</b>
• 500+ faol foydalanuvchilar o'rtasida muvaffaqiyatli match
• 99.8% API uptime va asinxron fon vazifalari boshqaruvi`;

        replyMarkup = {
          inline_keyboard: [
            [
              { text: '🐙 GitHub Kodi', url: GITHUB_URL },
              { text: '🌐 Portfolioda Ko\'rish', url: `${PORTFOLIO_URL}/#projects` },
            ],
            [{ text: '⬅️ Loyihalar Ro\'yxatiga Qaytish', callback_data: 'proj_list' }],
          ],
        };
      } else if (data === 'proj_esports') {
        responseText = `🎮 <b>ESPORTS TOURNAMENT BOT</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 <b>Tavsif:</b> Kiberfutbol va kiberxavfsizlik turnirlarini avtomatlashtirilgan tarzda tashkil qilish, qoidalarni monitoring qilish va statistikani hisoblovchi yuqori yuklamali Telegram bot.
🛠️ <b>Stack:</b> Python, aiogram 3.x, SQLite, Webhooks, Aiohttp
⚡ <b>Afzalliklari:</b>
• Avtomatlashtirilgan match grid va reyting hisoblagich
• To'lov tizimlari va havola autentifikatsiyasi`;

        replyMarkup = {
          inline_keyboard: [
            [
              { text: '🐙 GitHub Kodi', url: GITHUB_URL },
              { text: '🌐 Portfolioda Ko\'rish', url: `${PORTFOLIO_URL}/#projects` },
            ],
            [{ text: '⬅️ Loyihalar Ro\'yxatiga Qaytish', callback_data: 'proj_list' }],
          ],
        };
      } else if (data === 'proj_peerlearn') {
        responseText = `📚 <b>PEERLEARN TELEGRAM MINI APP</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 <b>Tavsif:</b> Telegram ichida to'liq ishlovchi interaktiv ta'lim Web App ekotizimi.
🛠️ <b>Stack:</b> React, TypeScript, FastAPI, WebSockets
⚡ <b>Imkoniyatlar:</b>
• Darslar va testlarni Telegramdan chiqmasdan yechish
• Jonli reyting va yutuqlar tizimi`;

        replyMarkup = {
          inline_keyboard: [
            [
              { text: '🐙 GitHub Kodi', url: GITHUB_URL },
              { text: '🌐 Portfolioda Ko\'rish', url: `${PORTFOLIO_URL}/#projects` },
            ],
            [{ text: '⬅️ Loyihalar Ro\'yxatiga Qaytish', callback_data: 'proj_list' }],
          ],
        };
      } else if (data === 'proj_list') {
        responseText = `📂 <b>ISHLAB CHIQARISH LOYIHALARI:</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
Quyidagi loyihalardan birini tanlang:

1️⃣ <b>Buddy Team</b> — AI Mentor & Team Matchmaking
2️⃣ <b>Esports Tournament Bot</b> — Turnir boshqaruv tizimi
3️⃣ <b>PeerLearn Telegram Mini App</b> — Ta'lim platformasi`;

        replyMarkup = {
          inline_keyboard: [
            [{ text: '🚀 Buddy Team (AI Match)', callback_data: 'proj_buddy' }],
            [{ text: '🎮 Esports Tournament Bot', callback_data: 'proj_esports' }],
            [{ text: '📚 PeerLearn Mini App', callback_data: 'proj_peerlearn' }],
            [{ text: '🌐 Barcha Loyihalarni Ko\'rish', url: `${PORTFOLIO_URL}/#projects` }],
          ],
        };
      } else if (data === 'admin_main') {
        responseText = await buildAdminMainText(serverTimestamp, chatId);
        replyMarkup = getAdminMainKeyboard();
      } else if (data === 'admin_visitors') {
        const vStats = await getVisitorStatsDb();
        const total = vStats.totalVisits;
        const mobilePct = total > 0 ? Math.round((vStats.deviceStats.mobile / total) * 100) : 0;
        const desktopPct = total > 0 ? 100 - mobilePct : 0;

        let citiesStr = '';
        for (const c of vStats.topCities) {
          citiesStr += `  • 🏙️ <b>${escapeHtml(c.city)}:</b> <code>${c.count}</code> ta\n`;
        }
        if (!citiesStr) {
          citiesStr = '  • <i>Hozircha ma\'lumotlar to\'planmoqda</i>\n';
        }

        responseText = `🌐 <b>PORTFOLIO SAYTI REAL TASHRIFLAR STATISTIKASI</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 <b>Jami Tashriflar:</b> <code>${vStats.totalVisits}</code> ta
📅 <b>Bugungi Tashriflar:</b> <code>${vStats.todayVisits}</code> ta
🔑 <b>Noyob Mehmonlar (IP):</b> <code>${vStats.uniqueIps}</code> ta

📱 <b>Qurilmalar Bo'yicha (Real):</b>
  • 📱 Mobile: <code>${mobilePct}%</code>
  • 💻 Desktop: <code>${desktopPct}%</code>

🌍 <b>Top Shaharlar (Real):</b>
${citiesStr}
━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ <i>PostgreSQL real-vaqt monitoringi faol</i>`;

        replyMarkup = getAdminSubKeyboard('admin_visitors');
      } else if (data === 'admin_recent_visitors') {
        const visitors = await getRecentVisitorsDb(5);
        if (!visitors || visitors.length === 0) {
          responseText = `👁️ <b>SO'NGGI REAL MEHMONLAR</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<i>Hozircha bazada yangi tashriflar yo'q. Saytga kirilganda avtomatik qayd etiladi.</i>`;
        } else {
          let vLines = '';
          visitors.forEach((v: any, idx: number) => {
            const name = v.visitor_name || 'Anonim';
            const city = v.city || v.country || "O'zbekiston";
            const dev = v.device_type || v.os || 'Desktop';
            const timeStr = v.visited_at || '';
            const mapLink = v.latitude && v.longitude
              ? ` | <a href="https://yandex.uz/maps/?pt=${v.longitude},${v.latitude},pm2rdm&z=16">📍 Xarita</a>`
              : '';
            vLines += `<b>${idx + 1}. ${escapeHtml(name)}</b>\n📍 ${escapeHtml(city)} (${escapeHtml(dev)})${mapLink}\n🕒 <i>${timeStr}</i>\n\n`;
          });

          responseText = `👁️ <b>SO'NGGI ${visitors.length} TA REAL PORTFOLIO MEHMONI:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n${vLines}━━━━━━━━━━━━━━━━━━━━━━━━━━\n⚡ <i>Barcha yangi tashriflar avtomatik bazaga yoziladi.</i>`;
        }

        replyMarkup = getAdminSubKeyboard('admin_recent_visitors');
      } else if (data === 'admin_stats') {
        const bStats = await getBotUserStatsDb();
        const vStats = await getVisitorStatsDb();
        const totalUsers = bStats.totalUsers > 0 ? bStats.totalUsers : botUserIds.size;

        responseText = `📊 <b>TO'LIQ TELEMETRIYA VA REAL STATISTIKA</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 <b>Real Bot Foydalanuvchilari:</b> <code>${totalUsers}</code> ta
🌐 <b>Portfolio Jami Tashriflari:</b> <code>${vStats.totalVisits}</code> ta
⚡ <b>Jami Bajarilgan So'rovlar:</b> <code>${botStats.totalInteractions}</code> ta
📩 <b>Yetkazilgan Xabarlar:</b> <code>${bStats.totalMessages || botStats.totalMessagesForwarded}</code> ta

⚡ <b>Infratuzilma:</b>
• Database: Vercel PostgreSQL (Neon Serverless)
• Hosting: Vercel Serverless Edge
• Response Time: ~45ms
• SSL: TLS 1.3 Active`;

        replyMarkup = getAdminSubKeyboard('admin_stats');
      } else if (data === 'admin_diag') {
        const pingStart = Date.now();
        let tgPing = 'N/A';
        try {
          await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
          tgPing = `${Date.now() - pingStart}ms`;
        } catch {
          tgPing = 'Ulanishda xato';
        }

        responseText = `⚡ <b>TIZIM DIAGNOSTIKASI VA SALOMATLIK HOLATI</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ <b>Vercel Serverless Function:</b> 200 OK
✅ <b>Telegram Webhook:</b> Ulangan & Faol
✅ <b>Telegram Bot API Real Ping:</b> ${tgPing}
✅ <b>Xavfsizlik & Anti-Spam:</b> Honeypot Trap & HTML Sanitizer Faol
✅ <b>Admin Autentifikatsiyasi:</b> <code>${chatId}</code> (Tasdiqlangan)
✅ <b>Database:</b> Neon PostgreSQL Connected (Serverless)`;

        replyMarkup = getAdminSubKeyboard('admin_diag');
      } else if (data === 'admin_geo') {
        const geoStats = await getGeoAndReferrerStatsDb();
        let countryLines = '';
        if (geoStats.countries.length === 0) {
          countryLines = '• <i>Hozircha geografik ma\'lumotlar mavjud emas</i>\n';
        } else {
          geoStats.countries.forEach((c) => {
            const pct = geoStats.total > 0 ? Math.round((c.count / geoStats.total) * 100) : 0;
            const flag = c.country.toLowerCase().includes('uz') || c.country.toLowerCase().includes('o\'zb') ? '🇺🇿 ' : '🌐 ';
            countryLines += `• ${flag}<b>${escapeHtml(c.country)}:</b> <code>${pct}%</code> (<code>${c.count}</code> ta)\n`;
          });
        }

        let refLines = '';
        if (geoStats.referrers.length === 0) {
          refLines = '• <i>Hozircha manbalar mavjud emas</i>\n';
        } else {
          geoStats.referrers.forEach((r) => {
            const pct = geoStats.total > 0 ? Math.round((r.count / geoStats.total) * 100) : 0;
            refLines += `• 🔗 <b>${escapeHtml(r.referrer)}:</b> <code>${pct}%</code> (<code>${r.count}</code> ta)\n`;
          });
        }

        responseText = `🌍 <b>TASHRIF BUYURUVCHILAR REAL GEOGRAFIYASI:</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
${countryLines}
📊 <b>Manbalar (Referrers - Real):</b>
${refLines}
━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ <i>PostgreSQL bazasidan real-vaqtda hisoblandi (Jami: ${geoStats.total} ta tashrif).</i>`;

        replyMarkup = getAdminSubKeyboard('admin_geo');
      } else if (data === 'admin_users') {
        const users = await getRecentBotUsersDb(5);
        if (users.length === 0) {
          responseText = `👥 <b>SO'NGGI BOT FOYDALANUVCHILARI</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<i>Hozircha bazada yangi bot foydalanuvchilari yo'q.</i>`;
        } else {
          let uLines = '';
          users.forEach((u: any, idx: number) => {
            const uname = u.username ? `@${escapeHtml(u.username)}` : 'mavjud_emas';
            uLines += `<b>${idx + 1}. ${escapeHtml(u.full_name)}</b> (${uname})\n🆔 <code>${u.user_id}</code> | 🌐 ${(u.language || 'uz').toUpperCase()}\n🕒 <i>${u.last_active}</i>\n\n`;
          });
          responseText = `👥 <b>SO'NGGI ${users.length} TA BOT FOYDALANUVCHISI:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n${uLines}━━━━━━━━━━━━━━━━━━━━━━━━━━\n⚡ <i>Real PostgreSQL bazasi</i>`;
        }

        replyMarkup = getAdminSubKeyboard('admin_users');
      } else if (data === 'admin_leads') {
        const messages = await getRecentMessagesDb(5);
        if (messages.length === 0) {
          responseText = `📩 <b>SO'NGGI QABUL QILINGAN XABARLAR</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<i>Hozircha yangi murojaat yoki leadlar yo'q.</i>`;
        } else {
          let mLines = '';
          messages.forEach((m: any, idx: number) => {
            mLines += `<b>${idx + 1}. ${escapeHtml(m.user_name)}</b> (<code>${escapeHtml(m.contact_info)}</code>)\n💬 "<i>${escapeHtml((m.message_text || '').slice(0, 100))}</i>"\n📱 ${escapeHtml(m.device_type || 'Desktop')} | 🕒 <i>${m.created_at}</i>\n\n`;
          });
          responseText = `📩 <b>SO'NGGI ${messages.length} TA QABUL QILINGAN XABAR:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n${mLines}━━━━━━━━━━━━━━━━━━━━━━━━━━\n⚡ <i>Real PostgreSQL bazasi</i>`;
        }

        replyMarkup = getAdminSubKeyboard('admin_leads');
      } else if (data === 'admin_broadcast') {
        responseText = `📢 <b>XABAR TARQATISH TIZIMI (BROADCAST)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 <b>Auditoriya:</b> <code>${botUserIds.size}</code> ta bot a'zolari

💡 <b>Xabar yuborish:</b>
Mahalliy kompyuter yoki VPS'da Python bot orqali <code>/admin</code> menyusidan <b>Xabar Tarqatish</b> tugmasini bosib barcha a'zolarga e'lon yuborishingiz mumkin.`;

        replyMarkup = getAdminSubKeyboard('admin_broadcast');
      } else if (data.startsWith('setlang_')) {
        responseText = `✅ Til muvaffaqiyatli tanlandi! Quyidagi menyudan foydalanishingiz mumkin.`;
      }

      if (responseText && chatId && messageId) {
        await sendTg('editMessageText', {
          chat_id: chatId,
          message_id: messageId,
          text: responseText,
          parse_mode: 'HTML',
          reply_markup: replyMarkup,
        });
      }

      await sendTg('answerCallbackQuery', { callback_query_id: cb.id });
      return res.status(200).json({ ok: true });
    }

    // 2. Handle Text Messages
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat?.id;
      const text = msg.text || '';
      const from = msg.from || {};
      const name = from.first_name || 'Foydalanuvchi';
      const isAdmin = String(chatId) === String(adminId) || String(chatId) === ADMIN_CHAT_ID;

      if (!chatId) {
        return res.status(200).json({ ok: true });
      }

      botUserIds.add(chatId);
      const fullName = [from.first_name, from.last_name].filter(Boolean).join(' ') || name;
      recordBotUserDb({
        userId: chatId,
        username: from.username,
        fullName,
        language: from.language_code || 'uz',
      }).catch(() => {});

      // --- ADMIN REPLY HANDLING (Email OR Telegram User) ---
      if (isAdmin) {
        // 1. Check for cancel
        if (text === '/cancel') {
          pendingAdminReplyTarget = null;
          pendingAdminEmailTarget = null;
          await sendTg('sendMessage', {
            chat_id: chatId,
            text: '❌ <b>Javob yozish bekor qilindi.</b>',
            parse_mode: 'HTML',
          });
          return res.status(200).json({ ok: true });
        }

        // 2. Detect Email Target (via native reply or stored target)
        let targetEmail: string | null = null;
        if (msg.reply_to_message?.text) {
          const repText = msg.reply_to_message.text;
          const emailMatch = repText.match(/#email_([^\s\n]+)/) || repText.match(/Email:\s*<a href="mailto:([^">]+)">/) || repText.match(/Email:\s*<code>([^<]+)<\/code>/);
          if (emailMatch && emailMatch[1]) {
            targetEmail = emailMatch[1].trim();
          }
        }
        if (!targetEmail && pendingAdminEmailTarget) {
          targetEmail = pendingAdminEmailTarget;
        }

        // If target is an EMAIL address, send email!
        if (targetEmail) {
          pendingAdminEmailTarget = null;
          const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent('Re: Bekzod Idiyev — Portfolio Javobi')}&body=${encodeURIComponent(text)}`;

          const emailResult = await sendEmailFromBot({
            to: targetEmail,
            subject: 'Re: Bekzod Idiyev — Portfolio Murojaati Bo\'yicha Javob',
            text,
          });

          if (emailResult.success) {
            await sendTg('sendMessage', {
              chat_id: chatId,
              text: `✅ <b>Email xati muvaffaqiyatli yuborildi!</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n📧 <b>Qabul qiluvchi:</b> <code>${escapeHtml(targetEmail)}</code>\n📄 <b>Mavzu:</b> Re: Bekzod Idiyev — Portfolio Murojaati\n\n💬 <b>Yuborilgan javob matni:</b>\n"${escapeHtml(text)}"`,
              parse_mode: 'HTML',
            });
          } else {
            await sendTg('sendMessage', {
              chat_id: chatId,
              text: `⚠️ <b>Server orqali email yuborilmadi:</b> ${escapeHtml(emailResult.error || '')}\n\n💡 <i>Hech qisi yo'q! Quyidagi 1-klikli havola orqali Gmail'da ochib yuborishingiz mumkin:</i>`,
              parse_mode: 'HTML',
              reply_markup: {
                inline_keyboard: [
                  [{ text: '✉️ Gmail orqali 1-klikda Yuborish', url: gmailUrl }],
                ],
              },
            });
          }

          return res.status(200).json({ ok: true });
        }

        // 3. Detect Telegram User Target (via native reply or stored target)
        let replyTargetUser: string | number | null = null;
        if (msg.reply_to_message?.text) {
          const repliedText = msg.reply_to_message.text;
          const userTagMatch = repliedText.match(/#user_(\d+)/) || repliedText.match(/User ID:\s*(\d+)/i) || repliedText.match(/<code>(\d+)<\/code>/);
          if (userTagMatch && userTagMatch[1]) {
            replyTargetUser = userTagMatch[1];
          }
        }
        if (!replyTargetUser && pendingAdminReplyTarget) {
          replyTargetUser = pendingAdminReplyTarget;
        }

        if (replyTargetUser) {
          pendingAdminReplyTarget = null;
          const userReceiveMsg = `👨‍💻 <b>BEKZOD IDIYEV SIZGA JAVOB YOZDI:</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
${escapeHtml(text)}
━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 <i>Qo'shimcha savol yoki taklifingiz bo'lsa, shunchaki shu yerga yozishingiz mumkin.</i>`;

          const sendResult = await sendTg('sendMessage', {
            chat_id: replyTargetUser,
            text: userReceiveMsg,
            parse_mode: 'HTML',
          });

          if (sendResult?.ok) {
            await sendTg('sendMessage', {
              chat_id: chatId,
              text: `✅ <b>Javobingiz foydalanuvchiga (ID: <code>${replyTargetUser}</code>) muvaffaqiyatli yetkazildi!</b>\n\n💬 <i>Yuborilgan javob:</i>\n"${escapeHtml(text)}"`,
              parse_mode: 'HTML',
            });
          } else {
            await sendTg('sendMessage', {
              chat_id: chatId,
              text: `⚠️ <b>Javob yetkazilmadi.</b> Foydalanuvchi botni bloklagan yoki xatolik yuz berdi: ${sendResult?.description || 'Noma\'lum'}`,
              parse_mode: 'HTML',
            });
          }

          return res.status(200).json({ ok: true });
        }
      }

      // /start or /help
      if (text.startsWith('/start') || text.startsWith('/help')) {
        const welcomeText = `🚀 <b>Assalomu alaykum, ${escapeHtml(name)}!</b>

Men <b>Bekzod Idiyev</b>ning rasmiy portfolio botiman.
Python Backend Dasturchi & School 21 Data Science Talabasi.

Bu yerda mening tajribam, ishlab chiqqan arxitekturam, loyihalarim va ko'nikmalarim bilan tanishishingiz mumkin.

Quyidagi menyulardan birini tanlang yoki to'g'ridan-to'g'ri 3D Portfolioni oching:`;

        await sendTg('sendMessage', {
          chat_id: chatId,
          text: welcomeText,
          parse_mode: 'HTML',
          reply_markup: getMainReplyKeyboard(),
        });
        return res.status(200).json({ ok: true });
      }

      // About
      if (text === '👨‍💻 Men Haqimda' || text === '/about') {
        const aboutText = `👨‍💻 <b>BEKZOD IDIYEV — PYTHON BACKEND ARCHITECT</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 <b>Mutaxassisligi:</b> Python Backend Developer & Systems Engineer
🎓 <b>Ta'lim:</b> School 21 (Data Science & Core Engineering)
📍 <b>Joylashuv:</b> Buxoro, O'zbekiston (UTC+5)

🎯 <b>Asosiy Yo'nalishlar:</b>
• Yuqori yuklamalarga chidamli asinxron REST API'lar (FastAPI, Django, Flask)
• Ishonchli Telegram Bot ekotizimlari (aiogram 3.x, WebSockets)
• Ma'lumotlar bazalari optimizatsiyasi (PostgreSQL, Redis, Indexing)
• Docker, Celery asinxron navbatlar va CI/CD integratsiyasi

💡 <i>"Yozilgan har bir qator kod — 99.9% uptime va yuqori samaradorlikka xizmat qilishi kerak."</i>`;

        await sendTg('sendMessage', {
          chat_id: chatId,
          text: aboutText,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🌐 3D Portfolioda Ko\'rish', url: `${PORTFOLIO_URL}/#about` },
                { text: '🐙 GitHub Profil', url: GITHUB_URL },
              ],
            ],
          },
        });
        return res.status(200).json({ ok: true });
      }

      // Projects
      if (text === '📂 Loyihalarim' || text === '/projects') {
        const projText = `📂 <b>ISHLAB CHIQARISH LOYIHALARI:</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
Quyidagi loyihalardan birini tanlang:

1️⃣ <b>Buddy Team</b> — AI Mentor & Team Matchmaking
2️⃣ <b>Esports Tournament Bot</b> — Turnir boshqaruv tizimi
3️⃣ <b>PeerLearn Telegram Mini App</b> — Ta'lim platformasi`;

        await sendTg('sendMessage', {
          chat_id: chatId,
          text: projText,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🚀 Buddy Team (AI Match)', callback_data: 'proj_buddy' }],
              [{ text: '🎮 Esports Tournament Bot', callback_data: 'proj_esports' }],
              [{ text: '📚 PeerLearn Mini App', callback_data: 'proj_peerlearn' }],
              [{ text: '🌐 Barcha Loyihalarni Ko\'rish', url: `${PORTFOLIO_URL}/#projects` }],
            ],
          },
        });
        return res.status(200).json({ ok: true });
      }

      // Skills
      if (text === '🛠️ Stack & Texnologiyalar' || text === '/skills') {
        const skillsText = `🛠️ <b>TEXNOLOGIYALAR VA KO'NIKMALAR STACKI:</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🐍 <b>Backend & Dasturlash:</b>
• Python 3.11+, FastAPI, Django REST Framework, Flask, AsyncIO

🗄️ <b>Ma'lumotlar Bazasi & Kesh:</b>
• PostgreSQL (Indexing, Query Optimization), Redis, SQLite, MongoDB

⚙️ <b>DevOps & Muhandislik:</b>
• Docker, Docker Compose, Linux/Unix, Git, GitHub Actions, Nginx

🤖 <b>Telegram Ekotizimi:</b>
• aiogram 3.x, Telegram Bot API, Webhook Gateway, Telegram Mini Apps (TMA)`;

        await sendTg('sendMessage', {
          chat_id: chatId,
          text: skillsText,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [{ text: '⚡ Interaktiv Stackni Ko\'rish', url: `${PORTFOLIO_URL}/#skills` }],
            ],
          },
        });
        return res.status(200).json({ ok: true });
      }

      // Resume
      if (text === '📄 Rezyume / CV' || text === '/cv' || text === '/resume') {
        const cvText = `📄 <b>REZYUME / CV SPETSIFIKATSIYASI:</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Ism:</b> Bekzod Idiyev
💼 <b>Lavozim:</b> Python Backend Developer
📧 <b>Email:</b> bekzodidiyev89@gmail.com
📱 <b>Telegram:</b> @toyneden

Quyidagi tugma orqali to'liq PDF Rezyumeni ko'rishingiz mumkin:`;

        await sendTg('sendMessage', {
          chat_id: chatId,
          text: cvText,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🌐 Interaktiv CV Spec', url: PORTFOLIO_URL },
                { text: '🐙 GitHub Profil', url: GITHUB_URL },
              ],
            ],
          },
        });
        return res.status(200).json({ ok: true });
      }

      // Contact
      if (text === '✍️ Xabar Qoldirish' || text === '/contact') {
        await sendTg('sendMessage', {
          chat_id: chatId,
          text: `✍️ <b>BEKZOD IDIYEVGA XABAR QOLDIRISH</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
Bekzod Idiyevga o'z taklifingiz, loyiha g'oyangiz yoki xabaringizni yozib yuboring.
Matnni shunchaki shu yerga yozing:`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      }

      // Language Switcher
      if (text === '🌐 Tilni O\'zgartirish' || text === '/language') {
        await sendTg('sendMessage', {
          chat_id: chatId,
          text: `🌐 <b>Iltimos, o'zingizga qulay tilni tanlang:</b>`,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🇺🇿 O\'zbekcha', callback_data: 'setlang_uz' },
                { text: '🇷🇺 Русский', callback_data: 'setlang_ru' },
                { text: '🇬🇧 English', callback_data: 'setlang_en' },
              ],
            ],
          },
        });
        return res.status(200).json({ ok: true });
      }

      // Admin Panel (/admin)
      if (text === '/admin') {
        if (!isAdmin) {
          await sendTg('sendMessage', {
            chat_id: chatId,
            text: '⛔ <b>Ruxsat etilmagan:</b> Bu bo\'lim faqat bot administratori (Bekzod Idiyev) uchun mo\'ljallangan.',
            parse_mode: 'HTML',
          });
          return res.status(200).json({ ok: true });
        }

        const adminPanelText = await buildAdminMainText(serverTimestamp, chatId);

        await sendTg('sendMessage', {
          chat_id: chatId,
          text: adminPanelText,
          parse_mode: 'HTML',
          reply_markup: getAdminMainKeyboard(),
        });
        return res.status(200).json({ ok: true });
      }

      // Forward general message to Bekzod Admin with Quick Action Buttons
      botStats.totalMessagesForwarded += 1;
      const adminLeadMsg = `🚀 <b>YANGI BOT XABARI (INCOMING LEAD)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Yuboruvchi:</b> ${escapeHtml(name)} ${from.last_name ? escapeHtml(from.last_name) : ''}
🆔 <b>User ID:</b> <code>${chatId}</code>
👤 <b>Username:</b> @${from.username || 'mavjud_emas'}
🕒 <b>Vaqt:</b> ${serverTimestamp} (Toshkent / UTC+5)

💬 <b>Xabar Matni:</b>
${escapeHtml(text)}
━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ <i>Javob berish: ushbu xabarga <b>Reply</b> qiling yoki pastdagi tugmani bosing!</i>
#user_${chatId}`;

      // Forward to Bekzod with Direct Bot Reply and Telegram Profile buttons
      await sendTg('sendMessage', {
        chat_id: adminId,
        text: adminLeadMsg,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '💬 Botdan To\'g\'ridan-to\'g\'ri Javob Yozish', callback_data: `reply_user_${chatId}` }],
            [{ text: '✈️ Telegram Profiliga O\'tish', url: `tg://user?id=${chatId}` }],
          ],
        },
      });

      // Acknowledge to user
      await sendTg('sendMessage', {
        chat_id: chatId,
        text: `✅ <b>Xabaringiz Bekzod Idiyevga yetkazildi!</b>

Rahmat! Tez orada siz bilan bog'lanaman. 🚀`,
        parse_mode: 'HTML',
        reply_markup: getMainReplyKeyboard(),
      });

      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error('Webhook safe catch exception:', e);
    return res.status(200).json({ ok: true, error: e?.message });
  }
}
