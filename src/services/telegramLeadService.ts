// Contact lead service — server-side only via /api/contact

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
  language?: string;
}

export interface TelegramSendResult {
  success: boolean;
  message?: string;
  error?: string;
  directTelegramUrl?: string;
}

const RATE_LIMIT_KEY = 'portfolio_last_contact_ts';
const COOLDOWN_SECONDS = 45;

/**
 * Check if the user is currently rate-limited (sent a message in the last N seconds)
 */
export function getRemainingCooldown(): number {
  try {
    const lastSent = localStorage.getItem(RATE_LIMIT_KEY);
    if (!lastSent) return 0;
    const elapsed = (Date.now() - parseInt(lastSent, 10)) / 1000;
    if (elapsed < COOLDOWN_SECONDS) {
      return Math.ceil(COOLDOWN_SECONDS - elapsed);
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Generate a direct Telegram DM URL with pre-filled message
 */
export function generateDirectTelegramUrl(payload: ContactPayload): string {
  const text = `Salom Bekzod! Portfoliongiz orqali bog'lanmoqdaman:

👤 Ismim: ${payload.name}
📧 Email: ${payload.email}
📝 Xabar: ${payload.message}`;

  return `https://t.me/toyneden?text=${encodeURIComponent(text)}`;
}

/**
 * Send contact lead:
 * 1. Tries /api/contact (Works in Vercel Serverless and local Vite dev server via middleware).
 * 2. If /api/contact is unavailable, directly calls Telegram API via client-side fetch.
 * 3. If network fails, provides direct link to Telegram DM.
 */
export async function sendTelegramLead(payload: ContactPayload): Promise<TelegramSendResult> {
  const directUrl = generateDirectTelegramUrl(payload);

  // 1. Anti-Spam Honeypot Check
  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    console.warn('Spam bot detected via honeypot trap.');
    return { success: true };
  }

  // 2. Client-Side Rate Limit Check
  const remainingCooldown = getRemainingCooldown();
  if (remainingCooldown > 0) {
    return {
      success: false,
      error: `Iltimos, yangi xabar yuborishdan oldin ${remainingCooldown} soniya kuting.`,
      directTelegramUrl: directUrl,
    };
  }

  // 3. Primary Path: Call /api/contact
  try {
    const serverlessController = new AbortController();
    const serverlessTimeout = setTimeout(() => serverlessController.abort(), 8000);

    const apiResponse = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: serverlessController.signal,
    });

    clearTimeout(serverlessTimeout);

    const contentType = apiResponse.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await apiResponse.json().catch(() => ({}));
      if (apiResponse.ok && data.ok) {
        try {
          localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
        } catch {
          // ignore
        }
        return {
          success: true,
          message: data.message || 'Xabaringiz Telegram botga muvaffaqiyatli yetkazildi!',
        };
      } else if (!apiResponse.ok && data.error) {
        return {
          success: false,
          error: data.error,
          directTelegramUrl: directUrl,
        };
      }
    }
  } catch (serverlessErr) {
    console.warn('API endpoint unreachable, trying client fallback...', serverlessErr);
  }

  // 4. If server API was unreachable, provide direct Telegram DM link
  return {
    success: false,
    error: 'Telegram Botga ulanib bo\'lmadi. To\'g\'ridan-to\'g\'ri Telegram profilingiz orqali yozishingiz mumkin.',
    directTelegramUrl: directUrl,
  };
}
