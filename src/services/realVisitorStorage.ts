import { VisitorTelemetryData } from './visitorTelemetry';

export interface RealVisitorRecord {
  id: string;
  visitorName: string;
  visitorRole?: string;
  ip: string;
  country: string;
  city: string;
  region: string;
  isp?: string;
  latitude: number;
  longitude: number;
  deviceType: string;
  os: string;
  browser: string;
  timestamp: string;
  dateStr: string; // YYYY-MM-DD
}

export interface RealGeoPoint {
  city: string;
  country: string;
  lat: number;
  lng: number;
  visitors: number;
}

export interface RealAnalyticsSummary {
  totalVisitors: number;
  todayVisitors: number;
  mobilePercent: number;
  desktopPercent: number;
  topLocations: Array<{ city: string; country: string; visitors: number }>;
}

const STORAGE_KEY = 'bekzod_portfolio_real_visitor_logs_v1';
const MAX_STORED_LOGS = 200;

import {
  maskIp,
  encodeStoragePayload,
  decodeStoragePayload,
  getCityCoordinates,
} from './visitorStorageCodec';

export function getRealVisitorRecords(): RealVisitorRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = decodeStoragePayload(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRealVisitorRecord(telemetry: VisitorTelemetryData): RealVisitorRecord {
  const currentLogs = getRealVisitorRecords();

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateFormatted = new Intl.DateTimeFormat('uz-UZ', {
    timeZone: 'Asia/Samarkand',
    month: 'short',
    day: 'numeric',
  }).format(now);

  const { lat, lng } = getCityCoordinates(telemetry.city, telemetry.country);

  const randomSuffix =
    typeof window !== 'undefined' && window.crypto?.randomUUID
      ? window.crypto.randomUUID().slice(0, 8)
      : Math.abs(Date.now() % 100000).toString(36);

  const record: RealVisitorRecord = {
    id: `real-${Date.now()}-${randomSuffix}`,
    visitorName: telemetry.visitorName || 'Mehmon (Portfolioga Tashrif)',
    visitorRole: telemetry.visitorRole,
    ip: maskIp(telemetry.ip),
    country: telemetry.country || "O'zbekiston",
    city: telemetry.city || 'Toshkent',
    region: telemetry.region || telemetry.city || 'Toshkent',
    isp: telemetry.isp || 'Uztelecom / Mobil Internet',
    latitude: lat,
    longitude: lng,
    deviceType: telemetry.deviceType || '💻 Desktop',
    os: telemetry.os || 'Linux / Windows / macOS',
    browser: telemetry.browser || 'Google Chrome',
    timestamp: `${dateFormatted}, ${timeFormatted}`,
    dateStr,
  };

  // Avoid duplicate log if same IP & user within last 5 minutes
  const isDuplicate = currentLogs.some(
    (l) => l.ip === record.ip && l.dateStr === record.dateStr && Math.abs(Date.now() - parseInt(l.id.split('-')[1] || '0')) < 300000
  );

  let updatedLogs = currentLogs;
  if (!isDuplicate) {
    updatedLogs = [record, ...currentLogs].slice(0, MAX_STORED_LOGS);
    try {
      localStorage.setItem(STORAGE_KEY, encodeStoragePayload(updatedLogs));
    } catch {
      // ignore
    }
  }

  return record;
}

/**
 * Aggregates real visitor records into unique Geo Points for the 3D globe
 */
export function getRealGeoPoints(): RealGeoPoint[] {
  const records = getRealVisitorRecords();
  if (records.length === 0) {
    return [];
  }

  const map = new Map<string, RealGeoPoint>();

  records.forEach((rec) => {
    const key = `${rec.city.toLowerCase()}_${rec.country.toLowerCase()}`;
    const existing = map.get(key);
    if (existing) {
      existing.visitors += 1;
    } else {
      map.set(key, {
        city: rec.city,
        country: rec.country,
        lat: rec.latitude,
        lng: rec.longitude,
        visitors: 1,
      });
    }
  });

  return Array.from(map.values()).sort((a, b) => b.visitors - a.visitors);
}

/**
 * Calculates 100% real summary statistics from actual saved records
 */
export function getRealAnalyticsSummary(): RealAnalyticsSummary {
  const records = getRealVisitorRecords();
  const todayStr = new Date().toISOString().split('T')[0];

  if (records.length === 0) {
    return {
      totalVisitors: 0,
      todayVisitors: 0,
      mobilePercent: 0,
      desktopPercent: 0,
      topLocations: [],
    };
  }

  const totalVisitors = records.length;
  const todayVisitors = records.filter((r) => r.dateStr === todayStr).length;

  let mobileCount = 0;
  records.forEach((r) => {
    if (
      r.deviceType?.toLowerCase().includes('mobile') ||
      r.os?.toLowerCase().includes('ios') ||
      r.os?.toLowerCase().includes('android')
    ) {
      mobileCount += 1;
    }
  });

  const mobilePercent = totalVisitors > 0 ? Math.round((mobileCount / totalVisitors) * 100) : 0;
  const desktopPercent = totalVisitors > 0 ? 100 - mobilePercent : 0;

  const topLocations = getRealGeoPoints();

  return {
    totalVisitors,
    todayVisitors,
    mobilePercent,
    desktopPercent,
    topLocations,
  };
}

export { fetchRealVisitorStatsFromPostgres } from './postgresVisitorService';
export type { PostgresVisitorStats } from './postgresVisitorService';

export function clearRealVisitorRecords(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
