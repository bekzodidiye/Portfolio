from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton
from bot.locales import get_text
from bot.utils.db import get_user_language
from bot.config import config

router = Router()

@router.message(Command("about"))
@router.message(F.text.in_(["👨‍💻 Men Haqimda", "👨‍💻 Обо Мне", "👨‍💻 About Me"]))
async def handle_about(message: Message):
    user = message.from_user
    lang = get_user_language(user.id) if user else 'uz'
    text = get_text("about_text", lang)

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="🌐 3D Portfolioda Ko'rish", url=f"{config.PORTFOLIO_URL}/#about"),
                InlineKeyboardButton(text="🐙 GitHub Profil", url=config.GITHUB_URL),
            ]
        ]
    )

    await message.answer(text, reply_markup=kb, parse_mode="HTML")
