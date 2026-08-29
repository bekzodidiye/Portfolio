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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Method Not Allowed. Use POST.',
    });
  }

  try {
    const data = req.body || {};
    const {
      visitorName,
      visitorRole,
      isAnonymous,
      ip: clientReportedIp,
      country,
      city,
      region,
      isp,
      networkType,
      networkSpeed,
      rtt,
      deviceType,
      os,
      browser,
      screenResolution,
      viewportSize,
      pixelRatio,
      cpuCores,
      deviceMemory,
      referrerSource,
      landingUrl,
      utmSource,
      siteLanguage,
      browserLanguage,
      timezone,
    } = data;

    const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Server error: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing.');
      return res.status(500).json({
        ok: false,
        error: 'Telegram Bot sozlamalari topilmadi.',
      });
    }

    // Extract Server-side IP and headers
    const rawIpHeader =
      (req.headers['x-forwarded-for'] as string) ||
      (req.headers['x-real-ip'] as string) ||
      req.socket?.remoteAddress ||
      '';
    const serverIp = rawIpHeader.split(',')[0].trim();
    const finalIp = clientReportedIp || serverIp || 'Unknown IP';

    // Samarkand/Tashkent Timestamp
    const timestamp = new Intl.DateTimeFormat('uz-UZ', {
      timeZone: 'Asia/Samarkand',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());

    // Build role badge
    const roleText = visitorRole ? `\n🎯 <b>Maqsad / Rol:</b> ${escapeHtml(visitorRole)}` : '';
    const anonBadge = isAnonymous ? ' <i>(Anonim)</i>' : '';

    // Build location string
    const locationParts = [country, city, region].filter(Boolean);
    const locationLine =
      locationParts.length > 0 ? locationParts.join(', ') : '🌍 Aniqlanmagan (O\'zbekiston/Global)';

    // Build network info
    const netDetails = [networkType, networkSpeed, rtt].filter(Boolean).join(' • ');
    const netLine = netDetails ? `\n  • <b>Tarmoq:</b> ${escapeHtml(netDetails)}` : '';
    const ispLine = isp ? `\n  • <b>Provayder:</b> ${escapeHtml(isp)}` : '';

    // Build hardware info
    const hwDetails = [cpuCores, deviceMemory, pixelRatio ? `DPR: ${pixelRatio}` : '']
      .filter(Boolean)
      .join(' | ');

    // UTM / Source info
    const utmLine = utmSource ? `\n  • <b>UTM Source / Kampaniya:</b> <code>${escapeHtml(utmSource)}</code>` : '';

    // Construct rich HTML message
    const telegramHtmlMessage = `👁️ <b>YANGI TASHRIF BUYURUVCHI (PORTFOLIO)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Mehmon:</b> <b>${escapeHtml(visitorName || 'Anonim Tashrif Buyuruvchi')}</b>${anonBadge}${roleText}

🌍 <b>Geolokatsiya & Tarmoq:</b>
  • <b>IP:</b> <code>${escapeHtml(finalIp)}</code>
  • <b>Manzil:</b> ${escapeHtml(locationLine)}${ispLine}${netLine}

📱 <b>Qurilma & Dasturiy Muhit:</b>
  • <b>Qurilma:</b> ${escapeHtml(deviceType || '💻 Kompyuter')}
  • <b>OS:</b> ${escapeHtml(os || 'Noma\'lum OS')}
  • <b>Brauzer:</b> ${escapeHtml(browser || 'Noma\'lum Brauzer')}
  • <b>Ekran:</b> <code>${escapeHtml(screenResolution || 'Noma\'lum')}</code> (Oyna: ${escapeHtml(viewportSize || '')})
  • <b>Uskuna:</b> ${escapeHtml(hwDetails || 'Standart')}

🧭 <b>Tashrif Manbasi & Kontekst:</b>
  • <b>Qayerdan keldi:</b> ${escapeHtml(referrerSource || 'To\'g\'ridan-to\'g\'ri')}
  • <b>Sayt Tili:</b> 🌐 ${(siteLanguage || 'uz').toUpperCase()} (Brauzer: ${escapeHtml(browserLanguage || 'uz-UZ')})
  • <b>Timezone:</b> ⏱️ ${escapeHtml(timezone || 'Asia/Tashkent')}${utmLine}
  • <b>Sahifa:</b> <code>${escapeHtml(landingUrl || '/')}</code>
  • <b>Vaqt:</b> 🕒 ${timestamp} (Toshkent / UTC+5)
━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ <i>Bekzod Idiyev Portfolio Telemetry v2.0</i>`;

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
      console.error('Telegram visitor dispatch error:', errorDetail);
      return res.status(502).json({
        ok: false,
        error: errorDetail.description || 'Telegram xabari yetkazilmadi',
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Tashrif ma\'lumotlari Telegram botga yuborildi!',
    });
  } catch (error: any) {
    console.error('Visitor serverless exception:', error);
    return res.status(500).json({
      ok: false,
      error: 'Server ichki xatoligi.',
    });
  }
}
