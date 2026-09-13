export interface BotUser {
  userId: number | string;
  username?: string;
  fullName: string;
  language?: string;
}

export interface VisitorStats {
  totalVisits: number;
  todayVisits: number;
  uniqueIps: number;
  topCities: Array<{ city: string; count: number }>;
  deviceStats: { mobile: number; desktop: number };
}

export interface BotStats {
  totalUsers: number;
  totalMessages: number;
}

export interface GeoAndReferrerStats {
  total: number;
  countries: Array<{ country: string; count: number }>;
  referrers: Array<{ referrer: string; count: number }>;
}

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  clientName?: string;
}
