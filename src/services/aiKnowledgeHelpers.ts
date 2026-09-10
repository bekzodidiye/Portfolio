import { CandidateProfile, ProjectItem } from '../types/portfolio';

export const getInitialAiGreeting = (lang: 'uz' | 'ru' | 'en', name: string): string => {
  if (lang === 'uz') {
    return `Salom! Men **${name}**ning sun'iy intellekt yordamchisiman 🤖. \n\nSizga Bekzodning backend tajribasi, yaratgan loyihalari, texnologik steki yoki hamkorlik masalalari bo'yicha qanday yordam bera olaman?`;
  }
  if (lang === 'ru') {
    return `Здравствуйте! Я AI-ассистент инженера **${name}** 🤖. \n\nЧем могу помочь? Могу рассказать про опыт в Backend (FastAPI, Django, aiogram), архитектуру проектов или контакты для сотрудничества.`;
  }
  return `Hello! I am **${name}**'s AI Assistant 🤖. \n\nHow can I help you today? I can provide details about his Backend architecture experience (FastAPI, Django, aiogram, PostgreSQL, Redis), projects, or contract opportunities.`;
};

export const getQuickSuggestionChips = (lang: 'uz' | 'ru' | 'en'): string[] => {
  if (lang === 'uz') {
    return [
      '💼 Backend tajribasi qanday?',
      '🚀 Eng kuchli loyihalari qaysilar?',
      '🤖 Telegram botlar bo\'yicha nimalar qila oladi?',
      '📞 Qanday bog\'lansa bo\'ladi?',
    ];
  }
  if (lang === 'ru') {
    return [
      '💼 Какой опыт в Backend разработке?',
      '🚀 Топ проекты и архитектура?',
      '🤖 Что умеет по Telegram ботам?',
      '📞 Как связаться для найма/проекта?',
    ];
  }
  return [
    '💼 What is his Backend experience?',
    '🚀 What are his top projects?',
    '🤖 Telegram Bot & Automation expertise?',
    '📞 How to get in touch?',
  ];
};

export function buildContactAnswer(profile: CandidateProfile, lang: 'uz' | 'ru' | 'en'): string {
  if (lang === 'uz') {
    return `Bekzod Idiyev bilan to'g'ridan-to'g'ri bog'lanish yo'llari:\n\n` +
      `• **Telegram:** [${profile.telegramHandle}](${profile.telegram})\n` +
      `• **24/7 AI Bot:** [${profile.botUsername || '@my_portfolio_support_bot'}](${profile.botUrl || 'https://t.me/my_portfolio_support_bot'})\n` +
      `• **Telefon:** \`${profile.phone}\`\n` +
      `• **Email:** \`${profile.email}\`\n` +
      `• **GitHub:** [github.com/bekzodidiye](${profile.github})\n\n` +
      `Shuningdek, saytdagi **"Bog'lanish"** formasi orqali xabar qoldirsangiz, u darhol Bekzodning shaxsiy Telegramiga yetib boradi!`;
  }
  if (lang === 'ru') {
    return `Прямые контакты для связи с Бекзодом Идиевым:\n\n` +
      `• **Telegram:** [${profile.telegramHandle}](${profile.telegram})\n` +
      `• **AI Ассистент Бот:** [${profile.botUsername || '@my_portfolio_support_bot'}](${profile.botUrl || 'https://t.me/my_portfolio_support_bot'})\n` +
      `• **Телефон:** \`${profile.phone}\`\n` +
      `• **Email:** \`${profile.email}\`\n` +
      `• **GitHub:** [github.com/bekzodidiye](${profile.github})\n\n` +
      `Вы также можете отправить сообщение через форму на сайте — оно мгновенно поступит в Telegram разработчика.`;
  }
  return `Here are direct ways to contact Bekzod Idiyev:\n\n` +
    `• **Telegram:** [${profile.telegramHandle}](${profile.telegram})\n` +
    `• **24/7 Support Bot:** [${profile.botUsername || '@my_portfolio_support_bot'}](${profile.botUrl || 'https://t.me/my_portfolio_support_bot'})\n` +
    `• **Phone:** \`${profile.phone}\`\n` +
    `• **Email:** \`${profile.email}\`\n` +
    `• **GitHub:** [github.com/bekzodidiye](${profile.github})\n\n` +
    `You can also use the Contact Form on the page — notifications are delivered instantly via webhook!`;
}

