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
      latitude,
      longitude,
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
      gpu,
      battery,
      referrerSource,
      landingUrl,
      utmSource,
      siteLanguage,
      browserLanguage,
      timezone,
    } = data;

    const botToken =
      process.env.TELEGRAM_BOT_TOKEN ||
      process.env.VITE_TELEGRAM_BOT_TOKEN ||
      '8708309461:AAGAh4Pz_Rfr4jHN8qRtkq9MbtEpT3Q5Hfc';
    const chatId =
      process.env.TELEGRAM_CHAT_ID ||
      process.env.VITE_TELEGRAM_CHAT_ID ||
      '5678281376';

    // Extract Server-side IP and headers
    const rawIpHeader =
      (req.headers['x-forwarded-for'] as string) ||
      (req.headers['x-real-ip'] as string) ||
      req.socket?.remoteAddress ||
      '';
    const serverIp = rawIpHeader.split(',')[0].trim();
    const finalIp = clientReportedIp || serverIp || 'Unknown IP';

    // Vercel Edge GeoIP fallback
    const vercelLat = req.headers['x-vercel-ip-latitude'] ? parseFloat(req.headers['x-vercel-ip-latitude']) : undefined;
    const vercelLon = req.headers['x-vercel-ip-longitude'] ? parseFloat(req.headers['x-vercel-ip-longitude']) : undefined;
    const vercelCity = req.headers['x-vercel-ip-city'] as string | undefined;
    const vercelCountry = req.headers['x-vercel-ip-country'] as string | undefined;

    const finalLat = typeof latitude === 'number' ? latitude : vercelLat;
    const finalLon = typeof longitude === 'number' ? longitude : vercelLon;
    const finalCity = city || (vercelCity ? decodeURIComponent(vercelCity) : undefined);
    const finalCountry = country || vercelCountry;

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
    const locationParts = [finalCountry, finalCity, region].filter(Boolean);
    const locationLine =
      locationParts.length > 0 ? locationParts.join(', ') : '🌍 Aniqlanmagan (O\'zbekiston/Global)';

    // Build network info
    const netDetails = [networkType, networkSpeed, rtt].filter(Boolean).join(' • ');
    const netLine = netDetails ? `\n  • <b>Tarmoq:</b> ${escapeHtml(netDetails)}` : '';
    const ispLine = isp ? `\n  • <b>Provayder:</b> ${escapeHtml(isp)}` : '';

    // Build map link line
    let mapTextLine = '';
    let googleMapsDirectUrl = '';
    let yandexMapsDirectUrl = '';

    if (finalLat && finalLon) {
      googleMapsDirectUrl = `https://www.google.com/maps?q=${finalLat},${finalLon}`;
      yandexMapsDirectUrl = `https://yandex.com/maps/?ll=${finalLon},${finalLat}&z=14`;
      const accuracyText = data.locationAccuracy ? ` (${escapeHtml(data.locationAccuracy)})` : '';
      const sourceText = data.locationSource ? ` [${escapeHtml(data.locationSource)}]` : '';
      mapTextLine = `\n  • <b>Xarita (Koordinatalar):</b> <a href="${googleMapsDirectUrl}">📍 Google Xaritani Ochish (${finalLat.toFixed(4)}, ${finalLon.toFixed(4)})</a>${sourceText}${accuracyText}`;
    } else {
      const mapFallbackQuery = encodeURIComponent(`${finalCity || ''} ${finalCountry || ''}`.trim() || finalIp);
      googleMapsDirectUrl = `https://www.google.com/maps/search/?api=1&query=${mapFallbackQuery}`;
      yandexMapsDirectUrl = `https://yandex.com/maps/?text=${mapFallbackQuery}`;
      mapTextLine = `\n  • <b>Xarita:</b> <a href="${googleMapsDirectUrl}">📍 Google Xaritada Qidirish</a>`;
    }

    // Build hardware info
    const hwDetails = [
      cpuCores,
      deviceMemory,
      pixelRatio ? `DPR: ${pixelRatio}` : '',
      battery ? `🔋 Batareya: ${battery}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    const gpuLine = gpu ? `\n  • <b>GPU:</b> <code>${escapeHtml(gpu)}</code>` : '';

    // UTM / Source info
    const utmLine = utmSource ? `\n  • <b>UTM Source / Kampaniya:</b> <code>${escapeHtml(utmSource)}</code>` : '';

    // Construct rich HTML message
    const telegramHtmlMessage = `👁️ <b>YANGI TASHRIF BUYURUVCHI (PORTFOLIO)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Mehmon:</b> <b>${escapeHtml(visitorName || 'Anonim Tashrif Buyuruvchi')}</b>${anonBadge}${roleText}

🌍 <b>Geolokatsiya & Tarmoq:</b>
  • <b>IP:</b> <code>${escapeHtml(finalIp)}</code>
  • <b>Manzil:</b> ${escapeHtml(locationLine)}${mapTextLine}${ispLine}${netLine}

📱 <b>Qurilma & Dasturiy Muhit:</b>
  • <b>Qurilma:</b> ${escapeHtml(deviceType || '💻 Kompyuter')}
  • <b>OS:</b> ${escapeHtml(os || 'Noma\'lum OS')}
  • <b>Brauzer:</b> ${escapeHtml(browser || 'Noma\'lum Brauzer')}
  • <b>Ekran:</b> <code>${escapeHtml(screenResolution || 'Noma\'lum')}</code> (Oyna: ${escapeHtml(viewportSize || '')})
  • <b>Uskuna:</b> ${escapeHtml(hwDetails || 'Standart')}${gpuLine}

🧭 <b>Tashrif Manbasi & Kontekst:</b>
  • <b>Qayerdan keldi:</b> ${escapeHtml(referrerSource || 'To\'g\'ridan-to\'g\'ri')}
  • <b>Sayt Tili:</b> 🌐 ${(siteLanguage || 'uz').toUpperCase()} (Brauzer: ${escapeHtml(browserLanguage || 'uz-UZ')})
  • <b>Timezone:</b> ⏱️ ${escapeHtml(timezone || 'Asia/Tashkent')}${utmLine}
  • <b>Sahifa:</b> <code>${escapeHtml(landingUrl || '/')}</code>
  • <b>Vaqt:</b> 🕒 ${timestamp} (Toshkent / UTC+5)
━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ <i>Bekzod Idiyev Portfolio Telemetry Gateway</i>`;

    // Construct interactive inline keyboard buttons
    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '📍 Aniq Xaritani Ochish (Google Maps)', url: googleMapsDirectUrl },
        ],
        [
          { text: '🗺️ Yandex Xaritada Ko\'rish', url: yandexMapsDirectUrl },
          { text: '🌐 Portfolioni Ochish', url: landingUrl || 'https://bekzod-idiyev-portfolio.vercel.app' },
        ],
        [
          { text: '🐙 GitHub Profil', url: 'https://github.com/bekzodidiye' },
          { text: '💬 Telegram (@toyneden)', url: 'https://t.me/toyneden' },
        ],
      ],
    };

    // 1. Send Main Telemetric HTML Message
    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramHtmlMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
        reply_markup: inlineKeyboard,
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

    // 2. If precise GPS latitude and longitude exist, also send native Telegram Map Location PIN
    if (finalLat && finalLon) {
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendLocation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            latitude: finalLat,
            longitude: finalLon,
            disable_notification: true,
          }),
        });
      } catch (locErr) {
        console.warn('sendLocation error:', locErr);
      }
    }

    return res.status(200).json({
      ok: true,
      message: 'Tashrif ma\'lumotlari va xaritasi Telegram botga yuborildi!',
    });
  } catch (error: any) {
    console.error('Visitor serverless exception:', error);
    return res.status(500).json({
      ok: false,
      error: 'Server ichki xatoligi.',
    });
  }
}
