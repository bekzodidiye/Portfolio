import nodemailer from 'nodemailer';
import { EmailOptions } from './types';

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function sendEmailFromBot(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const { to, subject, text } = options;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || 'bekzodidiyev89@gmail.com';
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;

  if (!smtpPass) {
    return {
      success: false,
      error: 'SMTP_PASS (Gmail App Password) sozlanmagan. .env yoki Vercel sozlamalariga SMTP_PASS qo\'shing.',
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const formattedHtml = `
    <!DOCTYPE html>
    <html lang="uz">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0d1117; color: #c9d1d9; margin: 0; padding: 20px; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background-color: #161b22; border: 1px solid #30363d; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
        .header { background: linear-gradient(135deg, #1f6feb, #0969da); padding: 24px; color: #ffffff; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
        .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }
        .content { padding: 28px 24px; color: #e6edf3; }
        .greeting { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #58a6ff; }
        .message-box { background-color: #0d1117; border: 1px solid #30363d; padding: 16px 18px; border-radius: 6px; margin: 18px 0; font-size: 15px; color: #f0f6fc; white-space: pre-wrap; word-wrap: break-word; }
        .footer { padding: 20px 24px; background-color: #090d13; border-top: 1px solid #21262d; text-align: center; font-size: 12px; color: #8b949e; }
        .footer a { color: #58a6ff; text-decoration: none; margin: 0 8px; }
        .badge { display: inline-block; background-color: #238636; color: #ffffff; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="badge">Rasmiy Javob</div>
          <h1>BEKZOD IDIYEV</h1>
          <p>Python Backend Architect & Systems Engineer</p>
        </div>
        <div class="content">
          <div class="greeting">Assalomu alaykum!</div>
          <p>Portfolio saytim orqali qoldirgan murojaatingiz uchun minnatdorchilik bildiraman.</p>
          <div class="message-box">${escapeHtml(text)}</div>
          <p>Savollaringiz bo'lsa, ushbu xatga to'g'ridan-to'g'ri javob yozishingiz yoki Telegram orqali bog'lanishingiz mumkin.</p>
        </div>
        <div class="footer">
          <p><b>Bekzod Idiyev</b> • Python Backend Developer</p>
          <p>
            <a href="https://t.me/toyneden">✈️ Telegram: @toyneden</a> • 
            <a href="https://bekzod-idiyev-portfolio.vercel.app">🌐 Portfolio</a> • 
            <a href="https://github.com/bekzodidiye">🐙 GitHub</a>
          </p>
          <p style="margin-top: 10px; color: #484f58;">Ushbu xat portfolio xizmati orqali avtomatlashtirilgan tarzda yuborildi.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const plainText = `${text}\n\n--\nBekzod Idiyev\nPython Backend Developer\nTelegram: @toyneden\nPortfolio: https://bekzod-idiyev-portfolio.vercel.app`;

    await transporter.sendMail({
      from: `"Bekzod Idiyev" <${smtpUser}>`,
      to,
      subject: subject || 'Re: Bekzod Idiyev — Portfolio Murojaati',
      text: plainText,
      html: formattedHtml,
      replyTo: smtpUser,
    });

    return { success: true };
  } catch (err: any) {
    console.error('Nodemailer error:', err);
    return { success: false, error: err.message || 'Email yuborishda xatolik yuz berdi.' };
  }
}
