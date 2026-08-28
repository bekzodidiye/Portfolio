import { CandidateProfile, ProjectItem, WorkExperienceItem, EducationItem, SkillCategory } from '../types/portfolio';

export const CANDIDATE_PROFILE: CandidateProfile = {
  name: 'Bekzod Idiyev',
  primaryTitle: 'Python Backend Developer',
  subTitle: 'Backend Engineering & Data Science Student @ School 21',
  location: 'Bukhara, Uzbekistan',
  phone: '+998 94 613 87 86',
  email: 'Bekzodidiye@gmail.com',
  github: 'https://github.com/bekzodidiye',
  linkedin: 'https://linkedin.com/in/bekzod-idiyev',
  telegram: 'https://t.me/toyneden',
  telegramHandle: '@toyneden',
  summary:
    'Results-oriented Python Backend Engineer with hands-on experience in building high-performance REST APIs, scalable Telegram bots, and complex CRM backend systems. Proficient in Django, FastAPI, and Flask frameworks. Demonstrates proven freelance experience on Kwork platform with 7+ successfully delivered client projects. Currently enhancing specialized knowledge in Data Science algorithms and production-level Backend Systems Engineering at School 21.',
  freelanceCount: 7,
};

export const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: 'buddy-team',
    name: 'Buddy Team',
    category: 'Matching & AI Platform',
    timeline: '2026',
    techStack: ['Django', 'PostgreSQL', 'Docker', 'React (TypeScript)', 'Vite', 'TailwindCSS', 'Google Gemini AI API'],
    summary: 'High-throughput student-mentor matching platform with automated AI recommendation engines.',
    keyFeatures: [
      'Matching platform connecting students and mentors based on skill requirements and goals.',
      'Django REST Framework backend coupled with containerized Docker deployment pipeline.',
      'Automated recommendation system powered by Google Gemini AI API integration.',
    ],
    architecture: 'Clean Architecture with REST API endpoints, JWT authentication, and isolated Docker microservices containerization.',
    githubUrl: 'https://github.com/bekzodidiye',
    demoUrl: 'https://github.com/bekzodidiye/buddy-team',
    badge: 'AI & Full-Stack',
  },
  {
    id: 'esports-bot',
    name: 'Esports Tournament Management Bot',
    category: 'Gaming Club Telegram Ecosystem',
    timeline: '2026',
    techStack: ['aiogram 3.x', 'FastAPI', 'PostgreSQL', 'Redis'],
    summary: 'Asynchronous event-driven esports tournament engine with real-time bracket generation.',
    keyFeatures: [
      'Asynchronous Telegram bot built with aiogram 3.x automating esports tournament operations.',
      'Dynamic bracket generator supporting single/double elimination structures.',
      'Real-time match scoring, leaderboard updates, and administrative management panel.',
    ],
    architecture: 'Asynchronous event loop with aiogram 3.x, Redis state persistence for tournament matches, and FastAPI administrative hooks.',
    githubUrl: 'https://github.com/bekzodidiye',
    demoUrl: 'https://t.me/toyneden',
    badge: 'aiogram 3.x Engine',
  },
  {
    id: 'peerlearn-app',
    name: 'PeerLearn — Telegram Mini App',
    category: 'P2P Learning WebApp',
    timeline: '2026',
    techStack: ['FastAPI', 'PostgreSQL', 'Redis', 'WebSocket', 'React', 'School 21 OAuth 2.0'],
    summary: 'Peer-to-peer anonymous mentor matching web app integrated into Telegram with live WebSockets.',
    keyFeatures: [
      'Peer-to-peer anonymous mentor-mentee matching tailored for School 21 peer learning environment.',
      'Real-time bidirectional chat implementation using WebSockets backed by Redis pub/sub.',
      'Integrated XP/Coin gamification mechanics, calendar scheduling, and automated reminders via APScheduler.',
    ],
    architecture: 'FastAPI async backend, bidirectional WebSocket channels, Redis Pub/Sub broadcast engine, and APScheduler automated worker queues.',
    githubUrl: 'https://github.com/bekzodidiye',
    demoUrl: 'https://t.me/toyneden',
    badge: 'WebSockets & Mini App',
  },
];

