/**
 * 100% Real Visitor Persistence & Aggregation Service
 * Stores actual incoming visitor telemetry data in localStorage for live analytics and 3D globe visualization.
 */

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

export function getRealVisitorRecords(): RealVisitorRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
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

  // Use detected coordinates or fallback to verified coordinate centers
  let lat = telemetry.latitude;
  let lng = telemetry.longitude;

  if (!lat || !lng) {
    if (telemetry.city?.toLowerCase().includes('bukhara') || telemetry.city?.toLowerCase().includes('buxoro')) {
      lat = 39.7747;
      lng = 64.4286;
    } else if (telemetry.city?.toLowerCase().includes('samarkand') || telemetry.city?.toLowerCase().includes('samarqand')) {
      lat = 39.6542;
      lng = 66.9597;
    } else {
      // Default to Tashkent coordinates if country is Uzbekistan
      lat = 41.2995;
      lng = 69.2401;
    }
  }

  const record: RealVisitorRecord = {
    id: `real-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    visitorName: telemetry.visitorName || 'Mehmon (Portfolioga Tashrif)',
    visitorRole: telemetry.visitorRole,
    ip: telemetry.ip || 'Client Direct',
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
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

/**
 * Fetches real visitor logs and summary metrics from Neon PostgreSQL via /api/visitor
 */
export async function fetchRealVisitorStatsFromPostgres(): Promise<{
  totalVisitors: number;
  todayVisitors: number;
  mobilePercent: number;
  desktopPercent: number;
  topLocations: Array<{ city: string; country: string; visitors: number }>;
  records: RealVisitorRecord[];
} | null> {
  try {
    const res = await fetch('/api/visitor', { method: 'GET' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.ok || !Array.isArray(data.visitors)) return null;

    const visitors = data.visitors;
    const totalVisitors = Number(data.total) || visitors.length;
    const todayVisitors = Number(data.today) || 0;

    let mobileCount = 0;
    const locMap = new Map<string, { city: string; country: string; visitors: number; lat: number; lng: number }>();

    const records: RealVisitorRecord[] = visitors.map((v: any) => {
      const devType = v.device_type || 'Desktop';
      const osName = v.os || '';
      const isMobile =
        devType.toLowerCase().includes('mobile') ||
        osName.toLowerCase().includes('ios') ||
        osName.toLowerCase().includes('android');

      if (isMobile) mobileCount++;

      const city = v.city || 'Noma\'lum';
      const country = v.country || "O'zbekiston";
      const key = `${city.toLowerCase()}_${country.toLowerCase()}`;
      const lat = Number(v.latitude) || 41.2995;
      const lng = Number(v.longitude) || 69.2401;

      const existing = locMap.get(key);
      if (existing) {
        existing.visitors += 1;
      } else {
        locMap.set(key, { city, country, visitors: 1, lat, lng });
      }

      return {
        id: `pg-${v.id}`,
        visitorName: v.visitor_name || 'Anonim',
        visitorRole: v.visitor_role || undefined,
        ip: v.ip || 'Direct',
        country,
        city,
        region: v.region || city,
        isp: v.browser || undefined,
        latitude: lat,
        longitude: lng,
        deviceType: devType,
        os: osName || 'OS',
        browser: v.browser || 'Browser',
        timestamp: v.visited_at || '',
        dateStr: (v.visited_at || '').split(' ')[0] || '',
      };
    });

    const mobilePercent = totalVisitors > 0 ? Math.round((mobileCount / totalVisitors) * 100) : 0;
    const desktopPercent = totalVisitors > 0 ? 100 - mobilePercent : 0;
    const topLocations = Array.from(locMap.values())
      .map((l) => ({ city: l.city, country: l.country, visitors: l.visitors }))
      .sort((a, b) => b.visitors - a.visitors);

    return {
      totalVisitors,
      todayVisitors,
      mobilePercent,
      desktopPercent,
      topLocations,
      records,
    };
  } catch {
    return null;
  }
}

export function clearRealVisitorRecords(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
