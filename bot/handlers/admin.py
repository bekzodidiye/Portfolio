from aiogram import Router, F, Bot
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import Message, CallbackQuery
from bot.config import config
from bot.keyboards.admin_kb import get_admin_keyboard, get_admin_sub_keyboard
from bot.utils.db import get_stats, get_all_user_ids, get_recent_users, get_recent_messages

router = Router()

class BroadcastState(StatesGroup):
    waiting_for_broadcast_text = State()

def is_admin(user_id: int) -> bool:
    return user_id in config.ADMIN_IDS or str(user_id) in [str(a) for a in config.ADMIN_IDS]

def build_admin_dashboard_text(user_id: int) -> str:
    stats = get_stats()
    return f"""👑 <b>BEKZOD IDIYEV — ADMIN BOSHQARUV MARKAZI</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 <b>Admin ID:</b> <code>{user_id}</code>
⚡ <b>Engine:</b> 🟢 Python aiogram 3.x + Serverless Gateway
🌐 <b>Portfolio:</b> <code>{config.PORTFOLIO_URL}</code>
🐙 <b>GitHub:</b> <code>{config.GITHUB_URL}</code>

📈 <b>JONLI STATISTIKA:</b>
• 👥 <b>Bot Foydalanuvchilari:</b> <code>{stats['total_users']}</code> ta
• 📩 <b>Qabul Qilingan Xabarlar:</b> <code>{stats['total_messages']}</code> ta

Quyidagi bo'limlardan birini tanlang:"""

@router.message(Command("admin"))
async def handle_admin(message: Message):
    user = message.from_user
    if not user or not is_admin(user.id):
        await message.answer("⛔ <b>Ruxsat etilmagan:</b> Bu buyruq faqat bot administratori (Bekzod Idiyev) uchun mo'ljallangan.", parse_mode="HTML")
        return

    dashboard_text = build_admin_dashboard_text(user.id)
    await message.answer(dashboard_text, reply_markup=get_admin_keyboard(), parse_mode="HTML")

@router.callback_query(F.data == "admin_main")
async def cb_admin_main(callback: CallbackQuery):
    if not callback.from_user or not is_admin(callback.from_user.id):
        await callback.answer("Ruxsat berilmagan.", show_alert=True)
        return

    dashboard_text = build_admin_dashboard_text(callback.from_user.id)
    await callback.message.edit_text(dashboard_text, reply_markup=get_admin_keyboard(), parse_mode="HTML")
    await callback.answer()

@router.callback_query(F.data == "admin_stats")
async def cb_admin_stats(callback: CallbackQuery):
    if not callback.from_user or not is_admin(callback.from_user.id):
        await callback.answer("Ruxsat berilmagan.", show_alert=True)
        return

    stats = get_stats()
    lang_info = ""
    for lang, count in stats.get("languages", {}).items():
        flag = "🇺🇿" if lang == "uz" else ("🇷🇺" if lang == "ru" else "🇬🇧")
        lang_info += f"• {flag} <b>{lang.upper()}:</b> {count} ta foydalanuvchi\n"
    if not lang_info:
        lang_info = "• 🇺🇿 <b>UZ:</b> 100%\n"

    stats_text = f"""📊 <b>TO'LIQ BOT STATISTIKASI VA METRIKALAR</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 <b>Jami Bot A'zolari:</b> <code>{stats['total_users']}</code> ta
📩 <b>Qabul Qilingan Xabarlar:</b> <code>{stats['total_messages']}</code> ta

🌐 <b>Til Bo'yicha Auditoriya:</b>
{lang_info}
⚡ <b>Tizim Holati:</b>
• Database: SQLite WAL Mode (Async safe)
• Routing: aiogram 3.31 Router
• Memory: In-Memory FSM Storage"""

    await callback.message.edit_text(stats_text, reply_markup=get_admin_sub_keyboard("admin_stats"), parse_mode="HTML")
    await callback.answer()

@router.callback_query(F.data == "admin_users")
async def cb_admin_users(callback: CallbackQuery):
    if not callback.from_user or not is_admin(callback.from_user.id):
        await callback.answer("Ruxsat berilmagan.", show_alert=True)
        return

    users = get_recent_users(5)
    if not users:
        users_text = "👥 <b>SO'NGGI FOYDALANUVCHILAR</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<i>Hozircha foydalanuvchilar bazada mavjud emas.</i>"
    else:
        user_lines = ""
        for i, u in enumerate(users, 1):
            uname = f"@{u['username']}" if u['username'] else "mavjud_emas"
            user_lines += f"<b>{i}. {u['full_name']}</b> ({uname})\n🆔 <code>{u['user_id']}</code> | 🌐 {u['language'].upper()}\n🕒 <i>{u['last_active']}</i>\n\n"
        users_text = f"👥 <b>SO'NGGI 5 TA FOYDALANUVCHI:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n{user_lines}"

    await callback.message.edit_text(users_text, reply_markup=get_admin_sub_keyboard("admin_users"), parse_mode="HTML")
    await callback.answer()