export const WORK_EXPERIENCE: WorkExperienceItem[] = [
  {
    id: 'kwork-freelance',
    role: 'Freelance Backend Developer',
    companyOrPlatform: 'Kwork (Freelance Market)',
    period: '2026 – Present',
    badge: '7+ Delivered Projects',
    responsibilities: [
      'Independently engineered, tested, and delivered over 7 complex backend applications from zero to deployment.',
      'Facilitated direct client communication to capture requirements, define technical specifications, and establish milestone deliverables.',
      'Designed normalized relational database schemas (PostgreSQL, MySQL) optimizing query performance and index structures.',
      'Built custom REST APIs and Telegram integration tools with high availability and error-handling routines.',
    ],
    techTags: ['Python', 'FastAPI', 'Django', 'PostgreSQL', 'Redis', 'Telegram Bots'],
  },
  {
    id: 'paynet-crm',
    role: 'Backend Developer',
    companyOrPlatform: 'Paynet CRM System',
    period: '2026',
    badge: 'Enterprise CRM',
    responsibilities: [
      'Architected core business logic for customer management modules and transaction history monitoring.',
      'Developed multi-tier role-based access control (RBAC) ensuring secure API endpoints.',
      'Integrated third-party payment callback verification mechanisms and structured logging routines.',
    ],
    techTags: ['Django REST', 'RBAC', 'PostgreSQL', 'Payment Gateways', 'Docker'],
  },
  {
    id: 'rrr-academy-bot',
    role: 'Backend Developer',
    companyOrPlatform: 'RRR Academy Telegram Bot',
    period: '2024',
    badge: 'EdTech Automation',
    responsibilities: [
      'Built automated educational management bot handling course catalog, user enrollments, and homework tracking.',
      'Created automated push notification pipelines for scheduling alerts and broadcast messages.',
    ],
    techTags: ['aiogram', 'Python', 'SQLite3/PostgreSQL', 'Cron / Background Tasks'],
  },
];

export const EDUCATION_LIST: EducationItem[] = [
  {
    id: 'school-21',
    institution: 'School 21',
    period: '2025 – Present',
    field: 'Backend Systems Engineering & Data Science',
    status: 'In Progress',
    description: 'Peer-to-peer intensive engineering methodology focusing on advanced algorithms, low-level architecture, Linux environments, and Data Science models.',
  },
  {
    id: 'mohirdev',
    institution: 'Mohirdev Platform',
    period: '2024 – 2025',
    field: 'Intensive Backend Python Development',
    status: 'Completed',
    description: 'Deep dive into Python internals, Django/FastAPI frameworks, PostgreSQL indexing, ORM optimization, Docker, and REST API design.',
  },
  {
    id: 'pro-unity',
    institution: 'Pro Unity Academy',
    period: '2024',
    field: 'Core Backend Programming Fundamentals',
    status: 'Completed',
    description: 'Comprehensive study of OOP, data structures, algorithms, modular programming, and relational database queries.',
  },
  {
    id: 'it-center',
    institution: 'IT Center',
    period: '2023',
    field: 'Web Frontend Fundamentals',
    status: 'Completed',
    description: 'Foundations of HTML5, CSS3, modern JavaScript DOM manipulation, and responsive web design.',
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Backend Frameworks',
    iconName: 'Server',
    description: 'Production-ready web APIs, microservices & asynchronous bots',
    skills: [
      { name: 'Python', level: 'Expert', tag: 'Core Language' },
      { name: 'FastAPI', level: 'Expert', tag: 'High-Perf Async' },
      { name: 'Django / DRF', level: 'Expert', tag: 'Enterprise Web' },
      { name: 'Flask', level: 'Advanced', tag: 'Microservices' },
      { name: 'aiogram 3.x', level: 'Expert', tag: 'Telegram Ecosystem' },
    ],
  },
  {
    title: 'Databases & Caching',
    iconName: 'Database',
    description: 'Relational data modeling, query optimization & in-memory caches',
    skills: [
      { name: 'PostgreSQL', level: 'Advanced', tag: 'Primary RDBMS' },
      { name: 'Redis', level: 'Advanced', tag: 'Cache & Pub/Sub' },
      { name: 'MySQL', level: 'Advanced', tag: 'Relational' },
      { name: 'MongoDB', level: 'Intermediate', tag: 'NoSQL Store' },
      { name: 'SQLite3', level: 'Expert', tag: 'Embedded & Testing' },
    ],
  },
  {
    title: 'DevOps & Infrastructure',
    iconName: 'Cpu',
    description: 'Containerization, asynchronous task queues & real-time protocols',
    skills: [
      { name: 'Docker & Compose', level: 'Advanced', tag: 'Containerization' },
      { name: 'Celery & Redis', level: 'Advanced', tag: 'Task Queues' },
      { name: 'WebSockets', level: 'Advanced', tag: 'Bidirectional Stream' },
      { name: 'Nginx & Linux', level: 'Advanced', tag: 'Reverse Proxy & Bash' },
      { name: 'CI/CD & Git', level: 'Advanced', tag: 'Version Control' },
    ],
  },
  {
    title: 'Architecture & Security',
    iconName: 'ShieldCheck',
    description: 'System design principles, secure auth protocols & clean patterns',
    skills: [
      { name: 'Clean Architecture', level: 'Advanced', tag: 'Maintainable Code' },
      { name: 'SOLID Principles', level: 'Advanced', tag: 'OOP Standards' },
      { name: 'JWT & OAuth 2.0', level: 'Advanced', tag: 'Auth Security' },
      { name: 'REST APIs & Webhooks', level: 'Expert', tag: 'Protocol Standards' },
      { name: 'Microservices Design', level: 'Intermediate', tag: 'Distributed Systems' },
    ],
  },
];