export function buildProjectsAnswer(projects: ProjectItem[], lang: 'uz' | 'ru' | 'en'): string {
  const projectList = projects.slice(0, 4).map((proj, i) =>
    `${i + 1}. **${proj.name}** (${proj.badge || 'Active'})\n` +
    `   * ${proj.summary}\n` +
    `   * *Texnologiyalar:* \`${proj.techStack.slice(0, 4).join(', ')}\``
  ).join('\n\n');

  if (lang === 'uz') {
    return `Bekzod tomonidan amalga oshirilgan eng muhim loyihalar:\n\n${projectList}\n\n` +
      `Barcha loyihalar arxitekturasida **toza kod (Clean Architecture)**, **PostgreSQL/Redis tranzaksiyalari** va **yuqori yuklamalarga chidamlilik** ta'minlangan. Batafsil saytning **"Loyihalar"** bo'limida ko'rishingiz mumkin.`;
  }
  if (lang === 'ru') {
    return `Ключевые проекты, разработанные Бекзодом:\n\n${projectList}\n\n` +
      `Все проекты построены по принципам чистой архитектуры, асинхронного FastAPI/aiogram и масштабируемых БД PostgreSQL/Redis.`;
  }
  return `Key production projects engineered by Bekzod:\n\n${projectList}\n\n` +
    `Every project is engineered with Clean Architecture, async non-blocking I/O, and resilient PostgreSQL/Redis caching strategies.`;
}

export function buildTechStackAnswer(lang: 'uz' | 'ru' | 'en'): string {
  if (lang === 'uz') {
    return `Bekzod Idiyev — **Senior Python Backend & Bot Architect** hisoblanadi. Uning asosiy mutaxassisliklari:\n\n` +
      `• **Asosiy Tillari & Frameworklar:** Python 3.12, FastAPI, Django REST Framework, aiogram 3.x, SQLAlchemy 2.0, Pydantic v2.\n` +
      `• **Ma'lumotlar Bazalari:** PostgreSQL (indexing, query tuning, partitioning), Redis (caching, rate limiting, pub/sub), SQLite.\n` +
      `• **Asinxronlik & Queue:** Celery, Redis Streams, WebSockets, asyncio, Background Workers.\n` +
      `• **DevOps & Infra:** Docker, Docker Compose, Nginx, Linux (Ubuntu/Debian server management), CI/CD, Git.\n` +
      `• **Arxitektura:** Clean Architecture, Domain-Driven Design (DDD), Microservices, RESTful & Webhook API design.`;
  }
  if (lang === 'ru') {
    return `Бекзод Идиев специализируется на высоконагруженном Python Backend и Telegram экосистемах:\n\n` +
      `• **Фреймворки:** FastAPI, Django REST Framework, aiogram 3.x, SQLAlchemy 2.0.\n` +
      `• **Базы данных:** PostgreSQL (оптимизация запросов, индексы), Redis (кэширование, очереди).\n` +
      `• **DevOps & Инфраструктура:** Docker, Nginx, Linux серверное администрирование, CI/CD.\n` +
      `• **Архитектура:** Clean Architecture, SOLID, Microservices, Webhooks & Real-time WebSockets.`;
  }
  return `Bekzod Idiyev is a specialized Python Backend & Telegram Engine Architect:\n\n` +
    `• **Core Stack:** Python 3.12, FastAPI, Django REST, aiogram 3.x, SQLAlchemy 2.0, Pydantic.\n` +
    `• **Databases:** PostgreSQL (High-performance indexing, migrations), Redis (In-memory caching, rate limiting).\n` +
    `• **Asynchronous Engines:** Celery, Redis Queues, WebSockets, asyncio concurrency.\n` +
    `• **DevOps & Containers:** Docker, Docker Compose, Nginx reverse-proxies, Linux server hardening.\n` +
    `• **Architecture:** Clean Architecture, Domain-Driven Design, Zero-Downtime Webhook Pipelines.`;
}

export function buildBotAnswer(lang: 'uz' | 'ru' | 'en'): string {
  if (lang === 'uz') {
    return `🤖 **Telegram Bot & Mini App ishlab chiqish:**\n\n` +
      `Bekzod **aiogram 3.x** va **Telegram WebApp** bo'yicha katta amaliy tajribaga ega:\n` +
      `1. **Katta yuklamali botlar:** Kuniga 100,000+ so'rovni oson ko'taruvchi asinxron webhook arxitekturasi.\n` +
      `2. **To'lov integratsiyalari:** Click, Payme, Uzum Bank, Stripe, Telegram Stars to'lov tizimlari.\n` +
      `3. **CRM & Admin panellar:** Bot ichidagi dinamik boshqaruv, foydalanuvchilar segmentatsiyasi va avtomatlashtirilgan xabarnomalar (broadcast).\n` +
      `4. **AI Botlar:** OpenAI va Gemini API integratsiyasi qilingan intellektual yordamchilar.\n\n` +
      `Jonli demo bot: [@my_portfolio_support_bot](https://t.me/my_portfolio_support_bot).`;
  }
  if (lang === 'ru') {
    return `🤖 **Разработка Telegram ботов и Mini Apps:**\n\n` +
      `Бекзод разрабатывает сложные Telegram экосистемы на **aiogram 3.x**:\n` +
      `• Отказоустойчивые Webhook архитектуры с очередями Redis/Celery.\n` +
      `• Интеграция платежей (Payme, Click, Telegram Stars, Stripe).\n` +
      `• Интерактивные Mini Apps (React + Telegram WebApp SDK).\n` +
      `• ИИ-ассистенты с интеграцией Gemini и OpenAI.\n\n` +
      `Попробуйте живой бот: [@my_portfolio_support_bot](https://t.me/my_portfolio_support_bot).`;
  }
  return `🤖 **Telegram Engine & WebApp Automation:**\n\n` +
    `Bekzod engineers production-grade Telegram ecosystems utilizing **aiogram 3.x** and **Telegram WebApp SDK**:\n` +
    `• High-throughput Webhook pipelines handling concurrent request spikes.\n` +
    `• Payment Gateway integrations (Stripe, Payme, Click, Telegram Stars).\n` +
    `• Interactive Mini Apps and customized CRM backends.\n` +
    `• AI conversational agents with Gemini API.\n\n` +
    `Explore his official live bot: [@my_portfolio_support_bot](https://t.me/my_portfolio_support_bot).`;
}

