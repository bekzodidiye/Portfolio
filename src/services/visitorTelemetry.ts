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
  street?: string;
  isp?: string;
  latitude?: number;
  longitude?: number;
  locationAccuracy?: string;
  locationSource?: string;
  networkType?: string;
  networkSpeed?: string;
  rtt?: string;

  // Device & Hardware
  deviceType: '📱 Mobile' | '💻 Desktop' | '📟 Tablet';
  os: string;
  browser: string;
  screenResolution: string;
  viewportSize: string;
  pixelRatio: string;
  gpu?: string;
  battery?: string;
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
 * Parses userAgent into clean OS string with exact model info
 */
function parseOS(ua: string): string {
  if (/iphone/i.test(ua)) {
    const match = ua.match(/OS ([\d_]+)/);
    const ver = match ? match[1].replace(/_/g, '.') : '';
    return `Apple iPhone (iOS ${ver})`.trim();
  }
  if (/ipad/i.test(ua)) return 'Apple iPad (iPadOS)';
  if (/android/i.test(ua)) {
    const matchVer = ua.match(/Android ([\d.]+)/);
    const ver = matchVer ? `Android ${matchVer[1]}` : 'Android';
    const matchModel = ua.match(/;\s*([^;]+)\s+Build\//);
    const model = matchModel ? ` • ${matchModel[1]}` : '';
    return `${ver}${model}`.trim();
  }
  if (/macintosh|mac os x/i.test(ua)) {
    const match = ua.match(/Mac OS X ([\d_]+)/);
    const ver = match ? match[1].replace(/_/g, '.') : '';
    return `Apple Mac (macOS ${ver})`.trim();
  }
  if (/windows nt 10\.0/i.test(ua)) return 'Windows 10/11 (PC)';
  if (/windows nt 6\.3/i.test(ua)) return 'Windows 8.1';
  if (/windows nt 6\.1/i.test(ua)) return 'Windows 7';
  if (/linux/i.test(ua)) return 'Linux (x86_64)';
  return 'Unknown Device / OS';
}

/**
 * Parses userAgent into clean Browser string
 */
function parseBrowser(ua: string): string {
  if (/telegram/i.test(ua)) {
    return '✈️ Telegram In-App Browser';
  }
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
    return 'Opera Browser';
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

/**
 * Extracts WebGL GPU Renderer information
 */
function getGpuRenderer(): string | undefined {
  try {
    if (typeof document === 'undefined') return undefined;
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        return renderer ? String(renderer).replace(/ANGLE \((.*)\)/, '$1') : undefined;
      }
    }
  } catch {
    // ignore
  }
  return undefined;
}

/**
 * Reads battery level asynchronously if supported by browser
 */
async function getBatteryInfo(): Promise<string | undefined> {
  try {
    if (typeof navigator !== 'undefined' && (navigator as any).getBattery) {
      const battery = await (navigator as any).getBattery();
      const level = Math.round(battery.level * 100);
      const isCharging = battery.charging ? ' ⚡ (Quvvatlanmoqda)' : '';
      return `${level}%${isCharging}`;
    }
  } catch {
    // ignore
  }
  return undefined;
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
  // 1. Try ipapi.co (HTTPS, detailed GPS coordinates)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timer);

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.ip) {
        const flag = getCountryFlagEmoji(data.country_code);
        return {
          ip: data.ip,
          country: `${flag} ${data.country_name || data.country_code || 'Uzbekistan'}`,
          countryCode: data.country_code,
          city: data.city || undefined,
          region: data.region || undefined,
          isp: data.org || data.asn || undefined,
          latitude: typeof data.latitude === 'number' ? data.latitude : parseFloat(data.latitude) || undefined,
          longitude: typeof data.longitude === 'number' ? data.longitude : parseFloat(data.longitude) || undefined,
        };
      }
    }
  } catch {
    // Silent failover
  }

  // 2. Backup fast IP Geo provider: ipwho.is (HTTPS, free, high precision)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch('https://ipwho.is/', { signal: controller.signal }).catch(() => null);
    clearTimeout(timer);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.success !== false && data.ip) {
        const flag = getCountryFlagEmoji(data.country_code);
        return {
          ip: data.ip,
          country: `${flag} ${data.country || 'Uzbekistan'}`,
          countryCode: data.country_code,
          city: data.city || undefined,
          region: data.region || undefined,
          isp: data.connection?.isp || data.connection?.org || undefined,
          latitude: typeof data.latitude === 'number' ? data.latitude : parseFloat(data.latitude) || undefined,
          longitude: typeof data.longitude === 'number' ? data.longitude : parseFloat(data.longitude) || undefined,
        };
      }
    }
  } catch {
    // ignore
  }

  // 3. Ultra lightweight fallback: api.country.is
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
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
 * High-accuracy HTML5 GPS position lookup (satellite & Wi-Fi triangulation)
 */
