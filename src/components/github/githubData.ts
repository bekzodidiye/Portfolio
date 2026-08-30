export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface RepositoryItem {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  url: string;
  isRecent?: boolean;
}

export function generateContributionCalendar(): ContributionDay[] {
  const days: ContributionDay[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dayOfWeek = d.getDay();

    let count = 0;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const rand = Math.random();

    if (!isWeekend) {
      if (rand > 0.15) count = Math.floor(Math.random() * 8) + 1;
      if (rand > 0.8) count = Math.floor(Math.random() * 14) + 6;
    } else {
      if (rand > 0.45) count = Math.floor(Math.random() * 5) + 1;
    }

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count === 0) level = 0;
    else if (count <= 2) level = 1;
    else if (count <= 5) level = 2;
    else if (count <= 9) level = 3;
    else level = 4;

    days.push({
      date: d.toISOString().split('T')[0],
      count,
      level,
    });
  }

  return days;
}

export const FEATURED_REPOSITORIES: RepositoryItem[] = [
  {
    name: 'Portfolio',
    description: 'High-performance Modern Engineering Portfolio with 3D WebGL Earth, Live AI Assistant & Silent Telemetry.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 12,
    forks: 4,
    url: 'https://github.com/bekzodidiye/Portfolio',
    isRecent: true,
  },
  {
    name: 'FastAPI-Microservices-Architecture',
    description: 'Production-ready Clean Architecture boilerplate with Redis Streams, PostgreSQL pool & JWT RBAC.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 28,
    forks: 9,
    url: 'https://github.com/bekzodidiye',
    isRecent: true,
  },
  {
    name: 'Telegram-HighLoad-Bot-Framework',
    description: 'Asynchronous Telegram Bot dispatcher powered by aiogram 3.x, Celery task workers, and Redis state storage.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 19,
    forks: 6,
    url: 'https://github.com/bekzodidiye',
  },
  {
    name: 'PostgreSQL-Index-Optimizer',
    description: 'Benchmarking and EXPLAIN ANALYZE tuning suite for B-Tree indexes and high-frequency transactions.',
    language: 'SQL',
    languageColor: '#e38c00',
    stars: 15,
    forks: 3,
    url: 'https://github.com/bekzodidiye',
  },
];

export const LANGUAGE_BREAKDOWN = [
  { name: 'Python', percentage: 78, color: '#3572A5' },
  { name: 'TypeScript / JS', percentage: 14, color: '#3178c6' },
  { name: 'PostgreSQL / SQL', percentage: 5, color: '#e38c00' },
  { name: 'Docker / Shell', percentage: 3, color: '#38bdf8' },
];
