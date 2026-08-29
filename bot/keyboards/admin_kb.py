from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

def get_admin_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="📊 To'liq Analitika", callback_data="admin_stats"),
                InlineKeyboardButton(text="👥 So'nggi Foydalanuvchilar", callback_data="admin_users"),
            ],
            [
                InlineKeyboardButton(text="📩 So'nggi Xabarlar", callback_data="admin_leads"),
                InlineKeyboardButton(text="⚡ Tizim Diagnostikasi", callback_data="admin_diag"),
            ],
            [
                InlineKeyboardButton(text="📢 Xabar Tarqatish (Broadcast)", callback_data="admin_broadcast"),
            ],
            [
                InlineKeyboardButton(text="🌐 Portfolioni Tekshirish", url="https://bekzod-idiyev-portfolio.vercel.app"),
                InlineKeyboardButton(text="🐙 GitHub Repozitoriya", url="https://github.com/bekzodidiye/Portfolio"),
            ]
        ]
    )

def get_admin_sub_keyboard(current_tab: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="🔄 Yangilash", callback_data=current_tab),
                InlineKeyboardButton(text="⬅️ Admin Panelga Qaytish", callback_data="admin_main"),
            ]
        ]
    )
