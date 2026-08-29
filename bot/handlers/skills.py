from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton
from bot.locales import get_text
from bot.utils.db import get_user_language
from bot.config import config

router = Router()

@router.message(Command("skills"))
@router.message(F.text.in_(["🛠️ Stack & Texnologiyalar", "🛠️ Стек & Навыки", "🛠️ Tech Stack"]))
async def handle_skills(message: Message):
    user = message.from_user
    lang = get_user_language(user.id) if user else 'uz'
    text = get_text("skills_text", lang)

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="⚡ Interaktiv Stackni Ko'rish", url=f"{config.PORTFOLIO_URL}/#skills"),
            ]
        ]
    )

    await message.answer(text, reply_markup=kb, parse_mode="HTML")
