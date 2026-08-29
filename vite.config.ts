import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Dev Middleware so /api/contact and /api/visitor work seamlessly during 'npm run dev' locally
function telegramContactDevPlugin(env: Record<string, string>) {
  return {
    name: 'telegram-contact-dev-server',
    configureServer(server: any) {
      // 1. Visitor Telemetry Dev Handler
      server.middlewares.use('/api/visitor', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const {
              visitorName,
              visitorRole,
              isAnonymous,
              ip: clientReportedIp,
              country,
              city,
              region,
              isp,
              networkType,
              networkSpeed,
              rtt,
              deviceType,
              os,
              browser,
              screenResolution,
              viewportSize,
              pixelRatio,
              cpuCores,
              deviceMemory,
              referrerSource,
              landingUrl,
              utmSource,
              siteLanguage,
              browserLanguage,
              timezone,
            } = data;

            const botToken =
              env.TELEGRAM_BOT_TOKEN ||
              env.VITE_TELEGRAM_BOT_TOKEN ||
              process.env.TELEGRAM_BOT_TOKEN ||
              process.env.VITE_TELEGRAM_BOT_TOKEN;
            const chatId =
              env.TELEGRAM_CHAT_ID ||
              env.VITE_TELEGRAM_CHAT_ID ||
              process.env.TELEGRAM_CHAT_ID ||
              process.env.VITE_TELEGRAM_CHAT_ID;

            if (!botToken || !chatId) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, error: 'Telegram Bot Token yoki Chat ID .env faylida topilmadi.' }));
              return;
            }

            const timestamp = new Intl.DateTimeFormat('uz-UZ', {
              timeZone: 'Asia/Samarkand',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }).format(new Date());

            const roleText = visitorRole ? `\n🎯 <b>Maqsad / Rol:</b> ${escapeHtml(visitorRole)}` : '';
            const anonBadge = isAnonymous ? ' <i>(Anonim)</i>' : '';
            const locationParts = [country, city, region].filter(Boolean);
            const locationLine = locationParts.length > 0 ? locationParts.join(', ') : '🌍 Mahalliy (Localhost / Dev)';
            const netDetails = [networkType, networkSpeed, rtt].filter(Boolean).join(' • ');
            const netLine = netDetails ? `\n  • <b>Tarmoq:</b> ${escapeHtml(netDetails)}` : '';
            const ispLine = isp ? `\n  • <b>Provayder:</b> ${escapeHtml(isp)}` : '';
            const hwDetails = [cpuCores, deviceMemory, pixelRatio ? `DPR: ${pixelRatio}` : ''].filter(Boolean).join(' | ');
            const utmLine = utmSource ? `\n  • <b>UTM Kampaniya:</b> <code>${escapeHtml(utmSource)}</code>` : '';

            const telegramHtmlMessage = `👁️ <b>YANGI TASHRIF BUYURUVCHI (PORTFOLIO)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Mehmon:</b> <b>${escapeHtml(visitorName || 'Anonim Tashrif Buyuruvchi')}</b>${anonBadge}${roleText}

🌍 <b>Geolokatsiya & Tarmoq:</b>
  • <b>IP:</b> <code>${escapeHtml(clientReportedIp || '127.0.0.1 (Localhost)')}</code>
  • <b>Manzil:</b> ${escapeHtml(locationLine)}${ispLine}${netLine}

📱 <b>Qurilma & Dasturiy Muhit:</b>
  • <b>Qurilma:</b> ${escapeHtml(deviceType || '💻 Kompyuter')}
  • <b>OS:</b> ${escapeHtml(os || 'Noma\'lum OS')}
  • <b>Brauzer:</b> ${escapeHtml(browser || 'Noma\'lum Brauzer')}
  • <b>Ekran:</b> <code>${escapeHtml(screenResolution || 'Noma\'lum')}</code> (Oyna: ${escapeHtml(viewportSize || '')})
  • <b>Uskuna:</b> ${escapeHtml(hwDetails || 'Standart')}

🧭 <b>Tashrif Manbasi & Kontekst:</b>
  • <b>Qayerdan keldi:</b> ${escapeHtml(referrerSource || 'To\'g\'ridan-to\'g\'ri')}
  • <b>Sayt Tili:</b> 🌐 ${(siteLanguage || 'uz').toUpperCase()} (Brauzer: ${escapeHtml(browserLanguage || 'uz-UZ')})
  • <b>Timezone:</b> ⏱️ ${escapeHtml(timezone || 'Asia/Tashkent')}${utmLine}
  • <b>Sahifa:</b> <code>${escapeHtml(landingUrl || '/')}</code>
  • <b>Vaqt:</b> 🕒 ${timestamp} (Toshkent / UTC+5)
━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ <i>Bekzod Idiyev Portfolio Dev Gateway v2.0</i>`;

            const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: telegramHtmlMessage,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
              }),
            });

            const tgJson = await tgRes.json().catch(() => ({}));

            res.statusCode = tgRes.ok ? 200 : 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                ok: tgRes.ok,
                message: tgRes.ok ? 'Tashrif ma\'lumotlari Telegram botga yetkazildi!' : (tgJson.description || 'Telegram xatosi'),
              })
            );
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: err.message || 'Server xatosi' }));
          }
        });
      });

      // 2. Contact Form Dev Handler
      server.middlewares.use('/api/contact', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const { name, email, message, honeypot, language } = data;

            if (honeypot && typeof honeypot === 'string' && honeypot.trim().length > 0) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true, message: 'Message received.' }));
              return;
            }

            const botToken = env.TELEGRAM_BOT_TOKEN || env.VITE_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
            const chatId = env.TELEGRAM_CHAT_ID || env.VITE_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID;

            if (!botToken || !chatId) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, error: 'Telegram Bot Token yoki Chat ID .env faylida topilmadi.' }));
              return;
            }

            const timestamp = new Intl.DateTimeFormat('uz-UZ', {
              timeZone: 'Asia/Samarkand',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }).format(new Date());

            const cleanText = `🚀 <b>YANGI PORTFOLIO XABARI (LEAD)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Yuboruvchi:</b> ${escapeHtml(name || 'Noma\'lum')}
📧 <b>Email:</b> <code>${escapeHtml(email || 'Noma\'lum')}</code>
🕒 <b>Vaqt:</b> ${timestamp} (Toshkent / UTC+5)
🌐 <b>Sayt tili:</b> ${(language || 'uz').toUpperCase()}
📱 <b>Qurilma:</b> 💻 Localhost Dev Server

💬 <b>Xabar:</b>
${escapeHtml(message || '')}
━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ <i>Bekzod Idiyev Portfolio Dev Gateway</i>`;

            const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email || '')}&su=${encodeURIComponent('Bekzod Idiyev — Portfolio Javobi')}`;

            const contactInlineKeyboard = {
              inline_keyboard: [
                [
                  { text: '✉️ Gmail orqali Javob Yozish', url: gmailComposeUrl },
                ],
                [
                  { text: '🌐 Portfolioni Ko\'rish', url: 'https://bekzod-idiyev-portfolio.vercel.app' },
                  { text: '🐙 GitHub Profil', url: 'https://github.com/bekzodidiye' },
                ],
              ],
            };


            const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: cleanText,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: contactInlineKeyboard,
              }),
            });

            const tgJson = await tgRes.json().catch(() => ({}));

            res.statusCode = tgRes.ok ? 200 : 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              ok: tgRes.ok,
              message: tgRes.ok ? 'Xabaringiz Telegram botga muvaffaqiyatli yetkazildi!' : (tgJson.description || 'Telegram xatosi'),
            }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: err.message || 'Server xatosi' }));
          }
        });
      });

      // 3. Webhook Gateway Dev Handler
      server.middlewares.use('/api/webhook', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true, message: 'Telegram Webhook Gateway Active' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const botToken =
              env.TELEGRAM_BOT_TOKEN ||
              env.VITE_TELEGRAM_BOT_TOKEN ||
              process.env.TELEGRAM_BOT_TOKEN ||
              process.env.VITE_TELEGRAM_BOT_TOKEN;

            if (!botToken) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, error: 'TELEGRAM_BOT_TOKEN is missing' }));
              return;
            }

            const update = JSON.parse(body || '{}');
            const PORTFOLIO_URL = 'https://bekzod-idiyev-portfolio.vercel.app';

            const sendTg = async (method: string, payload: any) => {
              return fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });
            };

            if (update.message) {
              const msg = update.message;
              const chatId = msg.chat?.id;
              const text = msg.text || '';
              const name = msg.from?.first_name || 'Foydalanuvchi';

              if (chatId) {
                if (text.startsWith('/start') || text.startsWith('/help')) {
                  const welcomeText = `🚀 <b>Assalomu alaykum, ${escapeHtml(name)}!</b>\n\nMen <b>Bekzod Idiyev</b>ning rasmiy portfolio botiman.\nPython Backend Dasturchi & School 21 Data Science Talabasi.\n\nQuyidagi menyulardan birini tanlang yoki to'g'ridan-to'g'ri 3D Portfolioni oching:`;
                  await sendTg('sendMessage', {
                    chat_id: chatId,
                    text: welcomeText,
                    parse_mode: 'HTML',
                    reply_markup: {
                      keyboard: [
                        [{ text: '🚀 3D Portfolioni Ochish (Web App)', web_app: { url: PORTFOLIO_URL } }],
                        [{ text: '👨‍💻 Men Haqimda' }, { text: '📂 Loyihalarim' }],
                        [{ text: '🛠️ Stack & Texnologiyalar' }, { text: '📄 Rezyume / CV' }],
                        [{ text: '✍️ Xabar Qoldirish' }, { text: '🌐 Tilni O\'zgartirish' }],
                      ],
                      resize_keyboard: true,
                      is_persistent: true,
                    },
                  });
                }
              }
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          } catch (err: any) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          }
        });
      });
    },

  };
}


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss(), telegramContactDevPlugin(env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-three': ['three'],
            'vendor-motion': ['motion', 'gsap'],
            'vendor-ui': ['lucide-react', 'canvas-confetti'],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
