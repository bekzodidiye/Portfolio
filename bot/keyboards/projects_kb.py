from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

def get_projects_inline_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="🚀 Buddy Team (AI Match)", callback_data="proj_buddy"),
            ],
            [
                InlineKeyboardButton(text="🎮 Esports Tournament Bot", callback_data="proj_esports"),
            ],
            [
                InlineKeyboardButton(text="📚 PeerLearn Mini App", callback_data="proj_peerlearn"),
            ],
            [
                InlineKeyboardButton(text="🌐 Barcha Loyihalarni Ko'rish", url="https://bekzod-idiyev-portfolio.vercel.app/#projects"),
            ],
        ]
    )

def get_single_project_keyboard(github_url: str = "https://github.com/bekzodidiye") -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="🐙 GitHub Kodini Ko'rish", url=github_url),
                InlineKeyboardButton(text="🌐 Veb Portfolioda Ko'rish", url="https://bekzod-idiyev-portfolio.vercel.app/#projects"),
            ],

            [
                InlineKeyboardButton(text="⬅️ Loyihalar Ro'yxatiga Qaytish", callback_data="proj_list"),
            ]
        ]
    )
