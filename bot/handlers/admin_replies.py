import re
from aiogram import Router, F, Bot
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import Message, CallbackQuery
from bot.handlers.admin_callbacks import is_admin

router = Router()

class AdminReplyState(StatesGroup):
    waiting_for_reply_text = State()

@router.callback_query(F.data.startswith("reply_user_"))
async def cb_reply_user(callback: CallbackQuery, state: FSMContext):
    if not callback.from_user or not is_admin(callback.from_user.id):
        await callback.answer("Ruxsat berilmagan.", show_alert=True)
        return

    target_user_id = callback.data.replace("reply_user_", "")
    await state.update_data(target_user_id=target_user_id)
    await state.set_state(AdminReplyState.waiting_for_reply_text)

    await callback.message.answer(
        f"✍️ <b>Foydalanuvchiga (ID: <code>{target_user_id}</code>) javob yozish:</b>\n"
        f"━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        f"Marhamat, yubormoqchi bo'lgan javobingizni yozing:\n"
        f"<i>(Bekor qilish uchun /cancel)</i>",
        parse_mode="HTML"
    )
    await callback.answer()

@router.message(AdminReplyState.waiting_for_reply_text)
async def process_admin_reply(message: Message, state: FSMContext, bot: Bot):
    user = message.from_user
    if not user or not is_admin(user.id):
        await state.clear()
        return

    if message.text == "/cancel":
        await state.clear()
        await message.answer("❌ Javob yozish bekor qilindi.")
        return

    data = await state.get_data()
    target_user_id = data.get("target_user_id")

    if not target_user_id:
        await state.clear()
        await message.answer("Foydalanuvchi ID topilmadi.")
        return

    reply_text = message.text
    user_msg = f"👨‍💻 <b>BEKZOD IDIYEV SIZGA JAVOB YOZDI:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n{reply_text}\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n💬 <i>Qo'shimcha savol yoki taklifingiz bo'lsa, davom ettirishingiz mumkin.</i>"

    try:
        await bot.send_message(int(target_user_id), user_msg, parse_mode="HTML")
        await message.answer(
            f"✅ <b>Javobingiz foydalanuvchiga (ID: <code>{target_user_id}</code>) muvaffaqiyatli yetkazildi!</b>\n\n"
            f"💬 <i>Yuborilgan xabar:</i>\n\"{reply_text}\"",
            parse_mode="HTML"
        )
    except Exception as e:
        await message.answer(f"⚠️ Xatolik: Javob yetkazilmadi ({e})")

    await state.clear()

@router.message(F.reply_to_message)
async def handle_native_admin_reply(message: Message, bot: Bot):
    user = message.from_user
    if not user or not is_admin(user.id):
        return

    replied = message.reply_to_message
    if not replied or not replied.text:
        return

    match = re.search(r'#user_(\d+)', replied.text) or re.search(r'User ID:\s*(\d+)', replied.text, re.IGNORECASE)
    if not match:
        return

    target_user_id = match.group(1)
    reply_text = message.text

    user_msg = f"👨‍💻 <b>BEKZOD IDIYEV SIZGA JAVOB YOZDI:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n{reply_text}\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n💬 <i>Qo'shimcha savol bo'lsa, davom ettirishingiz mumkin.</i>"

    try:
        await bot.send_message(int(target_user_id), user_msg, parse_mode="HTML")
        await message.answer(
            f"✅ <b>Javobingiz foydalanuvchiga (ID: <code>{target_user_id}</code>) yetkazildi!</b>\n\n"
            f"💬 <i>Yuborilgan xabar:</i>\n\"{reply_text}\"",
            parse_mode="HTML"
        )
    except Exception as e:
        await message.answer(f"⚠️ Xatolik: Javob yetkazilmadi ({e})")
