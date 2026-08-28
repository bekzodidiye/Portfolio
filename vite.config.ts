import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// Dev Middleware so /api/contact works seamlessly during 'npm run dev' locally
function telegramContactDevPlugin(env: Record<string, string>) {
  return {
    name: 'telegram-contact-dev-server',
    configureServer(server: any) {
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
👤 <b>Yuboruvchi:</b> ${name || 'Noma\'lum'}
📧 <b>Email:</b> <code>${email || 'Noma\'lum'}</code>
🕒 <b>Vaqt:</b> ${timestamp} (Toshkent / UTC+5)
🌐 <b>Sayt tili:</b> ${(language || 'uz').toUpperCase()}
📱 <b>Qurilma:</b> 💻 Localhost Dev Server

💬 <b>Xabar:</b>
${message || ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ <i>Bekzod Idiyev Portfolio Dev Gateway</i>`;

            const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: cleanText,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
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
