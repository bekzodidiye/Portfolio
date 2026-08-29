import fs from 'fs';
import path from 'path';

const STATS_FILE = '/tmp/portfolio_bot_stats.json';

export interface VisitorLog {
  name: string;
  role?: string;
  ip?: string;
  country?: string;
  city?: string;
  deviceType?: string;
  os?: string;
  browser?: string;
  referrerSource?: string;
  timestamp: string;
}

export interface ContactLog {
  name: string;
  email: string;
  message: string;
  timestamp: string;
  deviceType?: string;
}

export interface BotUser {
  id: number | string;
  name: string;
  username?: string;
  lastActive: string;
}

interface AdminData {
  totalVisitors: number;
  totalContacts: number;
  mobileCount: number;
  desktopCount: number;
  countries: Record<string, number>;
  visitors: VisitorLog[];
  contacts: ContactLog[];
  botUsers: Record<string, BotUser>;
}

let inMemoryData: AdminData = {
  totalVisitors: 0,
  totalContacts: 0,
  mobileCount: 0,
  desktopCount: 0,
  countries: {},
  visitors: [],
  contacts: [],
  botUsers: {},
};

function loadData(): AdminData {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const raw = fs.readFileSync(STATS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      inMemoryData = { ...inMemoryData, ...parsed };
    }
  } catch {
    // ignore
  }
  return inMemoryData;
}

function saveData() {
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(inMemoryData, null, 2), 'utf-8');
  } catch {
    // ignore
  }
}

// Initial load
loadData();

export function recordVisitorLog(log: VisitorLog) {
  loadData();
  inMemoryData.totalVisitors += 1;

  if (log.deviceType?.toLowerCase().includes('mobile')) {
    inMemoryData.mobileCount += 1;
  } else {
    inMemoryData.desktopCount += 1;
  }

  const countryKey = log.country || 'Global/Boshqa';
  inMemoryData.countries[countryKey] = (inMemoryData.countries[countryKey] || 0) + 1;

  inMemoryData.visitors.unshift(log);
  if (inMemoryData.visitors.length > 50) {
    inMemoryData.visitors = inMemoryData.visitors.slice(0, 50);
  }

  saveData();
}

export function recordContactLog(log: ContactLog) {
  loadData();
  inMemoryData.totalContacts += 1;
  inMemoryData.contacts.unshift(log);
  if (inMemoryData.contacts.length > 50) {
    inMemoryData.contacts = inMemoryData.contacts.slice(0, 50);
  }
  saveData();
}

export function recordBotUser(user: BotUser) {
  loadData();
  inMemoryData.botUsers[String(user.id)] = user;
  saveData();
}

export function getAdminStats() {
  loadData();
  return {
    totalVisitors: inMemoryData.totalVisitors,
    totalContacts: inMemoryData.totalContacts,
    totalBotUsers: Object.keys(inMemoryData.botUsers).length,
    mobileCount: inMemoryData.mobileCount,
    desktopCount: inMemoryData.desktopCount,
    countries: inMemoryData.countries,
  };
}

export function getRecentVisitors(limit = 5): VisitorLog[] {
  loadData();
  return inMemoryData.visitors.slice(0, limit);
}

export function getRecentContacts(limit = 5): ContactLog[] {
  loadData();
  return inMemoryData.contacts.slice(0, limit);
}

export function getAllBotUsers(): BotUser[] {
  loadData();
  return Object.values(inMemoryData.botUsers);
}
