from aiogram import Router, F, Bot
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import Message, CallbackQuery
from bot.config import config
from bot.keyboards.admin_kb import get_admin_keyboard
from bot.utils.db import get_stats, get_all_user_ids

router = Router()

class BroadcastState(StatesGroup):
    waiting_for_broadcast_text = State()

def is_admin(user_id: int) -> bool:
    return user_id in config.ADMIN_IDS or str(user_id) in [str(a) for a in config.ADMIN_IDS]

@router.message(Command("admin"))
async def handle_admin(message: Message):
    user = message.from_user
    if not user or not is_admin(user.id):
        await message.answer("⛔ <b>Ruxsat etilmagan:</b> Bu buyruq faqat bot administratori uchun mo'ljallangan.", parse_mode="HTML")
        return

    stats = get_stats()
    admin_text = f"""👑 <b>BEKZOD IDIYEV — ADMIN BOSHQARUV PANELI</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 <b>Jami Bot Foydalanuvchilari:</b> <code>{stats['total_users']}</code> ta
📩 <b>Qabul Qilingan Xabarlar:</b> <code>{stats['total_messages']}</code> ta

Quyidagi amallardan birini tanlang:"""

    await message.answer(admin_text, reply_markup=get_admin_keyboard(), parse_mode="HTML")

@router.callback_query(F.data == "admin_stats")
async def cb_admin_stats(callback: CallbackQuery):
    if not callback.from_user or not is_admin(callback.from_user.id):
        await callback.answer("Ruxsat berilmagan.", show_alert=True)
        return


    stats = get_stats()
    stats_text = f"""📊 <b>JONLI STATISTIKA</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 Bot a'zolari: <b>{stats['total_users']}</b>
📩 Xabarlar/Leadlar: <b>{stats['total_messages']}</b>
⚡ Holat: 🟢 Online (aiogram 3.x)"""

    await callback.message.edit_text(stats_text, reply_markup=get_admin_keyboard(), parse_mode="HTML")
    await callback.answer()

@router.callback_query(F.data == "admin_broadcast")
async def cb_admin_broadcast(callback: CallbackQuery, state: FSMContext):
    if not callback.from_user or callback.from_user.id not in config.ADMIN_IDS:
        await callback.answer("Ruxsat berilmagan.", show_alert=True)
        return

    await state.set_state(BroadcastState.waiting_for_broadcast_text)
    await callback.message.answer(
        "📢 <b>Barcha foydalanuvchilarga yuboriladigan xabar matnini kiriting:</b>\n<i>(Bekor qilish uchun /cancel deb yozing)</i>",
        parse_mode="HTML"
    )
    await callback.answer()

@router.message(BroadcastState.waiting_for_broadcast_text)
async def process_broadcast(message: Message, state: FSMContext, bot: Bot):
    if not message.from_user or message.from_user.id not in config.ADMIN_IDS:
        await state.clear()
        return

    if message.text == "/cancel":
        await state.clear()
        await message.answer("❌ Xabar tarqatish bekor qilindi.")
        return

    broadcast_text = message.text
    user_ids = get_all_user_ids()
    sent_count = 0
    fail_count = 0

    status_msg = await message.answer(f"⏳ Xabar tarqatilmoqda... (0/{len(user_ids)})")

    for uid in user_ids:
        try:
            await bot.send_message(uid, broadcast_text, parse_mode="HTML")
            sent_count += 1
        except Exception:
            fail_count += 1

    await status_msg.edit_text(
        f"✅ <b>Xabar muvaffaqiyatli tarqatildi!</b>\n\n• Yetib bordi: <b>{sent_count}</b>\n• Yetib bormadi (bloklagan): <b>{fail_count}</b>",
        parse_mode="HTML"
    )
    await state.clear()
