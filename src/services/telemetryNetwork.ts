/**
 * Network details, connection speeds, referrer categorization, and navigation context
 */

export function categorizeReferrer(ref: string): string {
  if (!ref || ref.trim() === '') return '🔗 To\'g\'ridan-to\'g\'ri (Direct URL / Bookmark)';
  const lower = ref.toLowerCase();
  if (lower.includes('t.me') || lower.includes('telegram')) return '✈️ Telegram (@toyneden / Channel / Chat)';
  if (lower.includes('linkedin.com')) return '💼 LinkedIn (HR / Recruiter)';
  if (lower.includes('github.com')) return '🐙 GitHub Profile / Repo';
  if (lower.includes('google.com') || lower.includes('google.')) return '🔍 Google Qidiruv';
  if (lower.includes('instagram.com')) return '📸 Instagram';
  if (lower.includes('twitter.com') || lower.includes('x.com')) return '🐦 X (Twitter)';
  if (lower.includes('yandex.')) return '🔎 Yandex';
  if (lower.includes('kwork.ru') || lower.includes('kwork.com')) return '💼 Kwork Freelance';
  return `🌐 ${ref.replace(/^https?:\/\//, '').split('/')[0]}`;
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