export async function getExactGpsCoordinates(timeoutMs: number = 4000): Promise<{ latitude: number; longitude: number; accuracy: number } | null> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) return null;
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        });
      },
      () => {
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 10000,
      }
    );
  });
}

/**
 * Reverse Geocoding via OpenStreetMap (Coordinates -> Street, City, Region)
 */
export async function reverseGeocodeCoords(
  lat: number,
  lon: number
): Promise<{ city?: string; region?: string; country?: string; street?: string } | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'uz,ru,en',
        },
      }
    ).catch(() => null);
    clearTimeout(timer);

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.address) {
        const addr = data.address;
        const city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.county ||
          addr.state_district ||
          addr.municipality;
        const region = addr.state || addr.region;
        const street = [addr.road, addr.house_number].filter(Boolean).join(' ');
        return { city, region, country: addr.country, street };
      }
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Collect complete telemetry snapshot
 */
export async function collectVisitorTelemetry(
  visitorName?: string,
  visitorRole?: string,
  siteLanguage: string = 'uz',
  overrideGps?: { latitude: number; longitude: number; accuracy: number }
): Promise<VisitorTelemetryData> {
  let isAnon = !visitorName || visitorName.trim().length === 0 || visitorName === 'Anonim';
  let finalName = isAnon ? 'Anonim Tashrif Buyuruvchi' : visitorName!.trim();
  let finalRole = visitorRole;

  // 1. Check if opened inside Telegram Mini App (auto-extract exact Telegram profile!)
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user) {
    const tg = (window as any).Telegram.WebApp.initDataUnsafe.user;
    const tgFullName = [tg.first_name, tg.last_name].filter(Boolean).join(' ');
    const tgUsername = tg.username ? ` (@${tg.username})` : '';
    finalName = `✈️ ${tgFullName}${tgUsername} [ID: ${tg.id}]`;
    finalRole = 'Telegram Mini App Foydalanuvchisi';
    isAnon = false;
  }

  // 2. Check URL Query Parameters for explicit tracking (?user=... or ?hr=...)
  if (typeof window !== 'undefined' && window.location.search) {
    const urlParams = new URLSearchParams(window.location.search);
    const explicitUser = urlParams.get('user') || urlParams.get('name') || urlParams.get('hr') || urlParams.get('ref');
    if (explicitUser && isAnon) {
      finalName = `🎯 ${explicitUser.replace(/[_-]/g, ' ')}`;
      finalRole = 'Shaxsiy Havola Orqali (HR / Hamkor)';
      isAnon = false;
    }
  }

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
  const gpu = getGpuRenderer();

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
  const rtt = conn?.rtt ? `${conn.rtt}ms Ping` : undefined;

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

  // Parallel Async Geo, GPS & Battery lookup
  const [geoData, battery, exactGps] = await Promise.all([
    fetchClientGeoDetails(),
    getBatteryInfo(),
    overrideGps ? Promise.resolve(overrideGps) : getExactGpsCoordinates(3000),
  ]);

  let finalLat = geoData.latitude;
  let finalLon = geoData.longitude;
  let finalCity = geoData.city;
  let finalRegion = geoData.region;
  let finalStreet: string | undefined = undefined;
  let locationSource = '🌐 IP-manzil (Provayder tarmog\'i)';
  let locationAccuracy = 'Taxminiy (~5-15 km)';

  if (exactGps) {
    finalLat = exactGps.latitude;
    finalLon = exactGps.longitude;
    locationSource = '🛰️ Aniq GPS (Sun\'iy yo\'ldosh/Wi-Fi)';
    locationAccuracy = `±${exactGps.accuracy} metr (Haqiqiy GPS)`;

    // Reverse geocode to exact street and city
    const realAddress = await reverseGeocodeCoords(finalLat, finalLon);
    if (realAddress) {
      if (realAddress.city) finalCity = realAddress.city;
      if (realAddress.region) finalRegion = realAddress.region;
      if (realAddress.street) finalStreet = realAddress.street;
    }
  }

  return {
    visitorName: finalName,
    visitorRole: finalRole || undefined,
    isAnonymous: isAnon,
    ...geoData,
    city: finalCity,
    region: finalRegion,
    street: finalStreet,
    latitude: finalLat,
    longitude: finalLon,
    locationSource,
    locationAccuracy,
    networkType,
    networkSpeed,
    rtt,
    deviceType,
    os,
    browser,
    screenResolution: screenRes,
    viewportSize: viewport,
    pixelRatio: dpr,
    gpu,
    battery,
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
