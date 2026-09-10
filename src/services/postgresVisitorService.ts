import { RealVisitorRecord } from './realVisitorStorage';

export interface PostgresVisitorStats {
  totalVisitors: number;
  todayVisitors: number;
  mobilePercent: number;
  desktopPercent: number;
  topLocations: Array<{ city: string; country: string; visitors: number }>;
  records: RealVisitorRecord[];
}

/**
 * Fetches real visitor logs and summary metrics from Neon PostgreSQL via /api/visitor
 */
export async function fetchRealVisitorStatsFromPostgres(): Promise<PostgresVisitorStats | null> {
  try {
    const res = await fetch('/api/visitor', { method: 'GET' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.ok || !Array.isArray(data.visitors)) return null;

    const visitors = data.visitors;
    const totalVisitors = Number(data.total) || visitors.length;
    const todayVisitors = Number(data.today) || 0;

    let mobileCount = 0;
    const locMap = new Map<
      string,
      { city: string; country: string; visitors: number; lat: number; lng: number }
    >();

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
