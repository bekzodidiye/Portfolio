/**
 * Comprehensive Visitor Telemetry Collector
 * Collects deep system, hardware, network, browser, location, and navigation context.
 */

export interface VisitorTelemetryData {
  visitorName: string;
  visitorRole?: string;
  isAnonymous?: boolean;
  
  // Geolocation & Network
  ip?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  region?: string;
  isp?: string;
  networkType?: string;
  networkSpeed?: string;
  rtt?: string;

  // Device & OS
  deviceType: '📱 Mobile' | '💻 Desktop' | '📟 Tablet';
  os: string;
  browser: string;
  screenResolution: string;
  viewportSize: string;
  pixelRatio: string;
  cpuCores?: string;
  deviceMemory?: string;
  touchSupport: boolean;
  colorScheme: 'Dark' | 'Light';

  // Navigation & Origin
  referrer: string;
  referrerSource: string;
  landingUrl: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  siteLanguage: string;
  browserLanguage: string;
  timezone: string;
  timestamp: string;
}

/**
 * Parses userAgent into clean OS string
 */
function parseOS(ua: string): string {
  if (/windows nt 10\.0/i.test(ua)) return 'Windows 10/11';
  if (/windows nt 6\.3/i.test(ua)) return 'Windows 8.1';
  if (/windows nt 6\.1/i.test(ua)) return 'Windows 7';
  if (/macintosh|mac os x/i.test(ua)) {
    const match = ua.match(/Mac OS X ([\d_]+)/);
    const ver = match ? match[1].replace(/_/g, '.') : '';
    return `macOS ${ver}`.trim();
  }
  if (/iphone/i.test(ua)) {
    const match = ua.match(/OS ([\d_]+)/);
    const ver = match ? match[1].replace(/_/g, '.') : '';
    return `iOS (iPhone) ${ver}`.trim();
  }
  if (/ipad/i.test(ua)) return 'iPadOS';
  if (/android/i.test(ua)) {
    const match = ua.match(/Android ([\d.]+)/);
    const ver = match ? match[1] : '';
    return `Android ${ver}`.trim();
  }
  if (/linux/i.test(ua)) return 'Linux';
  return 'Unknown OS';
}

/**
 * Parses userAgent into clean Browser string
 */
function parseBrowser(ua: string): string {
  if (/edg\//i.test(ua)) {
    const match = ua.match(/Edg\/([\d.]+)/);
    return `Microsoft Edge ${match ? match[1].split('.')[0] : ''}`;
  }
  if (/chrome|crios/i.test(ua) && !/opr|opera/i.test(ua)) {
    const match = ua.match(/(?:Chrome|CriOS)\/([\d.]+)/);
    return `Google Chrome ${match ? match[1].split('.')[0] : ''}`;
  }
  if (/firefox|fxios/i.test(ua)) {
    const match = ua.match(/(?:Firefox|FxiOS)\/([\d.]+)/);
    return `Mozilla Firefox ${match ? match[1].split('.')[0] : ''}`;
  }
  if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) {
    const match = ua.match(/Version\/([\d.]+)/);
    return `Apple Safari ${match ? match[1].split('.')[0] : ''}`;
  }
  if (/opr|opera/i.test(ua)) {
    return 'Opera';
  }
  if (/samsungbrowser/i.test(ua)) {
    return 'Samsung Internet';
  }
  return 'Web Browser';
}

/**
 * Categorizes referrer for instant recognition
 */
function categorizeReferrer(ref: string): string {
  if (!ref || ref.trim() === '') return '🔗 To\'g\'ridan-to\'g\'ri (Direct URL)';
  const lower = ref.toLowerCase();
  if (lower.includes('t.me') || lower.includes('telegram')) return '✈️ Telegram (@toyneden / Channel / Chat)';
  if (lower.includes('linkedin.com')) return '💼 LinkedIn';
  if (lower.includes('github.com')) return '🐙 GitHub Profile / Repo';
  if (lower.includes('google.com') || lower.includes('google.')) return '🔍 Google Search';
  if (lower.includes('instagram.com')) return '📸 Instagram';
  if (lower.includes('twitter.com') || lower.includes('x.com')) return '🐦 X (Twitter)';
  if (lower.includes('yandex.')) return '🔎 Yandex';
  if (lower.includes('kwork.ru') || lower.includes('kwork.com')) return '💼 Kwork Freelance';
  return `🌐 ${ref.replace(/^https?:\/\//, '').split('/')[0]}`;
}

/**
 * Get country flag emoji from ISO country code
 */
