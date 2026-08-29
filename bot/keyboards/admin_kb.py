from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

def get_admin_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="📊 Jonli Statistika", callback_data="admin_stats"),
                InlineKeyboardButton(text="📢 Xabar Tarqatish", callback_data="admin_broadcast"),
            ],
            [
                InlineKeyboardButton(text="🌐 Portfolioni Tekshirish", url="https://bekzod-idiyev.vercel.app"),
                InlineKeyboardButton(text="🐙 GitHub Repozitoriya", url="https://github.com/bekzodidiye/Portfolio"),
            ]
        ]
    )
