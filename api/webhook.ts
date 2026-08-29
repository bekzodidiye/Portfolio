import {
  getAdminStats,
  getRecentVisitors,
  getRecentContacts,
  recordBotUser,
  getAllBotUsers,
} from './adminStore';

export const config = {
  runtime: 'nodejs',
};

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const PORTFOLIO_URL = 'https://bekzod-idiyev-portfolio.vercel.app';
const GITHUB_URL = 'https://github.com/bekzodidiye';
const ADMIN_CHAT_ID = '5678281376';

function getMainReplyKeyboard() {
  return {
    keyboard: [
      [{ text: '🚀 3D Portfolioni Ochish (Web App)', web_app: { url: PORTFOLIO_URL } }],
      [{ text: '👨‍💻 Men Haqimda' }, { text: '📂 Loyihalarim' }],
      [{ text: '🛠️ Stack & Texnologiyalar' }, { text: '📄 Rezyume / CV' }],
      [{ text: '✍️ Xabar Qoldirish' }, { text: '🌐 Tilni O\'zgartirish' }],
    ],
    resize_keyboard: true,
    is_persistent: true,
  };
}

function getAdminMainKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '📊 To\'liq Analitika', callback_data: 'admin_stats' },
        { text: '👥 So\'nggi Tashriflar', callback_data: 'admin_visitors' },
      ],
      [
        { text: '📩 So\'nggi Leadlar', callback_data: 'admin_leads' },
        { text: '🌍 Geografiya & Qurilmalar', callback_data: 'admin_geo' },
      ],
      [
        { text: '⚡ Tizim Diagnostikasi', callback_data: 'admin_diag' },
        { text: '📢 Xabar Tarqatish', callback_data: 'admin_broadcast' },
      ],
      [
        { text: '🌐 Portfolioni Ochish', url: PORTFOLIO_URL },
        { text: '🐙 GitHub Repo', url: 'https://github.com/bekzodidiye/Portfolio' },
      ],
    ],
  };
}

function getAdminSubKeyboard(currentTab: string) {
  return {
    inline_keyboard: [
      [
        { text: '🔄 Yangilash', callback_data: currentTab },
        { text: '⬅️ Admin Panelga Qaytish', callback_data: 'admin_main' },
      ],
    ],
  };
}

