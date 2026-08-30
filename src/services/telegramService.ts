import { VisitorTelemetryData } from './visitorTelemetry';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
  language?: string;
}

export interface TelegramSendResult {
  success: boolean;
  message?: string;
  error?: string;
  directTelegramUrl?: string;
}

const RATE_LIMIT_KEY = 'portfolio_last_contact_ts';
const VISITOR_LOGGED_KEY = 'portfolio_visitor_telemetry_sent';
const COOLDOWN_SECONDS = 45;

/**
 * Check if the user is currently rate-limited (sent a message in the last N seconds)
 */
export function getRemainingCooldown(): number {
  try {
    const lastSent = localStorage.getItem(RATE_LIMIT_KEY);
    if (!lastSent) return 0;
    const elapsed = (Date.now() - parseInt(lastSent, 10)) / 1000;
    if (elapsed < COOLDOWN_SECONDS) {
      return Math.ceil(COOLDOWN_SECONDS - elapsed);
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Generate a direct Telegram DM URL with pre-filled message
 */
export function generateDirectTelegramUrl(payload: ContactPayload): string {
  const text = `Salom Bekzod! Portfoliongiz orqali bog'lanmoqdaman:

👤 Ismim: ${payload.name}
📧 Email: ${payload.email}
📝 Xabar: ${payload.message}`;

  return `https://t.me/toyneden?text=${encodeURIComponent(text)}`;
}

/**
 * Escapes HTML characters for Telegram Bot API HTML parse mode
 */
function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Send contact lead:
 * 1. Tries /api/contact (Works in Vercel Serverless and local Vite dev server via middleware).
 * 2. If /api/contact is unavailable, directly calls Telegram API via client-side fetch.
 * 3. If network fails, provides direct link to Telegram DM.
 */
export async function sendTelegramLead(payload: ContactPayload): Promise<TelegramSendResult> {
  const directUrl = generateDirectTelegramUrl(payload);

  // 1. Anti-Spam Honeypot Check
  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    console.warn('Spam bot detected via honeypot trap.');
    return { success: true };
  }

  // 2. Client-Side Rate Limit Check
  const remainingCooldown = getRemainingCooldown();
  if (remainingCooldown > 0) {
    return {
      success: false,
      error: `Iltimos, yangi xabar yuborishdan oldin ${remainingCooldown} soniya kuting.`,
      directTelegramUrl: directUrl,
    };
  }

  // 3. Primary Path: Call /api/contact
  try {
    const serverlessController = new AbortController();
    const serverlessTimeout = setTimeout(() => serverlessController.abort(), 8000);

    const apiResponse = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: serverlessController.signal,
    });

    clearTimeout(serverlessTimeout);

    const contentType = apiResponse.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await apiResponse.json().catch(() => ({}));
      if (apiResponse.ok && data.ok) {
        try {
          localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
        } catch {
          // ignore
        }
        return {
          success: true,
          message: data.message || 'Xabaringiz Telegram botga muvaffaqiyatli yetkazildi!',
        };
      } else if (!apiResponse.ok && data.error) {
        return {
          success: false,
          error: data.error,
          directTelegramUrl: directUrl,
        };
      }
    }
  } catch (serverlessErr) {
    console.warn('API endpoint unreachable, trying client fallback...', serverlessErr);
  }

  // 4. Secondary Path: Direct Client-Side Fetch to Telegram API
  const botToken = (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID;

  if (botToken && chatId && botToken !== 'YOUR_TELEGRAM_BOT_TOKEN' && chatId !== 'YOUR_TELEGRAM_CHAT_ID') {
    const timestamp = new Intl.DateTimeFormat('uz-UZ', {
      timeZone: 'Asia/Samarkand',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());

    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
    const deviceType = /android|iphone|ipad|ipod/i.test(userAgent) ? '📱 Mobile' : '💻 Desktop';

    const telegramHtmlMessage = `🚀 <b>YANGI PORTFOLIO XABARI (LEAD)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Yuboruvchi:</b> ${escapeHtml(payload.name)}
📧 <b>Email:</b> <code>${escapeHtml(payload.email)}</code>
🕒 <b>Vaqt:</b> ${timestamp} (Toshkent / UTC+5)
🌐 <b>Sayt tili:</b> ${escapeHtml((payload.language || 'uz').toUpperCase())}
📱 <b>Qurilma:</b> ${deviceType}

💬 <b>Xabar:</b>
${escapeHtml(payload.message)}
━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ <i>Bekzod Idiyev Portfolio Direct Gateway</i>`;

    try {
      const clientController = new AbortController();
      const clientTimeout = setTimeout(() => clientController.abort(), 8000);

      const clientResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
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
        signal: clientController.signal,
      });

      clearTimeout(clientTimeout);

      if (clientResponse.ok) {
        try {
          localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
        } catch {
          // ignore
        }
        return {
          success: true,
          message: 'Xabaringiz Telegram botga muvaffaqiyatli yetkazildi!',
        };
      } else {
        const errJson = await clientResponse.json().catch(() => ({}));
        return {
          success: false,
          error: `Telegram API xatoligi: ${errJson.description || 'Xabar yetkazilmadi'}`,
          directTelegramUrl: directUrl,
        };
      }
    } catch (clientErr) {
      console.error('Client direct dispatch error:', clientErr);
    }
  }

  // 5. Fallback to Telegram DM
  return {
    success: false,
    error: 'Telegram Botga ulanib bo\'lmadi. To\'g\'ridan-to\'g\'ri Telegram profilingiz orqali yozishingiz mumkin.',
    directTelegramUrl: directUrl,
  };
}

