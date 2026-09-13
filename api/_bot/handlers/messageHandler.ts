import { escapeHtml, sendTelegram, buildAdminMainText } from '../telegramApi';
import { sendEmailFromBot } from '../email';
import { getMainReplyKeyboard, getAdminMainKeyboard, PORTFOLIO_URL, GITHUB_URL } from '../keyboards';

export interface MessageContext {
  chatId: number | string;
  text: string;
  name: string;
  from: any;
  isAdmin: boolean;
  adminId: string | number;
  botToken: string;
  serverTimestamp: string;
  pendingAdminEmailTarget: string | null;
  pendingAdminReplyTarget: string | number | null;
  setPendingEmail: (val: string | null) => void;
  setPendingReply: (val: string | number | null) => void;
}

export async function handleBotTextMessage(ctx: MessageContext): Promise<void> {
  const {
    chatId, text, name, from, isAdmin, adminId, botToken, serverTimestamp,
    pendingAdminEmailTarget, pendingAdminReplyTarget, setPendingEmail, setPendingReply
  } = ctx;

  const send = (method: string, payload: any) => sendTelegram(botToken, method, payload);

  // Admin reply / email logic
  if (isAdmin) {
    if (text === '/cancel') {
      setPendingReply(null);
      setPendingEmail(null);
      await send('sendMessage', {
        chat_id: chatId,
        text: '❌ <b>Javob yozish bekor qilindi.</b>',
        parse_mode: 'HTML',
      });
      return;
    }

    // Check if replying to an email
    let targetEmail: string | null = pendingAdminEmailTarget;
    if (ctx.from?.reply_to_message?.text) {
      const rep = ctx.from.reply_to_message.text;
      const match = rep.match(/#email_([^\s\n]+)/) || rep.match(/Email:\s*<a href="mailto:([^">]+)">/);
      if (match && match[1]) targetEmail = match[1].trim();
    }

    if (targetEmail) {
      setPendingEmail(null);
      const emailRes = await sendEmailFromBot({
        to: targetEmail,
        subject: 'Re: Bekzod Idiyev — Portfolio Murojaati Bo\'yicha Javob',
        text,
      });
      if (emailRes.success) {
        await send('sendMessage', {
          chat_id: chatId,
          text: `✅ <b>Email xati muvaffaqiyatli yuborildi!</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n📧 <b>Qabul qiluvchi:</b> <code>${escapeHtml(targetEmail)}</code>\n\n💬 <b>Yuborilgan javob:</b>\n"${escapeHtml(text)}"`,
          parse_mode: 'HTML',
        });
      } else {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent('Re: Bekzod Idiyev — Portfolio Javobi')}&body=${encodeURIComponent(text)}`;
        await send('sendMessage', {
          chat_id: chatId,
          text: `⚠️ <b>Server orqali email yuborilmadi:</b> ${escapeHtml(emailRes.error || '')}`,
          parse_mode: 'HTML',
          reply_markup: { inline_keyboard: [[{ text: '✉️ Gmail orqali Yuborish', url: gmailUrl }]] },
        });
      }
      return;
    }

    // Check if replying to a Telegram user
    let targetUser: string | number | null = pendingAdminReplyTarget;
    if (ctx.from?.reply_to_message?.text) {
      const rep = ctx.from.reply_to_message.text;
      const match = rep.match(/#user_(\d+)/) || rep.match(/User ID:\s*(\d+)/i);
      if (match && match[1]) targetUser = match[1];
    }

    if (targetUser) {
      setPendingReply(null);
      const userReceiveMsg = `👨‍💻 <b>BEKZOD IDIYEV SIZGA JAVOB YOZDI:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n${escapeHtml(text)}\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n💬 <i>Qo'shimcha savol yoki taklifingiz bo'lsa, yozishingiz mumkin.</i>`;
      const res = await send('sendMessage', { chat_id: targetUser, text: userReceiveMsg, parse_mode: 'HTML' });
      if (res?.ok) {
        await send('sendMessage', {
          chat_id: chatId,
          text: `✅ <b>Javobingiz foydalanuvchiga (ID: <code>${targetUser}</code>) muvaffaqiyatli yetkazildi!</b>\n\n💬 "${escapeHtml(text)}"`,
          parse_mode: 'HTML',
        });
      } else {
        await send('sendMessage', {
          chat_id: chatId,
          text: `⚠️ <b>Javob yetkazilmadi.</b> (${res?.description || 'Xatolik'})`,
          parse_mode: 'HTML',
        });
      }
      return;
    }
  }

  // Standard commands
  if (text.startsWith('/start') || text.startsWith('/help')) {
    const welcome = `🚀 <b>Assalomu alaykum, ${escapeHtml(name)}!</b>\n\nMen <b>Bekzod Idiyev</b>ning rasmiy portfolio botiman.\nPython Backend Dasturchi & School 21 Data Science Talabasi.\n\nQuyidagi menyulardan birini tanlang:`;
    await send('sendMessage', { chat_id: chatId, text: welcome, parse_mode: 'HTML', reply_markup: getMainReplyKeyboard() });
    return;
  }
  if (text === '👨‍💻 Men Haqimda' || text === '/about') {
    const about = `👨‍💻 <b>BEKZOD IDIYEV — PYTHON BACKEND ARCHITECT</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🏢 <b>Soha:</b> Python Backend Developer & Systems Engineer\n🎓 <b>Ta'lim:</b> School 21 (Data Science & Core Engineering)\n📍 <b>Joylashuv:</b> Buxoro, O'zbekiston (UTC+5)\n\n🎯 <b>Stack:</b> FastAPI, Django, AsyncIO, PostgreSQL, Redis, Docker, Celery`;
    await send('sendMessage', {
      chat_id: chatId,
      text: about,
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: [[{ text: '🌐 3D Portfolioda Ko\'rish', url: `${PORTFOLIO_URL}/#about` }, { text: '🐙 GitHub', url: GITHUB_URL }]] },
    });
    return;
  }
  if (text === '📂 Loyihalarim' || text === '/projects') {
    const proj = `📂 <b>ISHLAB CHIQARISH LOYIHALARI:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n1️⃣ <b>Buddy Team</b> — AI Match\n2️⃣ <b>Esports Tournament Bot</b> — Turnir tizimi\n3️⃣ <b>PeerLearn TMA</b> — Ta'lim Web App`;
    await send('sendMessage', {
      chat_id: chatId,
      text: proj,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Buddy Team', callback_data: 'proj_buddy' }],
          [{ text: '🎮 Esports Bot', callback_data: 'proj_esports' }],
          [{ text: '📚 PeerLearn Mini App', callback_data: 'proj_peerlearn' }],
          [{ text: '🌐 Barcha Loyihalar', url: `${PORTFOLIO_URL}/#projects` }],
        ],
      },
    });
    return;
  }
  if (text === '🛠️ Stack & Texnologiyalar' || text === '/skills') {
    const skills = `🛠️ <b>TEXNOLOGIYALAR VA KO'NIKMALAR:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🐍 Python 3.11+, FastAPI, Django REST, AsyncIO\n🗄️ PostgreSQL, Redis, MongoDB\n⚙️ Docker, Linux, CI/CD, Nginx\n🤖 aiogram 3.x, Telegram Bot API, TMA`;
    await send('sendMessage', {
      chat_id: chatId,
      text: skills,
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: [[{ text: '⚡ Interaktiv Stack', url: `${PORTFOLIO_URL}/#skills` }]] },
    });
    return;
  }
  if (text === '📄 Rezyume / CV' || text === '/cv' || text === '/resume') {
    const cv = `📄 <b>REZYUME / CV SPETSIFIKATSIYASI:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n👤 Bekzod Idiyev\n💼 Python Backend Developer\n📧 bekzodidiyev89@gmail.com\n📱 Telegram: @toyneden`;
    await send('sendMessage', {
      chat_id: chatId,
      text: cv,
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: [[{ text: '🌐 Interaktiv Portfolio', url: PORTFOLIO_URL }, { text: '🐙 GitHub', url: GITHUB_URL }]] },
    });
    return;
  }
  if (text === '✍️ Xabar Qoldirish' || text === '/contact') {
    await send('sendMessage', {
      chat_id: chatId,
      text: `✍️ <b>BEKZOD IDIYEVGA XABAR QOLDIRISH</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\nTaklif yoki savolingizni shu yerga yozing:`,
      parse_mode: 'HTML',
    });
    return;
  }
  if (text === '🌐 Tilni O\'zgartirish' || text === '/language') {
    await send('sendMessage', {
      chat_id: chatId,
      text: `🌐 <b>Iltimos, tilni tanlang:</b>`,
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: [[{ text: '🇺🇿 O\'zbekcha', callback_data: 'setlang_uz' }, { text: '🇷🇺 Русский', callback_data: 'setlang_ru' }, { text: '🇬🇧 English', callback_data: 'setlang_en' }]] },
    });
    return;
  }
  if (text === '/admin') {
    if (!isAdmin) {
      await send('sendMessage', { chat_id: chatId, text: '⛔ Faqat administrator uchun.', parse_mode: 'HTML' });
      return;
    }
    const adminPanelText = await buildAdminMainText(serverTimestamp, chatId);
    await send('sendMessage', { chat_id: chatId, text: adminPanelText, parse_mode: 'HTML', reply_markup: getAdminMainKeyboard() });
    return;
  }

  // Forward incoming lead to Admin
  const adminLead = `🚀 <b>YANGI BOT XABARI (LEAD)</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n👤 <b>Yuboruvchi:</b> ${escapeHtml(name)}\n🆔 <b>User ID:</b> <code>${chatId}</code>\n👤 @${from.username || 'mavjud_emas'}\n🕒 <i>${serverTimestamp}</i>\n\n💬 <b>Xabar:</b>\n${escapeHtml(text)}\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n#user_${chatId}`;
  await send('sendMessage', {
    chat_id: adminId,
    text: adminLead,
    parse_mode: 'HTML',
    reply_markup: { inline_keyboard: [[{ text: '💬 Botdan Javob Qaytarish', callback_data: `reply_user_${chatId}` }], [{ text: '✈️ Profilga O\'tish', url: `tg://user?id=${chatId}` }]] },
  });
  await send('sendMessage', {
    chat_id: chatId,
    text: `✅ <b>Xabaringiz Bekzod Idiyevga yetkazildi!</b>\n\nRahmat! Tez orada javob beraman. 🚀`,
    parse_mode: 'HTML',
    reply_markup: getMainReplyKeyboard(),
  });
}
