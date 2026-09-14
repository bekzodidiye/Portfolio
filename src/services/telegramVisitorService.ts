import { VisitorTelemetryData } from './visitorTelemetry';
import { TelegramSendResult } from './telegramLeadService';

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

  return { success: false, error: 'Unable to dispatch visitor notification.' };
}
