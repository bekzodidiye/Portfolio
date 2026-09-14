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

import type { IncomingMessage, ServerResponse } from 'http';

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  clientName?: string;
}

export interface ApiRequest extends IncomingMessage {
  body?: any;
  query?: Record<string, string | string[]>;
  cookies?: Record<string, string>;
  socket: any;
}

export interface ApiResponse extends ServerResponse {
  status(code: number): this;
  json(data: any): this;
  send(data: any): this;
}
