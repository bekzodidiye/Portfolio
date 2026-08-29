import nodemailer from 'nodemailer';

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  clientName?: string;
}

export async function sendEmailDirect(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, subject, text, clientName } = options;

  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || 'bekzodidiyev89@gmail.com';
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;

  // 1. If SMTP password is not set, report clear diagnostic message
  if (!smtpPass) {
    return {
      success: false,
      error: 'SMTP_PASS (Gmail App Password) sozlanmagan. Iltimos, .env yoki Vercel Environment Variables ga SMTP_PASS yoki GMAIL_APP_PASSWORD ni qo\'shing.',
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for 587
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const formattedHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #222222; line-height: 1.6; white-space: pre-wrap;">
${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}

<br><br>
--<br>
<b>Bekzod Idiyev</b><br>
Python Backend Developer<br>
Telegram: <a href="https://t.me/toyneden" style="color: #0969da; text-decoration: none;">@toyneden</a><br>
Portfolio: <a href="https://bekzod-idiyev-portfolio.vercel.app" style="color: #0969da; text-decoration: none;">bekzod-idiyev-portfolio.vercel.app</a>
    </div>
    `;

    const plainText = `${text}

--
Bekzod Idiyev
Python Backend Developer
Telegram: @toyneden
Portfolio: https://bekzod-idiyev-portfolio.vercel.app`;

    const info = await transporter.sendMail({
      from: `"Bekzod Idiyev" <${smtpUser}>`,
      to,
      subject: subject || 'Re: Bekzod Idiyev — Portfolio Murojaati',
      text: plainText,
      html: formattedHtml,
      replyTo: smtpUser,
    });


    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error('Nodemailer send error:', err);
    return {
      success: false,
      error: err.message || 'Email yuborishda xatolik yuz berdi.',
    };
  }
}

export default async function handler(req: any, res: any) {
  return res.status(200).json({ ok: true, message: 'Email Service Endpoint Ready' });
}

