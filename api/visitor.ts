import { neon } from '@neondatabase/serverless';

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

async function recordVisitorToPostgres(data: {
  visitorName?: string;
  visitorRole?: string;
  ip?: string;
  country?: string;
  city?: string;
  region?: string;
  street?: string;
  deviceType?: string;
  os?: string;
  browser?: string;
  gpu?: string;
  referrer?: string;
  latitude?: number;
  longitude?: number;
}) {
  const url =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING;
  if (!url) return;

  try {
    const sql = neon(url);
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
      INSERT INTO portfolio_visitors (
        visitor_name, visitor_role, ip, country, city, region, street,
        device_type, os, browser, gpu, referrer, latitude, longitude
      ) VALUES (
        ${data.visitorName || 'Anonim'},
        ${data.visitorRole || null},
        ${data.ip || null},
        ${data.country || null},
        ${data.city || null},
        ${data.region || null},
        ${data.street || null},
        ${data.deviceType || null},
        ${data.os || null},
        ${data.browser || null},
        ${data.gpu || null},
        ${data.referrer || null},
        ${data.latitude ?? null},
        ${data.longitude ?? null}
      );
    `;
  } catch (err) {
    console.warn('PostgreSQL record visitor error:', err);
  }
}

const visitorRateLimit = new Map<string, { count: number; lastAttempt: number }>();

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const url =
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING;
    if (!url) {
      return res.status(200).json({ ok: true, source: 'no_db', total: 0, today: 0, visitors: [] });
    }
    try {
      const sql = neon(url);
      const rows = await sql`
        SELECT id, visitor_name, visitor_role, ip, country, city, region, street,
               device_type, os, browser, gpu, referrer, latitude, longitude,
               TO_CHAR(visited_at AT TIME ZONE 'Asia/Samarkand', 'YYYY-MM-DD HH24:MI:SS') AS visited_at
        FROM portfolio_visitors
        ORDER BY id DESC
        LIMIT 50;
      `;
      const [totalRow] = await sql`SELECT COUNT(*)::int AS count FROM portfolio_visitors;`;
      const [todayRow] = await sql`SELECT COUNT(*)::int AS count FROM portfolio_visitors WHERE visited_at >= CURRENT_DATE;`;
      return res.status(200).json({
        ok: true,
        source: 'postgres',
        total: totalRow?.count || 0,
        today: todayRow?.count || 0,
        visitors: rows,
      });
    } catch (err: any) {
      console.warn('Postgres GET visitors error:', err);
      return res.status(200).json({ ok: true, source: 'error_fallback', total: 0, today: 0, visitors: [] });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Method Not Allowed. Use GET or POST.',
    });
  }

  try {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || 'Unknown IP';
    const now = Date.now();
    const rateLimitWindowMs = 5 * 60 * 1000; // 5 minutes
    const maxRequests = 10;

    const userRateData = visitorRateLimit.get(clientIp);
    if (userRateData) {
      if (now - userRateData.lastAttempt < rateLimitWindowMs) {
        if (userRateData.count >= maxRequests) {
          console.warn(`Rate limit exceeded for IP: ${clientIp} on /api/visitor`);
          return res.status(429).json({
            ok: false,
            error: 'Too many requests. Please try again later.',
          });
        }
        userRateData.count += 1;
        userRateData.lastAttempt = now;
      } else {
        visitorRateLimit.set(clientIp, { count: 1, lastAttempt: now });
      }
    } else {
      visitorRateLimit.set(clientIp, { count: 1, lastAttempt: now });
    }

    const data = req.body || {};
    const {
      visitorName,
      visitorRole,
      isAnonymous,
      ip: clientReportedIp,
      country,
      city,
      region,
      street,
      placeName,
      placeCategory,
      wifiSsid,
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
      '';
    const chatId =
      process.env.TELEGRAM_CHAT_ID ||
      process.env.VITE_TELEGRAM_CHAT_ID ||
      '5678281376';

    if (!botToken) {
      console.warn('TELEGRAM_BOT_TOKEN is not configured for visitor notification.');
      return res.status(200).json({
        ok: true,
        message: 'Visitor recorded, Telegram token not configured.',
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

    // Vercel Edge GeoIP fallback
    const vercelLat = req.headers['x-vercel-ip-latitude'] ? parseFloat(req.headers['x-vercel-ip-latitude']) : undefined;
    const vercelLon = req.headers['x-vercel-ip-longitude'] ? parseFloat(req.headers['x-vercel-ip-longitude']) : undefined;
    const vercelCity = req.headers['x-vercel-ip-city'] as string | undefined;
    const vercelCountry = req.headers['x-vercel-ip-country'] as string | undefined;

    const finalLat = typeof latitude === 'number' ? latitude : vercelLat;
    const finalLon = typeof longitude === 'number' ? longitude : vercelLon;
    const finalCity = city || (vercelCity ? decodeURIComponent(vercelCity) : undefined);
    const finalCountry = country || vercelCountry;

    // Persist real visitor to PostgreSQL (Vercel Postgres)
    await recordVisitorToPostgres({
      visitorName,
      visitorRole,
      ip: finalIp,
      country: finalCountry,
      city: finalCity,
      region,
      street: data.street,
      deviceType,
      os,
      browser,
      gpu,
      referrer: referrerSource,
      latitude: finalLat,
      longitude: finalLon,
    }).catch((e) => console.warn('Postgres persist error:', e));

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
    const locationParts = [finalCountry, finalCity, region, data.street ? `(${data.street})` : undefined].filter(Boolean);
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
    let appleMapsDirectUrl = '';

    if (finalLat && finalLon) {
      // High-precision pin URLs
      googleMapsDirectUrl = `https://maps.google.com/?q=${finalLat},${finalLon}&ll=${finalLat},${finalLon}&z=16`;
      yandexMapsDirectUrl = `https://yandex.uz/maps/?pt=${finalLon},${finalLat},pm2rdm&z=16&l=map`;
      appleMapsDirectUrl = `https://maps.apple.com/?ll=${finalLat},${finalLon}&q=Mehmon+Joylashuvi&z=16`;
      
      const accuracyText = data.locationAccuracy ? ` (${escapeHtml(data.locationAccuracy)})` : '';
      const sourceText = data.locationSource ? ` [${escapeHtml(data.locationSource)}]` : '';
      mapTextLine = `\n  • <b>Aniq Xarita:</b> <a href="${yandexMapsDirectUrl}">🗺️ Yandex Pin</a> | <a href="${googleMapsDirectUrl}">📍 Google Maps (${finalLat.toFixed(4)}, ${finalLon.toFixed(4)})</a>${sourceText}${accuracyText}`;
    } else {
      const mapFallbackQuery = encodeURIComponent(`${finalCity || ''} ${finalCountry || ''}`.trim() || finalIp);
      googleMapsDirectUrl = `https://maps.google.com/?q=${mapFallbackQuery}`;
      yandexMapsDirectUrl = `https://yandex.uz/maps/?text=${mapFallbackQuery}`;
      appleMapsDirectUrl = `https://maps.apple.com/?q=${mapFallbackQuery}`;
      mapTextLine = `\n  • <b>Xarita:</b> <a href="${yandexMapsDirectUrl}">🗺️ Yandex</a> | <a href="${googleMapsDirectUrl}">📍 Google</a>`;
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

    const placeDetails = [
      placeName ? `\n  • <b>Muassasa / Bino:</b> 🏢 ${escapeHtml(placeName)}${placeCategory ? ` (${escapeHtml(placeCategory)})` : ''}` : '',
      wifiSsid ? `\n  • <b>Wi-Fi Tarmog'i:</b> 📶 <code>${escapeHtml(wifiSsid)}</code>` : '',
    ].filter(Boolean).join('');

    // Construct rich HTML message
    const telegramHtmlMessage = `👁️ <b>YANGI TASHRIF BUYURUVCHI (PORTFOLIO)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Mehmon:</b> <b>${escapeHtml(visitorName || 'Anonim Tashrif Buyuruvchi')}</b>${anonBadge}${roleText}

🌍 <b>Geolokatsiya & Tarmoq:</b>
  • <b>IP:</b> <code>${escapeHtml(finalIp)}</code>
  • <b>Manzil:</b> ${escapeHtml(locationLine)}${placeDetails}${mapTextLine}${ispLine}${netLine}

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
          { text: '🗺️ Yandex Xaritada Ko\'rish (Aniq)', url: yandexMapsDirectUrl },
          { text: '📍 Google Maps', url: googleMapsDirectUrl },
        ],
        [
          { text: '🍏 Apple Maps', url: appleMapsDirectUrl },
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