/**
 * Send Visitor Identification & Telemetry Notification
 */
export async function sendVisitorNotification(
  telemetry: VisitorTelemetryData
): Promise<TelegramSendResult> {
  // Prevent duplicate spam within session if already logged with the same name
  try {
    const sessionKey = `visitor_sent_${telemetry.visitorName}_${telemetry.visitorRole || ''}`;
    if (sessionStorage.getItem(sessionKey)) {
      return { success: true, message: 'Already recorded in this session.' };
    }
    sessionStorage.setItem(sessionKey, 'true');
  } catch {
    // ignore
  }

  // 1. Primary: Call /api/visitor (Vercel Serverless or Vite dev server)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    const apiRes = await fetch('/api/visitor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(telemetry),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (apiRes.ok) {
      try {
        localStorage.setItem(VISITOR_LOGGED_KEY, Date.now().toString());
      } catch {
        // ignore
      }
      return { success: true, message: 'Visitor logged.' };
    }
  } catch (err) {
    console.warn('/api/visitor unreachable, attempting client direct dispatch...', err);
  }

  // 2. Secondary: Client Direct Dispatch
  const botToken = (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID;

  if (botToken && chatId && botToken !== 'YOUR_TELEGRAM_BOT_TOKEN' && chatId !== 'YOUR_TELEGRAM_CHAT_ID') {
    const locationParts = [telemetry.country, telemetry.city, telemetry.region].filter(Boolean);
    const locationLine =
      locationParts.length > 0 ? locationParts.join(', ') : '🌍 Aniqlanmagan (Global)';

    const roleText = telemetry.visitorRole
      ? `\n🎯 <b>Maqsad / Rol:</b> ${escapeHtml(telemetry.visitorRole)}`
      : '';
    const anonBadge = telemetry.isAnonymous ? ' <i>(Anonim)</i>' : '';
    const netDetails = [telemetry.networkType, telemetry.networkSpeed, telemetry.rtt]
      .filter(Boolean)
      .join(' • ');
    const netLine = netDetails ? `\n  • <b>Tarmoq:</b> ${escapeHtml(netDetails)}` : '';
    const ispLine = telemetry.isp ? `\n  • <b>Provayder:</b> ${escapeHtml(telemetry.isp)}` : '';
    const hwDetails = [
      telemetry.cpuCores,
      telemetry.deviceMemory,
      telemetry.pixelRatio ? `DPR: ${telemetry.pixelRatio}` : '',
      telemetry.battery ? `🔋 Batareya: ${telemetry.battery}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    const gpuLine = telemetry.gpu ? `\n  • <b>GPU:</b> <code>${escapeHtml(telemetry.gpu)}</code>` : '';
    const utmLine = telemetry.utmSource
      ? `\n  • <b>UTM Kampaniya:</b> <code>${escapeHtml(telemetry.utmSource)}</code>`
      : '';

    // Build map link line
    let mapTextLine = '';
    let googleMapsDirectUrl = '';
    let yandexMapsDirectUrl = '';

    if (telemetry.latitude && telemetry.longitude) {
      googleMapsDirectUrl = `https://www.google.com/maps?q=${telemetry.latitude},${telemetry.longitude}`;
      yandexMapsDirectUrl = `https://yandex.com/maps/?ll=${telemetry.longitude},${telemetry.latitude}&z=14`;
      mapTextLine = `\n  • <b>Aniq Xarita (GPS/IP):</b> <a href="${googleMapsDirectUrl}">📍 Google Xaritada Ko'rish (${telemetry.latitude.toFixed(4)}, ${telemetry.longitude.toFixed(4)})</a>`;
    } else {
      const mapFallbackQuery = encodeURIComponent(`${telemetry.city || ''} ${telemetry.country || ''}`.trim() || telemetry.ip || '');
      googleMapsDirectUrl = `https://www.google.com/maps/search/?api=1&query=${mapFallbackQuery}`;
      yandexMapsDirectUrl = `https://yandex.com/maps/?text=${mapFallbackQuery}`;
      mapTextLine = `\n  • <b>Xarita:</b> <a href="${googleMapsDirectUrl}">📍 Google Xaritada Qidirish</a>`;
    }

    const directHtmlMessage = `👁️ <b>YANGI TASHRIF BUYURUVCHI (PORTFOLIO)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Mehmon:</b> <b>${escapeHtml(telemetry.visitorName || 'Anonim Tashrif Buyuruvchi')}</b>${anonBadge}${roleText}

🌍 <b>Geolokatsiya & Tarmoq:</b>
  • <b>IP:</b> <code>${escapeHtml(telemetry.ip || 'Client Direct')}</code>
  • <b>Manzil:</b> ${escapeHtml(locationLine)}${mapTextLine}${ispLine}${netLine}

📱 <b>Qurilma & Dasturiy Muhit:</b>
  • <b>Qurilma:</b> ${escapeHtml(telemetry.deviceType || '💻 Kompyuter')}
  • <b>OS:</b> ${escapeHtml(telemetry.os || 'Noma\'lum OS')}
  • <b>Brauzer:</b> ${escapeHtml(telemetry.browser || 'Noma\'lum Brauzer')}
  • <b>Ekran:</b> <code>${escapeHtml(telemetry.screenResolution || 'Noma\'lum')}</code> (Oyna: ${escapeHtml(telemetry.viewportSize || '')})
  • <b>Uskuna:</b> ${escapeHtml(hwDetails || 'Standart')}${gpuLine}

🧭 <b>Tashrif Manbasi & Kontekst:</b>
  • <b>Qayerdan keldi:</b> ${escapeHtml(telemetry.referrerSource || 'To\'g\'ridan-to\'g\'ri')}
  • <b>Sayt Tili:</b> 🌐 ${(telemetry.siteLanguage || 'uz').toUpperCase()} (Brauzer: ${escapeHtml(telemetry.browserLanguage || 'uz-UZ')})
  • <b>Timezone:</b> ⏱️ ${escapeHtml(telemetry.timezone || 'Asia/Tashkent')}${utmLine}
  • <b>Sahifa:</b> <code>${escapeHtml(telemetry.landingUrl || '/')}</code>
  • <b>Vaqt:</b> 🕒 ${telemetry.timestamp} (Toshkent / UTC+5)
━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ <i>Bekzod Idiyev Portfolio Telemetry Gateway</i>`;

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '📍 Aniq Xaritani Ochish (Google Maps)', url: googleMapsDirectUrl },
        ],
        [
          { text: '🗺️ Yandex Xaritada Ko\'rish', url: yandexMapsDirectUrl },
          { text: '🌐 Portfolioni Ochish', url: telemetry.landingUrl || 'https://bekzod-idiyev-portfolio.vercel.app' },
        ],
        [
          { text: '🐙 GitHub Profil', url: 'https://github.com/bekzodidiye' },
          { text: '💬 Telegram (@toyneden)', url: 'https://t.me/toyneden' },
        ],
      ],
    };

    try {
      const clientController = new AbortController();
      const clientTimeout = setTimeout(() => clientController.abort(), 8000);

      const clientResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: directHtmlMessage,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
          reply_markup: inlineKeyboard,
        }),
        signal: clientController.signal,
      });

      if (telemetry.latitude && telemetry.longitude) {
        fetch(`https://api.telegram.org/bot${botToken}/sendLocation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            latitude: telemetry.latitude,
            longitude: telemetry.longitude,
            disable_notification: true,
          }),
        }).catch(() => {});
      }

      clearTimeout(clientTimeout);


      if (clientResponse.ok) {
        try {
          localStorage.setItem(VISITOR_LOGGED_KEY, Date.now().toString());
        } catch {
          // ignore
        }
        return { success: true, message: 'Visitor logged successfully via client direct.' };
      }
    } catch (e) {
      console.error('Client direct visitor dispatch failed:', e);
    }
  }

  return { success: false, error: 'Unable to dispatch visitor notification.' };
}
