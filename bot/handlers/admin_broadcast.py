from aiogram import Router, F, Bot
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import Message, CallbackQuery
from bot.keyboards.admin_kb import get_admin_keyboard
from bot.utils.db import get_all_user_ids
from bot.handlers.admin_callbacks import is_admin

router = Router()

class BroadcastState(StatesGroup):
    waiting_for_broadcast_text = State()

@router.callback_query(F.data == "admin_broadcast")
async def cb_admin_broadcast(callback: CallbackQuery, state: FSMContext):
    if not callback.from_user or not is_admin(callback.from_user.id):
        await callback.answer("Ruxsat berilmagan.", show_alert=True)
        return
    user_ids = get_all_user_ids()
    await state.set_state(BroadcastState.waiting_for_broadcast_text)
    await callback.message.answer(
        f"📢 <b>XABAR TARQATISH (BROADCAST)</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        f"Auditoriya: <b>{len(user_ids)}</b> ta bot a'zolari.\n\n"
        f"Barcha foydalanuvchilarga yubormoqchi bo'lgan e'loningizni yozing:\n"
        f"<i>(Bekor qilish uchun /cancel)</i>",
        parse_mode="HTML"
    )
    await callback.answer()

@router.message(BroadcastState.waiting_for_broadcast_text)
async def process_broadcast(message: Message, state: FSMContext, bot: Bot):
    user = message.from_user
    if not user or not is_admin(user.id):
        await state.clear()
        return

    if message.text == "/cancel":
        await state.clear()
        await message.answer("❌ Xabar tarqatish bekor qilindi.")
        return

    text_to_send = message.text
    if not text_to_send:
        await message.answer("Iltimos, matn yuboring.")
        return

    user_ids = get_all_user_ids()
    sent_count, fail_count = 0, 0
    await message.answer(f"⏳ <b>Xabar yuborilmoqda:</b> 0/{len(user_ids)}...", parse_mode="HTML")

    for uid in user_ids:
        try:
            await bot.send_message(uid, f"📢 <b>BEKZOD IDIYEV — RASMIY E'LON:</b>\n\n{text_to_send}", parse_mode="HTML")
            sent_count += 1
        except Exception:
            fail_count += 1

    await state.clear()
    await message.answer(
        f"✅ <b>Xabar tarqatish yakunlandi!</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        f"📨 Yetkazildi: <b>{sent_count}</b> ta\n"
        f"❌ Yetkazilmadi: <b>{fail_count}</b> ta",
        reply_markup=get_admin_keyboard(),
        parse_mode="HTML"
    )
