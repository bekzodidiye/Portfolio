from aiogram import Router, F, Bot
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton
from bot.locales import get_text
from bot.utils.db import get_user_language, record_feedback
from bot.config import config
from bot.keyboards.main_menu import get_main_reply_keyboard

router = Router()

class ContactForm(StatesGroup):
    waiting_for_name = State()
    waiting_for_contact = State()
    waiting_for_message = State()

@router.message(Command("contact"))
@router.message(F.text.in_(["✍️ Xabar Qoldirish", "✍️ Оставить Сообщение", "✍️ Leave a Message"]))
async def handle_contact_start(message: Message, state: FSMContext):
    user = message.from_user
    lang = get_user_language(user.id) if user else 'uz'
    text = get_text("contact_start", lang)
    await state.set_state(ContactForm.waiting_for_name)
    await message.answer(text, parse_mode="HTML")

@router.message(ContactForm.waiting_for_name)
async def process_name(message: Message, state: FSMContext):
    user = message.from_user
    lang = get_user_language(user.id) if user else 'uz'
    name = message.text.strip()
    await state.update_data(name=name)
    await state.set_state(ContactForm.waiting_for_contact)
    text = get_text("contact_ask_contact", lang, name=name)
    await message.answer(text, parse_mode="HTML")

@router.message(ContactForm.waiting_for_contact)
async def process_contact(message: Message, state: FSMContext):
    user = message.from_user
    lang = get_user_language(user.id) if user else 'uz'
    contact_info = message.text.strip()
    await state.update_data(contact=contact_info)
    await state.set_state(ContactForm.waiting_for_message)
    text = get_text("contact_ask_message", lang)
    await message.answer(text, parse_mode="HTML")

@router.message(ContactForm.waiting_for_message)
async def process_message(message: Message, state: FSMContext, bot: Bot):
    user = message.from_user
    lang = get_user_language(user.id) if user else 'uz'
    msg_text = message.text.strip()

    data = await state.get_data()
    sender_name = data.get("name", user.full_name if user else "Mehmon")
    contact_info = data.get("contact", "Noma'lum")

    # Record in database
    if user:
        record_feedback(user.id, sender_name, contact_info, msg_text)

    # Forward to Admin (Bekzod)
    admin_notification = f"""🚀 <b>YANGI TELEGRAM BOT MUROJAATI (LEAD)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Yuboruvchi:</b> {sender_name}
📱 <b>Bog'lanish:</b> <code>{contact_info}</code>
🆔 <b>User ID:</b> <code>{user.id if user else 'N/A'}</code>
👤 <b>Username:</b> @{user.username if user and user.username else "mavjud_emas"}

💬 <b>Xabar Matni:</b>
{msg_text}
━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ <i>Javob berish: ushbu xabarga <b>Reply</b> qiling yoki pastdagi tugmani bosing!</i>
#user_{user.id if user else ''}"""

    admin_kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="💬 Botdan Javob Yozish",
                    callback_data=f"reply_user_{user.id}" if user else "admin_main"
                ),
            ],
            [
                InlineKeyboardButton(
                    text="✈️ Telegram Profiliga O'tish",
                    url=f"tg://user?id={user.id}" if user else "https://t.me"
                ),
            ]
        ]
    )


    for admin_id in config.ADMIN_IDS:
        try:
            await bot.send_message(admin_id, admin_notification, reply_markup=admin_kb, parse_mode="HTML")
        except Exception as e:
            print(f"Error notifying admin {admin_id}: {e}")

    await state.clear()
    success_text = get_text("contact_success", lang)
    await message.answer(
        success_text,
        reply_markup=get_main_reply_keyboard(lang),
        parse_mode="HTML"
    )
