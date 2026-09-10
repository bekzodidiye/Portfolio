import { RealVisitorRecord } from './realVisitorStorage';

export function maskIp(rawIp?: string): string {
  if (!rawIp || rawIp === 'Client Direct' || rawIp === 'Direct' || rawIp === 'Unknown') {
    return 'Protected Client';
  }
  const parts = rawIp.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***`;
  }
  if (rawIp.includes(':')) {
    const v6 = rawIp.split(':');
    return `${v6.slice(0, 2).join(':')}:****:****`;
  }
  return 'Protected IP';
}

export function encodeStoragePayload(logs: RealVisitorRecord[]): string {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(logs))));
  } catch {
    return JSON.stringify(logs);
  }
}

export function decodeStoragePayload(raw: string): RealVisitorRecord[] {
  try {
    if (raw.startsWith('[') || raw.startsWith('{')) {
      return JSON.parse(raw);
    }
    const decoded = decodeURIComponent(escape(atob(raw)));
    return JSON.parse(decoded);
  } catch {
    return [];
  }
}

/**
 * Returns safe, generalized geographic center coordinates based solely on city/country names.
 * Avoids storing precise user GPS/device coordinates into client-side storage (CWE-312 / CWE-359).
 */
export function getCityCoordinates(city?: string, country?: string): { lat: number; lng: number } {
  const cityLower = (city || '').toLowerCase();
  const countryLower = (country || '').toLowerCase();

  if (cityLower.includes('buxoro') || cityLower.includes('bukhara')) {
    return { lat: 39.7747, lng: 64.4286 };
  }
  if (cityLower.includes('samarqand') || cityLower.includes('samarkand')) {
    return { lat: 39.6542, lng: 66.9597 };
  }
  if (cityLower.includes('andijon') || cityLower.includes('andijan')) {
    return { lat: 40.7821, lng: 72.3442 };
  }
  if (cityLower.includes('namangan')) {
    return { lat: 40.9983, lng: 71.6726 };
  }
  if (cityLower.includes('farg') || cityLower.includes('fergana')) {
    return { lat: 40.3842, lng: 71.7843 };
  }
  if (cityLower.includes('urganch') || cityLower.includes('urgench') || cityLower.includes('khiva')) {
    return { lat: 41.5562, lng: 60.6317 };
  }
  if (cityLower.includes('nukus')) {
    return { lat: 42.4602, lng: 59.6166 };
  }
  if (cityLower.includes('navoiy') || cityLower.includes('navoi')) {
    return { lat: 40.0844, lng: 65.3792 };
  }
  if (cityLower.includes('qarshi') || cityLower.includes('karshi') || cityLower.includes('qashqadaryo')) {
    return { lat: 38.8606, lng: 65.7891 };
  }
  if (cityLower.includes('termiz') || cityLower.includes('termez')) {
    return { lat: 37.2242, lng: 67.2783 };
  }
  if (cityLower.includes('jizzax') || cityLower.includes('jizzakh')) {
    return { lat: 40.1158, lng: 67.8422 };
  }
  if (cityLower.includes('guliston') || cityLower.includes('sirdaryo')) {
    return { lat: 40.4897, lng: 68.7842 };
  }
  if (countryLower.includes('russia') || cityLower.includes('moscow') || cityLower.includes('moskva')) {
    return { lat: 55.7558, lng: 37.6173 };
  }
  if (countryLower.includes('kingdom') || cityLower.includes('london')) {
    return { lat: 51.5074, lng: -0.1278 };
  }
  if (countryLower.includes('united states') || cityLower.includes('new york')) {
    return { lat: 40.7128, lng: -74.006 };
  }

  // Default: Tashkent center
  return { lat: 41.2995, lng: 69.2401 };
}