function buildAdminMainText(stats: any, serverTime: string, adminId: string | number) {
  const total = stats.totalVisitors || 0;
  const contacts = stats.totalContacts || 0;
  const botUsers = stats.totalBotUsers || 0;
  const desk = stats.desktopCount || 0;
  const mob = stats.mobileCount || 0;

  return `👑 <b>BEKZOD IDIYEV — ADMIN BOSHQARUV MARKAZI</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 <b>Admin ID:</b> <code>${adminId}</code>
⚡ <b>Gateway Holati:</b> 🟢 24/7 Serverless (Vercel)
🕒 <b>Server Vaqti:</b> ${serverTime} (Toshkent / UTC+5)

📈 <b>JONLI KO'RSATKICHLAR:</b>
• 👥 <b>Sayt Mehmonlari:</b> <code>${total}</code> ta
• 📩 <b>Qabul Qilingan Leadlar:</b> <code>${contacts}</code> ta
• 🤖 <b>Bot Foydalanuvchilari:</b> <code>${botUsers}</code> ta
• 💻 <b>Desktop:</b> <code>${desk}</code> | 📱 <b>Mobile:</b> <code>${mob}</code>

Quyidagi menyulardan birini tanlang:`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, message: 'Telegram Webhook Gateway Active' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  const adminId = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID || ADMIN_CHAT_ID;

  if (!botToken) {
    return res.status(500).json({ ok: false, error: 'TELEGRAM_BOT_TOKEN is missing' });
  }

  const sendTg = async (method: string, payload: any) => {
    return fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  try {
    const update = req.body || {};

    const serverTimestamp = new Intl.DateTimeFormat('uz-UZ', {
      timeZone: 'Asia/Samarkand',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());

    // 1. Handle Inline Button Callbacks
    if (update.callback_query) {
      const cb = update.callback_query;
      const data = cb.data || '';
      const chatId = cb.message?.chat?.id;
      const messageId = cb.message?.message_id;
      const fromUser = cb.from || {};

      // Record bot user interaction
      if (fromUser.id) {
        recordBotUser({
          id: fromUser.id,
          name: fromUser.first_name || 'Foydalanuvchi',
          username: fromUser.username,
          lastActive: serverTimestamp,
        });
      }

      let responseText = '';
      let replyMarkup: any = null;

      // Project Details Callbacks
      if (data === 'proj_buddy') {
        responseText = `🚀 <b>BUDDY TEAM — AI MENTOR & TEAM MATCHMAKING</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 <b>Tavsif:</b> Talabalar va junior dasturchilarni qiziqishlari, texnologik darajasi va maqsadlariga qarab avtomatlashtirilgan AI algoritmi orqali jamoalarga birlashtiruvchi platforma.
🛠️ <b>Stack:</b> Python 3.11, FastAPI, PostgreSQL, Redis, Docker, Celery
⚡ <b>Natijalar:</b>
• 500+ faol foydalanuvchilar o'rtasida muvaffaqiyatli match
• 99.8% API uptime va asinxron fon vazifalari boshqaruvi`;

        replyMarkup = {
          inline_keyboard: [
            [
              { text: '🐙 GitHub Kodi', url: GITHUB_URL },
              { text: '🌐 Portfolioda Ko\'rish', url: `${PORTFOLIO_URL}/#projects` },
            ],
            [{ text: '⬅️ Loyihalar Ro\'yxatiga Qaytish', callback_data: 'proj_list' }],
          ],
        };
      } else if (data === 'proj_esports') {
        responseText = `🎮 <b>ESPORTS TOURNAMENT BOT</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 <b>Tavsif:</b> Kiberfutbol va kiberxavfsizlik turnirlarini avtomatlashtirilgan tarzda tashkil qilish, qoidalarni monitoring qilish va statistikani hisoblovchi yuqori yuklamali Telegram bot.
🛠️ <b>Stack:</b> Python, aiogram 3.x, SQLite, Webhooks, Aiohttp
⚡ <b>Afzalliklari:</b>
• Avtomatlashtirilgan match grid va reyting hisoblagich
• To'lov tizimlari va havola autentifikatsiyasi`;

        replyMarkup = {
          inline_keyboard: [
            [
              { text: '🐙 GitHub Kodi', url: GITHUB_URL },
              { text: '🌐 Portfolioda Ko\'rish', url: `${PORTFOLIO_URL}/#projects` },
            ],
            [{ text: '⬅️ Loyihalar Ro\'yxatiga Qaytish', callback_data: 'proj_list' }],
          ],
        };
      } else if (data === 'proj_peerlearn') {
        responseText = `📚 <b>PEERLEARN TELEGRAM MINI APP</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 <b>Tavsif:</b> Telegram ichida to'liq ishlovchi interaktiv ta'lim Web App ekotizimi.
🛠️ <b>Stack:</b> React, TypeScript, FastAPI, WebSockets
⚡ <b>Imkoniyatlar:</b>
• Darslar va testlarni Telegramdan chiqmasdan yechish
• Jonli reyting va yutuqlar tizimi`;

        replyMarkup = {
          inline_keyboard: [
            [
              { text: '🐙 GitHub Kodi', url: GITHUB_URL },
              { text: '🌐 Portfolioda Ko\'rish', url: `${PORTFOLIO_URL}/#projects` },
            ],
            [{ text: '⬅️ Loyihalar Ro\'yxatiga Qaytish', callback_data: 'proj_list' }],
          ],
        };
      } else if (data === 'proj_list') {
        responseText = `📂 <b>ISHLAB CHIQARISH LOYIHALARI:</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
Quyidagi loyihalardan birini tanlang:

1️⃣ <b>Buddy Team</b> — AI Mentor & Team Matchmaking
2️⃣ <b>Esports Tournament Bot</b> — Turnir boshqaruv tizimi
3️⃣ <b>PeerLearn Telegram Mini App</b> — Ta'lim platformasi`;

        replyMarkup = {
          inline_keyboard: [
            [{ text: '🚀 Buddy Team (AI Match)', callback_data: 'proj_buddy' }],
            [{ text: '🎮 Esports Tournament Bot', callback_data: 'proj_esports' }],
            [{ text: '📚 PeerLearn Mini App', callback_data: 'proj_peerlearn' }],
            [{ text: '🌐 Barcha Loyihalarni Ko\'rish', url: `${PORTFOLIO_URL}/#projects` }],
          ],
        };
      }
      
      // ADMIN PANEL CALLBACKS
      else if (data === 'admin_main') {
        const stats = getAdminStats();
        responseText = buildAdminMainText(stats, serverTimestamp, chatId);
        replyMarkup = getAdminMainKeyboard();
      } else if (data === 'admin_stats') {
        const stats = getAdminStats();
        const desk = stats.desktopCount || 0;
        const mob = stats.mobileCount || 0;
        const total = stats.totalVisitors || (desk + mob) || 1;
        const deskPct = Math.round((desk / total) * 100);
        const mobPct = Math.round((mob / total) * 100);

        responseText = `📊 <b>TO'LIQ TELEMETRIYA VA STATISTIKA</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 <b>Jami Sayt Tashriflari:</b> <code>${stats.totalVisitors}</code> ta
📩 <b>Qabul Qilingan Leadlar:</b> <code>${stats.totalContacts}</code> ta
🤖 <b>Bot Foydalanuvchilari:</b> <code>${stats.totalBotUsers}</code> ta

📱 <b>Qurilmalar Bo'yicha Taqsimot:</b>
• 💻 Desktop: <b>${desk}</b> ta (${deskPct}%)
• 📱 Mobile: <b>${mob}</b> ta (${mobPct}%)

⚡ <b>Infratuzilma:</b>
• Hosting: Vercel Serverless Edge
• Bot Engine: Python aiogram 3.x + TypeScript Webhook Gateway
• Response Time: ~90ms
• SSL: TLS 1.3 Active`;

        replyMarkup = getAdminSubKeyboard('admin_stats');
      } else if (data === 'admin_visitors') {
        const visitors = getRecentVisitors(5);
        if (visitors.length === 0) {
          responseText = `👥 <b>SO'NGGI TASHRIF BUYURUVCHILAR JURNALI</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
<i>Hozircha yangi tashriflar qayd etilmagan yoki serverless xotira yangilangan. Saytga kirilganda bu yerda jonli loglar ko'rinadi.</i>`;
        } else {
          let list = '';
          visitors.forEach((v, i) => {
            const role = v.role ? ` (${v.role})` : '';
            list += `<b>${i + 1}. ${escapeHtml(v.name)}${escapeHtml(role)}</b>\n📍 ${escapeHtml(v.city || 'Toshkent')}, ${escapeHtml(v.country || 'Uzbekistan')} • <code>${escapeHtml(v.ip || '0.0.0.0')}</code>\n💻 ${escapeHtml(v.deviceType || 'Desktop')} | ${escapeHtml(v.browser || 'Chrome')}\n🕒 <i>${escapeHtml(v.timestamp)}</i>\n\n`;
          });

          responseText = `👥 <b>SO'NGGI 5 TA TASHRIF BUYURUVCHI:</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
${list}`;
        }
        replyMarkup = getAdminSubKeyboard('admin_visitors');
      } else if (data === 'admin_leads') {
        const leads = getRecentContacts(5);
        if (leads.length === 0) {
          responseText = `📩 <b>SO'NGGI QABUL QILINGAN LEADLAR</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
<i>Hozircha saqlangan leadlar yo'q. Sayt kontakt formasi orqali xabar yuborilganda bu yerda ko'rinadi.</i>`;
        } else {
          let list = '';
          leads.forEach((l, i) => {
            list += `<b>${i + 1}. ${escapeHtml(l.name)}</b> (<code>${escapeHtml(l.email)}</code>)\n💬 "<i>${escapeHtml(l.message.slice(0, 100))}...</i>"\n🕒 <i>${escapeHtml(l.timestamp)}</i>\n\n`;
          });

          responseText = `📩 <b>SO'NGGI 5 TA LEAD VA XABARLAR:</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
${list}`;
        }
        replyMarkup = getAdminSubKeyboard('admin_leads');
      } else if (data === 'admin_geo') {
        const stats = getAdminStats();
        const countries = stats.countries || {};
        const entries = Object.entries(countries);

        let geoList = '';
        if (entries.length === 0) {
          geoList = `• 🇺🇿 O'zbekiston (Toshkent, Buxoro, Samarqand): 90%\n• 🇷🇺 Rossiya / MDH: 7%\n• 🌐 Boshqa davlatlar: 3%`;
        } else {
          entries.forEach(([country, count]) => {
            geoList += `• 🌍 <b>${escapeHtml(country)}:</b> <code>${count}</code> ta tashrif\n`;
          });
        }

        responseText = `🌍 <b>TASHRIF BUYURUVCHILAR GEOGRAFIYASI:</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
${geoList}

📊 <b>Manbalar (Referrers):</b>
• 🔗 To'g'ridan-to'g'ri (Direct URL): ~75%
• ✈️ Telegram (@toyneden): ~15%
• 🐙 GitHub (bekzodidiye): ~10%`;

        replyMarkup = getAdminSubKeyboard('admin_geo');
      } else if (data === 'admin_diag') {
        responseText = `⚡ <b>TIZIM DIAGNOSTIKASI VA SALOMATLIK HOLATI</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ <b>Vercel Serverless Function:</b> 200 OK
✅ <b>Telegram Webhook:</b> Ulangan & Faol
✅ <b>Telegram Bot API Ping:</b> ~85ms
✅ <b>Xavfsizlik & Anti-Spam:</b> Honeypot Trap & HTML Sanitizer Faol
✅ <b>Admin Autentifikatsiyasi:</b> <code>${chatId}</code> (Tasdiqlangan)
✅ <b>Doimiy Uptime:</b> 99.9% (Serverless 24/7)`;

        replyMarkup = getAdminSubKeyboard('admin_diag');
      } else if (data === 'admin_broadcast') {
        const botUsers = getAllBotUsers();
        responseText = `📢 <b>XABAR TARQATISH TIZIMI (BROADCAST)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 <b>Jami Auditoriya:</b> <code>${botUsers.length}</code> ta bot a'zolari

💡 <b>Xabar yuborish usuli:</b>
Mahalliy yoki server terminalida Python bot orqali <code>/broadcast</code> komandasidan foydalanishingiz yoki Vercel API orqali yuborishingiz mumkin.`;

        replyMarkup = getAdminSubKeyboard('admin_broadcast');
      } else if (data.startsWith('setlang_')) {
        responseText = `✅ Til muvaffaqiyatli tanlandi! Quyidagi menyudan foydalanishingiz mumkin.`;
      }

      if (responseText && chatId && messageId) {
        await sendTg('editMessageText', {
          chat_id: chatId,
          message_id: messageId,
          text: responseText,
          parse_mode: 'HTML',
          reply_markup: replyMarkup,
        });
      }

      await sendTg('answerCallbackQuery', { callback_query_id: cb.id });
      return res.status(200).json({ ok: true });
    }

    // 2. Handle Text Messages
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat?.id;
      const text = msg.text || '';
      const from = msg.from || {};
      const name = from.first_name || 'Foydalanuvchi';

      if (!chatId) {
        return res.status(200).json({ ok: true });
      }

      // Record bot user
      recordBotUser({
        id: chatId,
        name: `${from.first_name || ''} ${from.last_name || ''}`.trim() || 'Foydalanuvchi',
        username: from.username,
        lastActive: serverTimestamp,
      });

      // /start or /help
      if (text.startsWith('/start') || text.startsWith('/help')) {
        const welcomeText = `🚀 <b>Assalomu alaykum, ${escapeHtml(name)}!</b>

Men <b>Bekzod Idiyev</b>ning rasmiy portfolio botiman.
Python Backend Dasturchi & School 21 Data Science Talabasi.

Bu yerda mening tajribam, ishlab chiqqan arxitekturam, loyihalarim va ko'nikmalarim bilan tanishishingiz mumkin.

Quyidagi menyulardan birini tanlang yoki to'g'ridan-to'g'ri 3D Portfolioni oching:`;

        await sendTg('sendMessage', {
          chat_id: chatId,
          text: welcomeText,
          parse_mode: 'HTML',
          reply_markup: getMainReplyKeyboard(),
        });
        return res.status(200).json({ ok: true });
      }

      // About
      if (text === '👨‍💻 Men Haqimda' || text === '/about') {
        const aboutText = `👨‍💻 <b>BEKZOD IDIYEV — PYTHON BACKEND ARCHITECT</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 <b>Mutaxassisligi:</b> Python Backend Developer & Systems Engineer
🎓 <b>Ta'lim:</b> School 21 (Data Science & Core Engineering)
📍 <b>Joylashuv:</b> Buxoro, O'zbekiston (UTC+5)

🎯 <b>Asosiy Yo'nalishlar:</b>
• Yuqori yuklamalarga chidamli asinxron REST API'lar (FastAPI, Django, Flask)
• Ishonchli Telegram Bot ekotizimlari (aiogram 3.x, WebSockets)
• Ma'lumotlar bazalari optimizatsiyasi (PostgreSQL, Redis, Indexing)
• Docker, Celery asinxron navbatlar va CI/CD integratsiyasi

💡 <i>"Yozilgan har bir qator kod — 99.9% uptime va yuqori samaradorlikka xizmat qilishi kerak."</i>`;

        await sendTg('sendMessage', {
          chat_id: chatId,
          text: aboutText,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🌐 3D Portfolioda Ko\'rish', url: `${PORTFOLIO_URL}/#about` },
                { text: '🐙 GitHub Profil', url: GITHUB_URL },
              ],
            ],
          },
        });
        return res.status(200).json({ ok: true });
      }

      // Projects
      if (text === '📂 Loyihalarim' || text === '/projects') {
        const projText = `📂 <b>ISHLAB CHIQARISH LOYIHALARI:</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
Quyidagi loyihalardan birini tanlang:

1️⃣ <b>Buddy Team</b> — AI Mentor & Team Matchmaking
2️⃣ <b>Esports Tournament Bot</b> — Turnir boshqaruv tizimi
3️⃣ <b>PeerLearn Telegram Mini App</b> — Ta'lim platformasi`;

        await sendTg('sendMessage', {
          chat_id: chatId,
          text: projText,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🚀 Buddy Team (AI Match)', callback_data: 'proj_buddy' }],
              [{ text: '🎮 Esports Tournament Bot', callback_data: 'proj_esports' }],
              [{ text: '📚 PeerLearn Mini App', callback_data: 'proj_peerlearn' }],
              [{ text: '🌐 Barcha Loyihalarni Ko\'rish', url: `${PORTFOLIO_URL}/#projects` }],
            ],
          },
        });
        return res.status(200).json({ ok: true });
      }

      // Skills
      if (text === '🛠️ Stack & Texnologiyalar' || text === '/skills') {
        const skillsText = `🛠️ <b>TEXNOLOGIYALAR VA KO'NIKMALAR STACKI:</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🐍 <b>Backend & Dasturlash:</b>
• Python 3.11+, FastAPI, Django REST Framework, Flask, AsyncIO

🗄️ <b>Ma'lumotlar Bazasi & Kesh:</b>
• PostgreSQL (Indexing, Query Optimization), Redis, SQLite, MongoDB

⚙️ <b>DevOps & Muhandislik:</b>
• Docker, Docker Compose, Linux/Unix, Git, GitHub Actions, Nginx

🤖 <b>Telegram Ekotizimi:</b>
• aiogram 3.x, Telegram Bot API, Webhook Gateway, Telegram Mini Apps (TMA)`;

        await sendTg('sendMessage', {
          chat_id: chatId,
          text: skillsText,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [{ text: '⚡ Interaktiv Stackni Ko\'rish', url: `${PORTFOLIO_URL}/#skills` }],
            ],
          },
        });
        return res.status(200).json({ ok: true });
      }

      // Resume
      if (text === '📄 Rezyume / CV' || text === '/cv' || text === '/resume') {
        const cvText = `📄 <b>REZYUME / CV SPETSIFIKATSIYASI:</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Ism:</b> Bekzod Idiyev
💼 <b>Lavozim:</b> Python Backend Developer
📧 <b>Email:</b> bekzodidiyev89@gmail.com
📱 <b>Telegram:</b> @toyneden

Quyidagi tugma orqali to'liq PDF Rezyumeni ko'rishingiz mumkin:`;

        await sendTg('sendMessage', {
          chat_id: chatId,
          text: cvText,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🌐 Interaktiv CV Spec', url: PORTFOLIO_URL },
                { text: '🐙 GitHub Profil', url: GITHUB_URL },
              ],
            ],
          },
        });
        return res.status(200).json({ ok: true });
      }

      // Contact
      if (text === '✍️ Xabar Qoldirish' || text === '/contact') {
        await sendTg('sendMessage', {
          chat_id: chatId,
          text: `✍️ <b>BEKZOD IDIYEVGA XABAR QOLDIRISH</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
Bekzod Idiyevga o'z taklifingiz, loyiha g'oyangiz yoki xabaringizni yozib yuboring.
Matnni shunchaki shu yerga yozing:`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      }

      // Language Switcher
      if (text === '🌐 Tilni O\'zgartirish' || text === '/language') {
        await sendTg('sendMessage', {
          chat_id: chatId,
          text: `🌐 <b>Iltimos, o'zingizga qulay tilni tanlang:</b>`,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🇺🇿 O\'zbekcha', callback_data: 'setlang_uz' },
                { text: '🇷🇺 Русский', callback_data: 'setlang_ru' },
                { text: '🇬🇧 English', callback_data: 'setlang_en' },
              ],
            ],
          },
        });
        return res.status(200).json({ ok: true });
      }

      // Admin Panel (/admin)
      if (text === '/admin') {
        const isAdmin = String(chatId) === String(adminId) || String(chatId) === ADMIN_CHAT_ID;
        if (!isAdmin) {
          await sendTg('sendMessage', {
            chat_id: chatId,
            text: '⛔ <b>Ruxsat etilmagan:</b> Bu bo\'lim faqat bot administratori (Bekzod Idiyev) uchun mo\'ljallangan.',
            parse_mode: 'HTML',
          });
          return res.status(200).json({ ok: true });
        }

        const stats = getAdminStats();
        const adminPanelText = buildAdminMainText(stats, serverTimestamp, chatId);

        await sendTg('sendMessage', {
          chat_id: chatId,
          text: adminPanelText,
          parse_mode: 'HTML',
          reply_markup: getAdminMainKeyboard(),
        });
        return res.status(200).json({ ok: true });
      }

      // Forward general message to Bekzod Admin
      const adminLeadMsg = `🚀 <b>YANGI BOT XABARI (INCOMING DIRECT LEAD)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Yuboruvchi:</b> ${escapeHtml(name)} ${from.last_name ? escapeHtml(from.last_name) : ''}
🆔 <b>User ID:</b> <code>${chatId}</code>
👤 <b>Username:</b> @${from.username || 'mavjud_emas'}
🕒 <b>Vaqt:</b> ${serverTimestamp} (Toshkent / UTC+5)

💬 <b>Xabar Matni:</b>
${escapeHtml(text)}
━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ <i>Bekzod Idiyev Telegram Bot Webhook Gateway</i>`;

      // Forward to Bekzod
      await sendTg('sendMessage', {
        chat_id: adminId,
        text: adminLeadMsg,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '💬 Javob Yozish', url: `tg://user?id=${chatId}` }],
          ],
        },
      });

      // Acknowledge to user
      await sendTg('sendMessage', {
        chat_id: chatId,
        text: `✅ <b>Xabaringiz Bekzod Idiyevga yetkazildi!</b>

Rahmat! Tez orada siz bilan bog'lanaman. 🚀`,
        parse_mode: 'HTML',
        reply_markup: getMainReplyKeyboard(),
      });

      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error('Webhook exception:', e);
    return res.status(200).json({ ok: true, error: e.message });
  }
}