export function getCountryFlagEmoji(countryCode?: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Fast Geo & IP Lookup with 2.5s strict timeout
 */
async function fetchClientGeoDetails(): Promise<Partial<VisitorTelemetryData>> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);

    // Free fast IP Geolocation API with HTTPS
    const res = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timer);

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data) {
        const flag = getCountryFlagEmoji(data.country_code);
        return {
          ip: data.ip,
          country: `${flag} ${data.country_name || data.country_code || 'Unknown'}`,
          countryCode: data.country_code,
          city: data.city || undefined,
          region: data.region || undefined,
          isp: data.org || data.asn || undefined,
        };
      }
    }
  } catch {
    // Silent failover to serverless IP detection
  }

  // Backup lightweight lookup
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch('https://api.country.is/', { signal: controller.signal }).catch(() => null);
    clearTimeout(timer);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.country) {
        const flag = getCountryFlagEmoji(data.country);
        return {
          ip: data.ip,
          country: `${flag} ${data.country}`,
          countryCode: data.country,
        };
      }
    }
  } catch {
    // ignore
  }

  return {};
}

/**
 * Collect complete telemetry snapshot
 */
export async function collectVisitorTelemetry(
  visitorName: string,
  visitorRole?: string,
  siteLanguage: string = 'uz'
): Promise<VisitorTelemetryData> {
  const isAnon = !visitorName || visitorName.trim().length === 0 || visitorName === 'Anonim';
  const finalName = isAnon ? 'Anonim Tashrif Buyuruvchi' : visitorName.trim();

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isMobile = /iphone|ipod|android.*mobile|windows phone/i.test(ua);
  const isTablet = /ipad|android(?!.*mobile)/i.test(ua);
  const deviceType: '📱 Mobile' | '💻 Desktop' | '📟 Tablet' = isMobile
    ? '📱 Mobile'
    : isTablet
    ? '📟 Tablet'
    : '💻 Desktop';

  const os = parseOS(ua);
  const browser = parseBrowser(ua);

  const screenRes =
    typeof window !== 'undefined' && window.screen
      ? `${window.screen.width}x${window.screen.height}`
      : 'Unknown';

  const viewport =
    typeof window !== 'undefined'
      ? `${window.innerWidth}x${window.innerHeight}`
      : 'Unknown';

  const dpr =
    typeof window !== 'undefined' && window.devicePixelRatio
      ? `${window.devicePixelRatio.toFixed(1)}x`
      : '1.0x';

  const nav = typeof navigator !== 'undefined' ? (navigator as any) : {};
  const cpuCores = nav.hardwareConcurrency ? `${nav.hardwareConcurrency} yadroli CPU` : undefined;
  const deviceMemory = nav.deviceMemory ? `${nav.deviceMemory}+ GB RAM` : undefined;
  const touchSupport =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0));

  const colorScheme: 'Dark' | 'Light' =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'Dark'
      : 'Light';

  // Network info
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  const networkType = conn?.effectiveType ? conn.effectiveType.toUpperCase() : undefined;
  const networkSpeed = conn?.downlink ? `${conn.downlink} Mbps` : undefined;
  const rtt = conn?.rtt ? `${conn.rtt}ms RTT` : undefined;

  // Navigation & Origin
  const rawReferrer = typeof document !== 'undefined' ? document.referrer : '';
  const referrerSource = categorizeReferrer(rawReferrer);
  const landingUrl = typeof window !== 'undefined' ? window.location.href : '';

  // UTM tags
  let utmSource: string | undefined;
  let utmMedium: string | undefined;
  let utmCampaign: string | undefined;

  if (typeof window !== 'undefined' && window.location.search) {
    const urlParams = new URLSearchParams(window.location.search);
    utmSource = urlParams.get('utm_source') || urlParams.get('ref') || undefined;
    utmMedium = urlParams.get('utm_medium') || undefined;
    utmCampaign = urlParams.get('utm_campaign') || undefined;
  }

  const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'uz-UZ';
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

  // Fetch client Geo (async with short timeout)
  const geoData = await fetchClientGeoDetails();

  return {
    visitorName: finalName,
    visitorRole: visitorRole || undefined,
    isAnonymous: isAnon,
    ...geoData,
    networkType,
    networkSpeed,
    rtt,
    deviceType,
    os,
    browser,
    screenResolution: screenRes,
    viewportSize: viewport,
    pixelRatio: dpr,
    cpuCores,
    deviceMemory,
    touchSupport,
    colorScheme,
    referrer: rawReferrer,
    referrerSource,
    landingUrl,
    utmSource,
    utmMedium,
    utmCampaign,
    siteLanguage,
    browserLanguage: browserLang,
    timezone,
    timestamp,
  };
}