export function buildExperienceAnswer(profile: CandidateProfile, lang: 'uz' | 'ru' | 'en'): string {
  const freelanceOrders = profile.freelanceCount || 35;

  if (lang === 'uz') {
    return `Bekzod Idiyevning kasbiy tajribasi:\n\n` +
      `• **Kwork & Xalqaro Freelance:** ${freelanceOrders}+ dan ortiq muvaffaqiyatli topshirilgan backend va bot buyurtmalari (100% 5-yulduzli baho).\n` +
      `• **Tijoriy loyihalar:** Paynet CRM integratsiyasi, RRR Academy ta'lim boti, Buddy Team AI platformasi va Esports turnir boshqaruv tizimlari.\n` +
      `• **Ta'lim:** School 21 va Mohirdev platformalarida chuqur muhandislik amaliyoti.\n\n` +
      `Hozirda **Full-Time (masofaviy/ofis)** va **High-Impact Freelance** takliflar uchun ochiq!`;
  }
  if (lang === 'ru') {
    return `Профессиональный опыт Бекзода Идиева:\n\n` +
      `• **Kwork и Международный Фриланс:** Более ${freelanceOrders} успешно завершенных проектов с максимальным рейтингом.\n` +
      `• **Коммерческие системы:** Paynet CRM, RRR Academy Bot, Buddy Team AI Matcher, Esports Tournament Platform.\n` +
      `• **Образование:** Интенсивная школа программирования School 21 и Mohirdev.\n\n` +
      `Открыт к предложениям на **Full-Time** и проектной разработке.`;
  }
  return `Bekzod Idiyev's Professional Experience:\n\n` +
    `• **Kwork & Global Freelance:** ${freelanceOrders}+ successfully delivered backend contracts with top ratings.\n` +
    `• **Commercial Engines:** Paynet CRM integration, RRR Academy Bot, Buddy Team AI Platform, Esports Tournament Automation.\n` +
    `• **Engineering Foundation:** School 21 peer-learning campus & Mohirdev Backend Track.\n\n` +
    `Currently open for **Full-Time roles** and **Enterprise Freelance Contracts**!`;
}

export function buildFallbackAnswer(profile: CandidateProfile, lang: 'uz' | 'ru' | 'en'): string {
  if (lang === 'uz') {
    return `Savolingiz uchun rahmat! Bekzod Idiyev — **FastAPI, Django, PostgreSQL, Redis, Docker va aiogram** bo'yicha kuchli backend dasturchi.\n\n` +
      `Sizni qiziqtirgan mavzuni tanlashingiz mumkin:\n` +
      `• **"Loyihalari"** — eng so'nggi yirik ishlari\n` +
      `• **"Texnologiyalar"** — backend va bot steki\n` +
      `• **"Kontaktlar"** — Telegram, telefon yoki email orqali bog'lanish\n\n` +
      `Yoki to'g'ridan-to'g'ri Telegramda yozishingiz mumkin: [${profile.telegramHandle}](${profile.telegram})`;
  }
  if (lang === 'ru') {
    return `Спасибо за вопрос! Бекзод Идиев — опытный Backend-разработчик на **Python, FastAPI, Django, PostgreSQL, Redis и aiogram**.\n\n` +
      `Вы можете спросить о:\n` +
      `• **"Проекты"** — разбор созданных систем\n` +
      `• **"Стек"** — технологии и архитектура\n` +
      `• **"Контакты"** — способы быстрой связи\n\n` +
      `Или напишите напрямую в Telegram: [${profile.telegramHandle}](${profile.telegram})`;
  }
  return `Thank you for asking! Bekzod Idiyev is a specialized Backend Engineer skilled in **Python, FastAPI, Django, PostgreSQL, Redis, Docker, and aiogram**.\n\n` +
    `You can explore:\n` +
    `• **"Projects"** — deep dives into his production systems\n` +
    `• **"Skills"** — his backend & database toolkit\n` +
    `• **"Contact"** — reach out for hire or contract discussion\n\n` +
    `Or message him directly on Telegram: [${profile.telegramHandle}](${profile.telegram})`;
}
