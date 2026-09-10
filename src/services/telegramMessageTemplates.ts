import { VisitorTelemetryData } from './visitorTelemetry';
import { ContactPayload } from './telegramService';

export function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function buildLeadTelegramMessage(
  payload: ContactPayload,
  timestamp: string,
  deviceType: string
): string {
  return `🚀 <b>YANGI PORTFOLIO XABARI (LEAD)</b>
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
}

export function buildVisitorTelegramMessage(telemetry: VisitorTelemetryData): {
  text: string;
  inlineKeyboard: any;
  googleMapsDirectUrl: string;
  yandexMapsDirectUrl: string;
  appleMapsDirectUrl: string;
} {
  const locationParts = [
    telemetry.country,
    telemetry.city,
    telemetry.region,
    telemetry.street ? `(${telemetry.street})` : undefined,
  ].filter(Boolean);

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

  let mapTextLine = '';
  let googleMapsDirectUrl = '';
  let yandexMapsDirectUrl = '';
  let appleMapsDirectUrl = '';

  if (telemetry.latitude && telemetry.longitude) {
    googleMapsDirectUrl = `https://maps.google.com/?q=${telemetry.latitude},${telemetry.longitude}&ll=${telemetry.latitude},${telemetry.longitude}&z=16`;
    yandexMapsDirectUrl = `https://yandex.uz/maps/?pt=${telemetry.longitude},${telemetry.latitude},pm2rdm&z=16&l=map`;
    appleMapsDirectUrl = `https://maps.apple.com/?ll=${telemetry.latitude},${telemetry.longitude}&q=Mehmon+Joylashuvi&z=16`;

    const accuracyText = telemetry.locationAccuracy
      ? ` (${escapeHtml(telemetry.locationAccuracy)})`
      : '';
    const sourceText = telemetry.locationSource
      ? ` [${escapeHtml(telemetry.locationSource)}]`
      : '';
    mapTextLine = `\n  • <b>Aniq Xarita:</b> <a href="${yandexMapsDirectUrl}">🗺️ Yandex Pin</a> | <a href="${googleMapsDirectUrl}">📍 Google Maps (${telemetry.latitude.toFixed(
      4
    )}, ${telemetry.longitude.toFixed(4)})</a>${sourceText}${accuracyText}`;
  } else {
    const mapFallbackQuery = encodeURIComponent(
      `${telemetry.city || ''} ${telemetry.country || ''}`.trim() || telemetry.ip || ''
    );
    googleMapsDirectUrl = `https://maps.google.com/?q=${mapFallbackQuery}`;
    yandexMapsDirectUrl = `https://yandex.uz/maps/?text=${mapFallbackQuery}`;
    appleMapsDirectUrl = `https://maps.apple.com/?q=${mapFallbackQuery}`;
    mapTextLine = `\n  • <b>Xarita:</b> <a href="${yandexMapsDirectUrl}">🗺️ Yandex</a> | <a href="${googleMapsDirectUrl}">📍 Google</a>`;
  }

  const placeDetails = [
    telemetry.placeName ? `\n  • <b>Muassasa / Bino:</b> 🏢 ${escapeHtml(telemetry.placeName)}${telemetry.placeCategory ? ` (${escapeHtml(telemetry.placeCategory)})` : ''}` : '',
    telemetry.wifiSsid ? `\n  • <b>Wi-Fi Tarmog'i:</b> 📶 <code>${escapeHtml(telemetry.wifiSsid)}</code>` : '',
  ].filter(Boolean).join('');

  const text = `👁️ <b>YANGI TASHRIF BUYURUVCHI (PORTFOLIO)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Mehmon:</b> <b>${escapeHtml(telemetry.visitorName || 'Anonim Tashrif Buyuruvchi')}</b>${anonBadge}${roleText}

🌍 <b>Geolokatsiya & Tarmoq:</b>
  • <b>IP:</b> <code>${escapeHtml(telemetry.ip || 'Client Direct')}</code>
  • <b>Manzil:</b> ${escapeHtml(locationLine)}${placeDetails}${mapTextLine}${ispLine}${netLine}

📱 <b>Qurilma & Dasturiy Muhit:</b>
  • <b>Qurilma:</b> ${escapeHtml(telemetry.deviceType || '💻 Kompyuter')}
  • <b>OS:</b> ${escapeHtml(telemetry.os || 'Noma\'lum OS')}
  • <b>Brauzer:</b> ${escapeHtml(telemetry.browser || 'Noma\'lum Brauzer')}
  • <b>Ekran:</b> <code>${escapeHtml(telemetry.screenResolution || 'Noma\'lum')}</code> (Oyna: ${escapeHtml(
    telemetry.viewportSize || ''
  )})
  • <b>Uskuna:</b> ${escapeHtml(hwDetails || 'Standart')}${gpuLine}

🧭 <b>Tashrif Manbasi & Kontekst:</b>
  • <b>Qayerdan keldi:</b> ${escapeHtml(telemetry.referrerSource || 'To\'g\'ridan-to\'g\'ri')}
  • <b>Sayt Tili:</b> 🌐 ${(telemetry.siteLanguage || 'uz').toUpperCase()} (Brauzer: ${escapeHtml(
    telemetry.browserLanguage || 'uz-UZ'
  )})
  • <b>Timezone:</b> ⏱️ ${escapeHtml(telemetry.timezone || 'Asia/Tashkent')}${utmLine}
  • <b>Sahifa:</b> <code>${escapeHtml(telemetry.landingUrl || '/')}</code>
  • <b>Vaqt:</b> 🕒 ${telemetry.timestamp} (Toshkent / UTC+5)
━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ <i>Bekzod Idiyev Portfolio Telemetry Gateway</i>`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '🗺️ Yandex Xaritada Ko\'rish (Aniq)', url: yandexMapsDirectUrl },
        { text: '📍 Google Maps', url: googleMapsDirectUrl },
      ],
      [
        { text: '🍏 Apple Maps', url: appleMapsDirectUrl },
        {
          text: '🌐 Portfolioni Ochish',
          url: telemetry.landingUrl || 'https://bekzod-idiyev-portfolio.vercel.app',
        },
      ],
      [
        { text: '🐙 GitHub Profil', url: 'https://github.com/bekzodidiye' },
        { text: '💬 Telegram (@toyneden)', url: 'https://t.me/toyneden' },
      ],
    ],
  };

  return {
    text,
    inlineKeyboard,
    googleMapsDirectUrl,
    yandexMapsDirectUrl,
    appleMapsDirectUrl,
  };
}
