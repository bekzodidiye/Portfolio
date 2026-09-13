import { recordBotUserDb } from './bot/db';
import { sendTelegram } from './bot/telegramApi';
import { handleAdminAndProjectCallbacks } from './bot/handlers/adminCallbacks';
import { handleBotTextMessage } from './bot/handlers/messageHandler';

export const config = {
  runtime: 'nodejs',
};

const ADMIN_CHAT_ID = '5678281376';
const botUserIds = new Set<number | string>([ADMIN_CHAT_ID]);
let totalInteractions = 1;
let pendingAdminReplyTarget: string | number | null = null;
let pendingAdminEmailTarget: string | null = null;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, message: 'Telegram Webhook Gateway Active' });
  }

  const secretToken = process.env.TELEGRAM_SECRET_TOKEN;
  if (secretToken && req.headers['x-telegram-bot-api-secret-token'] !== secretToken) {
    console.warn('Webhook unauthorized access attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const botToken =
      process.env.TELEGRAM_BOT_TOKEN ||
      process.env.VITE_TELEGRAM_BOT_TOKEN ||
      '';

    const adminId =
      process.env.TELEGRAM_CHAT_ID ||
      process.env.VITE_TELEGRAM_CHAT_ID ||
      ADMIN_CHAT_ID;

    const update = req.body || {};
    totalInteractions += 1;

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

      if (fromUser.id) {
        botUserIds.add(fromUser.id);
        const fullName = [fromUser.first_name, fromUser.last_name].filter(Boolean).join(' ') || 'Foydalanuvchi';
        recordBotUserDb({
          userId: fromUser.id,
          username: fromUser.username,
          fullName,
          language: fromUser.language_code || 'uz',
        }).catch(() => {});
      }

      // Handle Direct Email/User reply triggers
      if (data.startsWith('reply_email_')) {
        pendingAdminEmailTarget = data.replace('reply_email_', '');
        pendingAdminReplyTarget = null;
        await sendTelegram(botToken, 'sendMessage', {
          chat_id: chatId,
          text: `📧 <b>Emailga (<code>${pendingAdminEmailTarget}</code>) javob yozish:</b>\n\nMarhamat, javob matnini shu yerga yozing:\n<i>(Bekor qilish: /cancel)</i>`,
          parse_mode: 'HTML',
        });
        await sendTelegram(botToken, 'answerCallbackQuery', { callback_query_id: cb.id });
        return res.status(200).json({ ok: true });
      }

      if (data.startsWith('reply_user_')) {
        pendingAdminReplyTarget = data.replace('reply_user_', '');
        pendingAdminEmailTarget = null;
        await sendTelegram(botToken, 'sendMessage', {
          chat_id: chatId,
          text: `✍️ <b>Foydalanuvchiga (ID: <code>${pendingAdminReplyTarget}</code>) javob yozish:</b>\n\nMarhamat, javobingizni yozing:\n<i>(Bekor qilish: /cancel)</i>`,
          parse_mode: 'HTML',
        });
        await sendTelegram(botToken, 'answerCallbackQuery', { callback_query_id: cb.id });
        return res.status(200).json({ ok: true });
      }

      const result = await handleAdminAndProjectCallbacks(
        data,
        serverTimestamp,
        chatId,
        botToken,
        botUserIds.size,
        totalInteractions
      );

      if (result && chatId && messageId) {
        await sendTelegram(botToken, 'editMessageText', {
          chat_id: chatId,
          message_id: messageId,
          text: result.text,
          parse_mode: 'HTML',
          reply_markup: result.markup,
        });
      }

      await sendTelegram(botToken, 'answerCallbackQuery', { callback_query_id: cb.id });
      return res.status(200).json({ ok: true });
    }

    // 2. Handle Text Messages
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat?.id;
      const text = msg.text || '';
      const from = msg.from || {};
      const name = from.first_name || 'Foydalanuvchi';
      const isAdmin = String(chatId) === String(adminId) || String(chatId) === ADMIN_CHAT_ID;

      if (!chatId) return res.status(200).json({ ok: true });

      botUserIds.add(chatId);
      const fullName = [from.first_name, from.last_name].filter(Boolean).join(' ') || name;
      recordBotUserDb({
        userId: chatId,
        username: from.username,
        fullName,
        language: from.language_code || 'uz',
      }).catch(() => {});

      await handleBotTextMessage({
        chatId,
        text,
        name,
        from,
        isAdmin,
        adminId,
        botToken,
        serverTimestamp,
        pendingAdminEmailTarget,
        pendingAdminReplyTarget,
        setPendingEmail: (v) => { pendingAdminEmailTarget = v; },
        setPendingReply: (v) => { pendingAdminReplyTarget = v; },
      });

      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error('Webhook safe catch exception:', e);
    return res.status(200).json({ ok: true, error: e?.message });
  }
}
