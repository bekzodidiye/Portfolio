/**
 * Network details, connection speeds, referrer categorization, and navigation context
 */

export function categorizeReferrer(ref: string): string {
  if (!ref || ref.trim() === '') return "🔗 To'g'ridan-to'g'ri (Direct URL / Bookmark)";

  try {
    const urlObj = new URL(ref.startsWith('http') ? ref : `https://${ref}`);
    const host = urlObj.hostname.toLowerCase();

    if (
      host === 't.me' ||
      host.endsWith('.t.me') ||
      host === 'telegram.me' ||
      host.endsWith('.telegram.me') ||
      host === 'telegram.org' ||
      host.endsWith('.telegram.org')
    ) {
      return '✈️ Telegram (@toyneden / Channel / Chat)';
    }
    if (host === 'linkedin.com' || host.endsWith('.linkedin.com')) {
      return '💼 LinkedIn (HR / Recruiter)';
    }
    if (host === 'github.com' || host.endsWith('.github.com')) {
      return '🐙 GitHub Profile / Repo';
    }
    if (
      host === 'google.com' ||
      host.endsWith('.google.com') ||
      host === 'google.uz' ||
      host.endsWith('.google.uz') ||
      host === 'google.ru' ||
      host.endsWith('.google.ru')
    ) {
      return '🔍 Google Qidiruv';
    }
    if (host === 'instagram.com' || host.endsWith('.instagram.com')) {
      return '📸 Instagram';
    }
    if (
      host === 'x.com' ||
      host.endsWith('.x.com') ||
      host === 'twitter.com' ||
      host.endsWith('.twitter.com')
    ) {
      return '🐦 X (Twitter)';
    }
    if (
      host === 'yandex.ru' ||
      host.endsWith('.yandex.ru') ||
      host === 'yandex.uz' ||
      host.endsWith('.yandex.uz') ||
      host === 'yandex.com' ||
      host.endsWith('.yandex.com')
    ) {
      return '🔎 Yandex';
    }
    if (
      host === 'kwork.ru' ||
      host.endsWith('.kwork.ru') ||
      host === 'kwork.com' ||
      host.endsWith('.kwork.com')
    ) {
      return '💼 Kwork Freelance';
    }
    return `🌐 ${host}`;
  } catch {
    return '🔗 Havola orqali (Referrer)';
  }
}

export interface NetworkSpecs {
  networkType?: string;
  networkSpeed?: string;
  rtt?: string;
  referrer: string;
  referrerSource: string;
  landingUrl: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  browserLanguage: string;
  timezone: string;
  timestamp: string;
}

export function detectNetworkSpecs(): NetworkSpecs {
  const nav = typeof navigator !== 'undefined' ? (navigator as any) : {};
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  const networkType = conn?.effectiveType ? conn.effectiveType.toUpperCase() : undefined;
  const networkSpeed = conn?.downlink ? `${conn.downlink} Mbps` : undefined;
  const rtt = conn?.rtt ? `${conn.rtt}ms Ping` : undefined;

  const rawReferrer = typeof document !== 'undefined' ? document.referrer : '';
  const referrerSource = categorizeReferrer(rawReferrer);
  const landingUrl = typeof window !== 'undefined' ? window.location.href : '';

  let utmSource: string | undefined;
  let utmMedium: string | undefined;
  let utmCampaign: string | undefined;

  if (typeof window !== 'undefined' && window.location.search) {
    const urlParams = new URLSearchParams(window.location.search);
    utmSource = urlParams.get('utm_source') || urlParams.get('ref') || undefined;
    utmMedium = urlParams.get('utm_medium') || undefined;
    utmCampaign = urlParams.get('utm_campaign') || undefined;
  }

  const browserLanguage = typeof navigator !== 'undefined' ? navigator.language : 'uz-UZ';
  const timezone =
    typeof Intl !== 'undefined' && Intl.DateTimeFormat
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'Asia/Tashkent';

  const timestamp = new Intl.DateTimeFormat('uz-UZ', {
    timeZone: 'Asia/Samarkand',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());

  return {
    networkType,
    networkSpeed,
    rtt,
    referrer: rawReferrer,
    referrerSource,
    landingUrl,
    utmSource,
    utmMedium,
    utmCampaign,
    browserLanguage,
    timezone,
    timestamp,
  };
}
