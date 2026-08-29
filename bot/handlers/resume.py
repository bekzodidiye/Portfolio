from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton
from bot.locales import get_text
from bot.utils.db import get_user_language
from bot.config import config

router = Router()

@router.message(Command("cv"))
@router.message(Command("resume"))
@router.message(F.text.in_(["📄 Rezyume / CV", "📄 Резюме / CV", "📄 Resume / CV"]))
async def handle_resume(message: Message):
    user = message.from_user
    lang = get_user_language(user.id) if user else 'uz'
    text = get_text("cv_text", lang)

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="🌐 Interaktiv CV Spec", url=f"{config.PORTFOLIO_URL}"),
                InlineKeyboardButton(text="🐙 GitHub Profile", url=config.GITHUB_URL),
            ]
        ]
    )

    await message.answer(text, reply_markup=kb, parse_mode="HTML")
