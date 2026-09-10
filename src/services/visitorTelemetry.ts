/**
 * Comprehensive Visitor Telemetry Collector Orchestrator
 * Clean Single Responsibility Principle: coordinates Hardware, Geo, and Network modules.
 */

import { detectHardwareSpecs, getBatteryInfo } from './telemetryHardware';
import {
  fetchClientGeoDetails,
  getCountryFlagEmoji,
  getExactGpsCoordinates,
  reverseGeocodeCoords,
} from './telemetryGeo';
import { detectNetworkSpecs } from './telemetryNetwork';

export { getCountryFlagEmoji, getExactGpsCoordinates, reverseGeocodeCoords };

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
  placeName?: string;
  placeCategory?: string;
  wifiSsid?: string;
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
    const explicitUser =
      urlParams.get('user') || urlParams.get('name') || urlParams.get('hr') || urlParams.get('ref');
    if (explicitUser && isAnon) {
      finalName = `🎯 ${explicitUser.replace(/[_-]/g, ' ')}`;
      finalRole = 'Shaxsiy Havola Orqali (HR / Hamkor)';
      isAnon = false;
    }
  }

  // 3. Detect hardware and network specs synchronously
  const hardware = detectHardwareSpecs();
  const network = detectNetworkSpecs();

  // 4. Parallel Async: Geo (IP) + Battery + GPS (browser native — most accurate)
  const [geoData, battery, exactGps] = await Promise.all([
    fetchClientGeoDetails(),
    getBatteryInfo(),
    overrideGps
      ? Promise.resolve(overrideGps)
      : getExactGpsCoordinates(5000).catch(() => null),
  ]);

  let finalLat = geoData.latitude;
  let finalLon = geoData.longitude;
  let finalCity = geoData.city;
  let finalRegion = geoData.region;
  let finalStreet: string | undefined = undefined;
  let locationSource = geoData.locationSource || '🌐 IP-manzil (Provayder tarmog\'i)';
  let locationAccuracy = geoData.locationAccuracy || 'Taxminiy (~5-15 km)';

  if (exactGps) {
    finalLat = exactGps.latitude;
    finalLon = exactGps.longitude;
    locationSource = '🛰️ Aniq GPS (Sun\'iy yo\'ldosh/Wi-Fi)';
    locationAccuracy = `±${exactGps.accuracy} metr (Haqiqiy GPS)`;

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
    ...hardware,
    battery,
    ...network,
    siteLanguage,
  };
}