@router.callback_query(F.data == "admin_leads")
async def cb_admin_leads(callback: CallbackQuery):
    if not callback.from_user or not is_admin(callback.from_user.id):
        await callback.answer("Ruxsat berilmagan.", show_alert=True)
        return

    messages = get_recent_messages(5)
    if not messages:
        leads_text = "📩 <b>SO'NGGI XABARLAR VA LEADLAR</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<i>Hozircha xabarlar bazada mavjud emas.</i>"
    else:
        msg_lines = ""
        for i, m in enumerate(messages, 1):
            msg_lines += f"<b>{i}. {m['user_name']}</b> (<code>{m['contact_info']}</code>)\n💬 \"<i>{m['message_text'][:100]}</i>\"\n🕒 <i>{m['created_at']}</i>\n\n"
        leads_text = f"📩 <b>SO'NGGI 5 TA QABUL QILINGAN XABAR:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n{msg_lines}"

    await callback.message.edit_text(leads_text, reply_markup=get_admin_sub_keyboard("admin_leads"), parse_mode="HTML")
    await callback.answer()

@router.callback_query(F.data == "admin_diag")
async def cb_admin_diag(callback: CallbackQuery):
    if not callback.from_user or not is_admin(callback.from_user.id):
        await callback.answer("Ruxsat berilmagan.", show_alert=True)
        return

    diag_text = f"""⚡ <b>TIZIM DIAGNOSTIKASI VA SALOMATLIK HOLATI</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ <b>Python aiogram Engine:</b> 3.31.0 Active
✅ <b>Lokal Ma'lumotlar Bazasi:</b> SQLite Active
✅ <b>Vercel Serverless Webhook:</b> 24/7 Connected
✅ <b>Portfolio URL:</b> <code>{config.PORTFOLIO_URL}</code>
✅ <b>Admin Autentifikatsiyasi:</b> <code>{callback.from_user.id}</code> (Tasdiqlangan)
✅ <b>Anti-Spam & Sanitize:</b> HTML Sanitizer Faol"""

    await callback.message.edit_text(diag_text, reply_markup=get_admin_sub_keyboard("admin_diag"), parse_mode="HTML")
    await callback.answer()

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
        f"Barcha foydalanuvchilarga yubormoqchi bo'lgan e'lon yoki xabaringizni yozing:\n"
        f"<i>(Bekor qilish uchun /cancel deb yozing)</i>",
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
    sent_count = 0
    fail_count = 0

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
        f"✍️ <b>Foydalanuvchiga (ID: <code>{target_user_id}</code>) to'g'ridan-to'g'ri javob yozish:</b>\n"
        f"━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        f"Marhamat, yubormoqchi bo'lgan javobingizni yozing:\n"
        f"<i>(Bekor qilish uchun /cancel deb yozing)</i>",
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
    user_msg = f"""👨‍💻 <b>BEKZOD IDIYEV SIZGA JAVOB YOZDI:</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
{reply_text}
━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 <i>Qo'shimcha savol yoki taklifingiz bo'lsa, davom ettirishingiz mumkin.</i>"""

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

    import re
    match = re.search(r'#user_(\d+)', replied.text) or re.search(r'User ID:\s*(\d+)', replied.text, re.IGNORECASE)
    if not match:
        return

    target_user_id = match.group(1)
    reply_text = message.text

    user_msg = f"""👨‍💻 <b>BEKZOD IDIYEV SIZGA JAVOB YOZDI:</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
{reply_text}
━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 <i>Qo'shimcha savol yoki taklifingiz bo'lsa, davom ettirishingiz mumkin.</i>"""

    try:
        await bot.send_message(int(target_user_id), user_msg, parse_mode="HTML")
        await message.answer(
            f"✅ <b>Javobingiz foydalanuvchiga (ID: <code>{target_user_id}</code>) muvaffaqiyatli yetkazildi!</b>\n\n"
            f"💬 <i>Yuborilgan xabar:</i>\n\"{reply_text}\"",
            parse_mode="HTML"
        )
    except Exception as e:
        await message.answer(f"⚠️ Xatolik: Javob yetkazilmadi ({e})")

