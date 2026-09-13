export const PORTFOLIO_URL = 'https://bekzod-idiyev-portfolio.vercel.app';
export const GITHUB_URL = 'https://github.com/bekzodidiye';

export function getMainReplyKeyboard() {
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

export function getAdminMainKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '🌐 Portfolio Tashriflari', callback_data: 'admin_visitors' },
        { text: '👁️ So\'nggi Mehmonlar', callback_data: 'admin_recent_visitors' },
      ],
      [
        { text: '📊 Bot Analitikasi', callback_data: 'admin_stats' },
        { text: '⚡ Tizim Diagnostikasi', callback_data: 'admin_diag' },
      ],
      [
        { text: '👥 Bot Foydalanuvchilari', callback_data: 'admin_users' },
        { text: '📩 So\'nggi Xabarlar', callback_data: 'admin_leads' },
      ],
      [
        { text: '🌍 Geografiya & Manbalar', callback_data: 'admin_geo' },
        { text: '📢 Xabar Tarqatish', callback_data: 'admin_broadcast' },
      ],
      [
        { text: '🌐 Portfolioni Ochish', url: PORTFOLIO_URL },
        { text: '🐙 GitHub Repo', url: 'https://github.com/bekzodidiye/Portfolio' },
      ],
    ],
  };
}

export function getAdminSubKeyboard(currentTab: string) {
  return {
    inline_keyboard: [
      [
        { text: '🔄 Yangilash', callback_data: currentTab },
        { text: '⬅️ Boshqaruv Paneliga Qaytish', callback_data: 'admin_main' },
      ],
    ],
  };
}

export function getProjectDetailKeyboard(projId: string) {
  return {
    inline_keyboard: [
      [
        { text: '🐙 GitHub Kodi', url: GITHUB_URL },
        { text: '🌐 Portfolioda Ko\'rish', url: `${PORTFOLIO_URL}/#projects` },
      ],
      [{ text: '⬅️ Loyihalar Ro\'yxatiga Qaytish', callback_data: 'proj_list' }],
    ],
  };
}

export function getProjectListKeyboard() {
  return {
    inline_keyboard: [
      [{ text: '🚀 Buddy Team (AI Match)', callback_data: 'proj_buddy' }],
      [{ text: '🎮 Esports Tournament Bot', callback_data: 'proj_esports' }],
      [{ text: '📚 PeerLearn Mini App', callback_data: 'proj_peerlearn' }],
      [{ text: '🌐 Barcha Loyihalarni Ko\'rish', url: `${PORTFOLIO_URL}/#projects` }],
    ],
  };
}
