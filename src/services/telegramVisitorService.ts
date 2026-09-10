import { VisitorTelemetryData } from './visitorTelemetry';
import { TelegramSendResult } from './telegramLeadService';
import { buildVisitorTelegramMessage } from './telegramMessageTemplates';

const VISITOR_LOGGED_KEY = 'portfolio_visitor_telemetry_sent';

/**
 * Send Visitor Identification & Telemetry Notification
 */
export async function sendVisitorNotification(
  telemetry: VisitorTelemetryData
): Promise<TelegramSendResult> {
  // Prevent duplicate spam within session if already logged with the same name
  try {
    const sessionKey = `visitor_sent_${telemetry.visitorName}_${telemetry.visitorRole || ''}`;
    if (sessionStorage.getItem(sessionKey)) {
      return { success: true, message: 'Already recorded in this session.' };
    }
    sessionStorage.setItem(sessionKey, 'true');
  } catch {
    // ignore
  }

  // 1. Primary: Call /api/visitor (Vercel Serverless or Vite dev server)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    const apiRes = await fetch('/api/visitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telemetry),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (apiRes.ok) {
      try {
        localStorage.setItem(VISITOR_LOGGED_KEY, Date.now().toString());
      } catch {
        // ignore
      }
      return { success: true, message: 'Visitor logged.' };
    }
  } catch (err) {
    console.warn('/api/visitor unreachable, attempting client direct dispatch...', err);
  }

  // 2. Secondary: Client Direct Dispatch
  const botToken = (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID;

  if (botToken && chatId && botToken !== 'YOUR_TELEGRAM_BOT_TOKEN' && chatId !== 'YOUR_TELEGRAM_CHAT_ID') {
    const { text, inlineKeyboard } = buildVisitorTelegramMessage(telemetry);

    try {
      const clientController = new AbortController();
      const clientTimeout = setTimeout(() => clientController.abort(), 8000);

      const clientResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
          reply_markup: inlineKeyboard,
        }),
        signal: clientController.signal,
      });

      if (telemetry.latitude && telemetry.longitude) {
        fetch(`https://api.telegram.org/bot${botToken}/sendLocation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            latitude: telemetry.latitude,
            longitude: telemetry.longitude,
            disable_notification: true,
          }),
        }).catch(() => {});
      }

      clearTimeout(clientTimeout);

      if (clientResponse.ok) {
        try {
          localStorage.setItem(VISITOR_LOGGED_KEY, Date.now().toString());
        } catch {
          // ignore
        }
        return { success: true, message: 'Visitor logged successfully via client direct.' };
      }
    } catch (e) {
      console.error('Client direct visitor dispatch failed:', e);
    }
  }

  return { success: false, error: 'Unable to dispatch visitor notification.' };
}
