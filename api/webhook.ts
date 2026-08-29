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

const PORTFOLIO_URL = 'https://bekzod-idiyev.vercel.app';
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

    // 1. Handle Callback Queries (Inline buttons)
    if (update.callback_query) {
      const cb = update.callback_query;
      const data = cb.data || '';
      const chatId = cb.message?.chat?.id;
      const messageId = cb.message?.message_id;

      let responseText = '';
      let replyMarkup: any = undefined;

      if (data === 'proj_buddy') {
        responseText = `🚀 <b>BUDDY TEAM — AI MENTOR MATCHMAKING</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 <b>Tavsif:</b> Dasturchilar va mentorlarni ko'nikmalari asosida aqlli moslashtiruvchi backend tizimi.
🛠️ <b>Stack:</b> FastAPI, PostgreSQL, Redis, Docker, Pytest
⚡ <b>Imkoniyatlar:</b>
• Asinxron match algoritmi
• JWT RBAC xavfsizlik protokoli
• 0.05s o'rtacha API javob tezligi`;

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
🎯 <b>Tavsif:</b> Kiber-sport musobaqalarini to'liq avtomatlashtiruvchi Telegram bot dvigateli.
🛠️ <b>Stack:</b> Python, aiogram 3.x, PostgreSQL, Redis, Docker
⚡ <b>Imkoniyatlar:</b>
• Bracket generator (avtomatik setka tuzish)
• To'lov va ro'yxatdan o'tish tekshiruvi
• 5000+ faol kiber-sportchilar bilan sinovdan o'tgan`;

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

      // Contact or general message forward
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

      // Forward general message to Bekzod Admin
      const timestamp = new Intl.DateTimeFormat('uz-UZ', {
        timeZone: 'Asia/Samarkand',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date());

      const adminLeadMsg = `🚀 <b>YANGI BOT XABARI (INCOMING DIRECT LEAD)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Yuboruvchi:</b> ${escapeHtml(name)} ${from.last_name ? escapeHtml(from.last_name) : ''}
🆔 <b>User ID:</b> <code>${chatId}</code>
👤 <b>Username:</b> @${from.username || 'mavjud_emas'}
🕒 <b>Vaqt:</b> ${timestamp} (Toshkent / UTC+5)

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
