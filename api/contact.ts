export const config = {
  runtime: 'nodejs',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async function handler(req: any, res: any) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Method Not Allowed. Use POST.',
    });
  }

  try {
    const { name, email, message, honeypot, language } = req.body || {};

    // 1. Anti-Spam Honeypot Check (Silent drop for bots)
    if (honeypot && typeof honeypot === 'string' && honeypot.trim().length > 0) {
      console.warn('Bot submission blocked via honeypot trap.');
      return res.status(200).json({ ok: true, message: 'Message received.' });
    }

    // 2. Input Validation
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return res.status(400).json({
        ok: false,
        error: 'Iltimos, barcha maydonlarni to\'ldiring.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        ok: false,
        error: 'Noto\'g\'ri email formati.',
      });
    }

    // 3. Server-side Secret Tokens (Never sent to client)
    const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Server error: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing.');
      return res.status(500).json({
        ok: false,
        error: 'Serverda Telegram Bot sozlamalari topilmadi.',
      });
    }

    // 4. Client Metadata
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || 'Unknown IP';
    const userAgent = (req.headers['user-agent'] as string) || 'Unknown Client';
    const deviceType = /android|iphone|ipad|ipod/i.test(userAgent) ? '📱 Mobile' : '💻 Desktop';

    const timestamp = new Intl.DateTimeFormat('uz-UZ', {
      timeZone: 'Asia/Samarkand',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());

    // 5. Construct Clean, Robust HTML Telegram Message (Immune to Markdown formatting errors)
    const telegramHtmlMessage = `🚀 <b>YANGI PORTFOLIO XABARI (LEAD)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Yuboruvchi:</b> ${escapeHtml(trimmedName)}
📧 <b>Email:</b> <code>${escapeHtml(trimmedEmail)}</code>
🕒 <b>Vaqt:</b> ${timestamp} (Toshkent / UTC+5)
🌐 <b>Sayt tili:</b> ${escapeHtml((language || 'uz').toUpperCase())}
📱 <b>Qurilma:</b> ${deviceType}
🛡️ <b>IP:</b> <code>${escapeHtml(clientIp.split(',')[0].trim())}</code>

💬 <b>Xabar:</b>
${escapeHtml(trimmedMessage)}
━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ <i>Bekzod Idiyev Vercel Secure Gateway v2.0</i>`;

    // 6. Secure Server-to-Telegram Dispatch
    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramHtmlMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!telegramResponse.ok) {
      const errorDetail = await telegramResponse.json().catch(() => ({}));
      console.error('Telegram API response error:', errorDetail);
      return res.status(502).json({
        ok: false,
        error: `Telegram API xatoligi: ${errorDetail.description || 'Xabar yetkazilmadi'}`,
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Xabaringiz Telegram botga muvaffaqiyatli yetkazildi!',
    });
  } catch (error: any) {
    console.error('Serverless function exception:', error);
    return res.status(500).json({
      ok: false,
      error: 'Server ichki xatoligi yuz berdi.',
    });
  }
}
