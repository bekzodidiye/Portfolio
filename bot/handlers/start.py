from aiogram import Router, F
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, CallbackQuery
from bot.keyboards.main_menu import get_main_reply_keyboard, get_main_inline_keyboard
from bot.keyboards.language_kb import get_language_inline_keyboard
from bot.locales import get_text
from bot.utils.db import save_or_update_user, get_user_language, set_user_language

router = Router()

@router.message(CommandStart())
async def cmd_start(message: Message):
    user = message.from_user
    if not user:
        return

    lang = get_user_language(user.id)
    save_or_update_user(user.id, user.username, user.full_name or user.first_name, lang)

    welcome_text = get_text("welcome", lang, name=user.first_name)
    reply_kb = get_main_reply_keyboard(lang)
    inline_kb = get_main_inline_keyboard(lang)

    await message.answer(welcome_text, reply_markup=reply_kb, parse_mode="HTML")

@router.message(Command("language"))
@router.message(F.text.in_(["🌐 Tilni O'zgartirish", "🌐 Сменить Язык", "🌐 Change Language"]))
async def cmd_language(message: Message):
    user = message.from_user
    lang = get_user_language(user.id) if user else 'uz'
    text = get_text("select_language", lang)
    await message.answer(text, reply_markup=get_language_inline_keyboard(), parse_mode="HTML")

@router.callback_query(F.data.startswith("setlang_"))
async def cb_set_language(callback: CallbackQuery):
    lang_code = callback.data.split("_")[1]
    if callback.from_user:
        set_user_language(callback.from_user.id, lang_code)
    
    ack_text = {
        'uz': "✅ Til <b>O'zbekcha</b>ga o'zgartirildi!",
        'ru': "✅ Язык изменен на <b>Русский</b>!",
        'en': "✅ Language updated to <b>English</b>!",
    }.get(lang_code, "✅ Language updated!")

    await callback.message.delete()
    await callback.message.answer(
        ack_text,
        reply_markup=get_main_reply_keyboard(lang_code),
        parse_mode="HTML"
    )
    await callback.answer()
