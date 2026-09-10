/**
 * Geolocation Providers, Multi-Source Consensus, GPS, and Reverse Geocoding
 */

export interface GeoDetails {
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
}

export function getCountryFlagEmoji(countryCode?: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const GEO_PROVIDERS: Array<(signal: AbortSignal) => Promise<GeoDetails | null>> = [
  async (signal) => {
    try {
      const res = await fetch('https://ipinfo.io/json', { signal });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data?.ip || data.bogon) return null;
      const [lat, lon] = (data.loc || '').split(',').map(Number);
      const placeName = data.place?.name || data.venue?.name;
      const placeCategory = data.place?.category || data.venue?.category;
      const wifiSsid = data.place?.wifi?.ssid || data.wifi?.ssid || data.place?.wifi_network;
      return {
        ip: data.ip,
        country: `${getCountryFlagEmoji(data.country)} ${data.country === 'UZ' ? "O'zbekiston" : data.country || 'Uzbekistan'}`,
        countryCode: data.country,
        city: data.city,
        region: data.region,
        isp: data.org,
        placeName,
        placeCategory,
        wifiSsid,
        latitude: Number.isFinite(lat) ? lat : undefined,
        longitude: Number.isFinite(lon) ? lon : undefined,
        locationSource: placeName ? `🏢 IPinfo Places (${placeName})` : '🌐 ipinfo.io (BGP/Regional)',
        locationAccuracy: placeName ? 'Bino darajasida (Places)' : 'Shahar / Viloyat darajasida',
      };
    } catch {
      return null;
    }
  },
  async (signal) => {
    try {
      const res = await fetch('https://freeipapi.com/api/json', { signal });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data?.ipAddress) return null;
      return {
        ip: data.ipAddress,
        country: `${getCountryFlagEmoji(data.countryCode)} ${data.countryName || 'Uzbekistan'}`,
        countryCode: data.countryCode,
        city: data.cityName,
        region: data.regionName,
        isp: data.asnOrganization || data.asn,
        latitude: typeof data.latitude === 'number' ? data.latitude : undefined,
        longitude: typeof data.longitude === 'number' ? data.longitude : undefined,
        locationSource: '🌐 freeipapi.com (Regional)',
        locationAccuracy: 'Shahar / Viloyat darajasida',
      };
    } catch {
      return null;
    }
  },
  async (signal) => {
    try {
      const res = await fetch('https://ipwho.is/', { signal });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data?.success || !data.ip) return null;
      return {
        ip: data.ip,
        country: `${getCountryFlagEmoji(data.country_code)} ${data.country || 'Uzbekistan'}`,
        countryCode: data.country_code,
        city: data.city,
        region: data.region,
        isp: data.connection?.isp || data.connection?.org,
        latitude: typeof data.latitude === 'number' ? data.latitude : undefined,
        longitude: typeof data.longitude === 'number' ? data.longitude : undefined,
        locationSource: '🌐 ipwho.is (GeoISP)',
        locationAccuracy: 'Shahar / Viloyat darajasida',
      };
    } catch {
      return null;
    }
  },
  async (signal) => {
    try {
      const res = await fetch('https://ipapi.co/json/', { signal });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data?.ip || data.error) return null;
      return {
        ip: data.ip,
        country: `${getCountryFlagEmoji(data.country_code)} ${data.country_name || 'Uzbekistan'}`,
        countryCode: data.country_code,
        city: data.city,
        region: data.region,
        isp: data.org,
        latitude: typeof data.latitude === 'number' ? data.latitude : undefined,
        longitude: typeof data.longitude === 'number' ? data.longitude : undefined,
        locationSource: '🌐 ipapi.co',
        locationAccuracy: 'Shahar / Viloyat darajasida',
      };
    } catch {
      return null;
    }
  },
];

export async function fetchClientGeoDetails(): Promise<GeoDetails> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const results = await Promise.all(GEO_PROVIDERS.map((fn) => fn(controller.signal)));
    clearTimeout(timeoutId);

    const validResults = results.filter((r): r is GeoDetails => Boolean(r && r.ip));
    if (validResults.length === 0) return {};

    const scored = validResults.map((item) => {
      let score = 0;
      if (item.placeName) score += 6;
      if (item.city?.trim()) score += 4;
      if (item.region?.trim()) score += 3;
      if (item.isp?.trim()) score += 2;
      if (typeof item.latitude === 'number') score += 2;
      if (item.region && !item.region.toLowerCase().includes('tashkent')) score += 3;
      return { item, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const best = { ...scored[0].item };

    for (const candidate of validResults) {
      if (!best.placeName && candidate.placeName) best.placeName = candidate.placeName;
      if (!best.placeCategory && candidate.placeCategory) best.placeCategory = candidate.placeCategory;
      if (!best.wifiSsid && candidate.wifiSsid) best.wifiSsid = candidate.wifiSsid;
      if (!best.city && candidate.city) best.city = candidate.city;
      if (!best.region && candidate.region) best.region = candidate.region;
      if (!best.isp && candidate.isp) best.isp = candidate.isp;
      if (!best.latitude && candidate.latitude) best.latitude = candidate.latitude;
      if (!best.longitude && candidate.longitude) best.longitude = candidate.longitude;
    }

    if (best.placeName) {
      best.locationSource = `🏢 IPinfo Places (${best.placeName})`;
      best.locationAccuracy = 'Bino darajasida (Places)';
    } else {
      best.locationSource = `🌐 Multi-Source Konsensus (${scored[0].item.locationSource || 'IP'})`;
    }
    return best;
  } catch {
    return {};
  }
}

export { getExactGpsCoordinates, reverseGeocodeCoords } from './telemetryGps';
