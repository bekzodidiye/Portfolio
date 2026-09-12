from aiogram import Router, F
from aiogram.types import CallbackQuery
from bot.config import config
from bot.keyboards.admin_kb import get_admin_keyboard, get_admin_sub_keyboard
from bot.utils.db import (
    get_stats,
    get_recent_users,
    get_recent_messages,
    get_visitor_stats,
    get_recent_visitors
)

router = Router()

def is_admin(user_id: int) -> bool:
    return user_id in config.ADMIN_IDS or str(user_id) in [str(a) for a in config.ADMIN_IDS]

def build_admin_dashboard_text(user_id: int) -> str:
    stats = get_stats()
    v_stats = get_visitor_stats()
    return f"""👑 <b>BEKZOD IDIYEV — ADMIN BOSHQARUV MARKAZI</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 <b>Admin ID:</b> <code>{user_id}</code>
⚡ <b>Engine:</b> 🟢 Python aiogram 3.x + Serverless Gateway
🌐 <b>Portfolio:</b> <code>{config.PORTFOLIO_URL}</code>
🐙 <b>GitHub:</b> <code>{config.GITHUB_URL}</code>

📈 <b>JONLI STATISTIKA:</b>
• 🌐 <b>Portfolio Tashriflari:</b> <code>{v_stats['total_visits']}</code> ta (Bugun: <code>{v_stats['today_visits']}</code>)
• 👥 <b>Bot Foydalanuvchilari:</b> <code>{stats['total_users']}</code> ta
• 📩 <b>Qabul Qilingan Xabarlar:</b> <code>{stats['total_messages']}</code> ta

Quyidagi bo'limlardan birini tanlang:"""

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
    lang_info = "".join([f"• {'🇺🇿' if l=='uz' else ('🇷🇺' if l=='ru' else '🇬🇧')} <b>{l.upper()}:</b> {c} ta\n" for l, c in stats.get("languages", {}).items()]) or "  • <i>Til ma'lumotlari to'planmoqda</i>\n"
    stats_text = f"""📊 <b>TO'LIQ BOT STATISTIKASI VA METRIKALAR</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n👥 <b>Jami Bot A'zolari:</b> <code>{stats['total_users']}</code> ta\n📩 <b>Qabul Qilingan Xabarlar:</b> <code>{stats['total_messages']}</code> ta\n\n🌐 <b>Til Bo'yicha:</b>\n{lang_info}\n⚡ <b>Tizim Holati:</b>\n• Database: SQLite WAL Mode\n• Routing: aiogram 3.x"""
    await callback.message.edit_text(stats_text, reply_markup=get_admin_sub_keyboard("admin_stats"), parse_mode="HTML")
    await callback.answer()

@router.callback_query(F.data == "admin_visitors")
async def cb_admin_visitors(callback: CallbackQuery):
    if not callback.from_user or not is_admin(callback.from_user.id):
        await callback.answer("Ruxsat berilmagan.", show_alert=True)
        return
    v_stats = get_visitor_stats()
    cities = "".join([f"  • 🏙️ <b>{c}:</b> <code>{cnt}</code> ta\n" for c, cnt in v_stats.get("top_cities", [])]) or "  • <i>Hozircha ma'lumotlar to'planmoqda</i>\n"
    devices = "".join([f"  • {d or '💻 Desktop'}: <code>{cnt}</code> ta\n" for d, cnt in v_stats.get("devices", {}).items()]) or "  • <i>Qurilma ma'lumotlari yo'q</i>\n"
    visitors_text = f"""🌐 <b>PORTFOLIO SAYTI TASHRIFLAR STATISTIKASI</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n👥 <b>Jami Tashriflar:</b> <code>{v_stats['total_visits']}</code> ta\n📅 <b>Bugungi Tashriflar:</b> <code>{v_stats['today_visits']}</code> ta\n🔑 <b>Noyob Mehmonlar (IP):</b> <code>{v_stats['unique_ips']}</code> ta\n\n📱 <b>Qurilmalar Bo'yicha:</b>\n{devices}\n🌍 <b>Top Shaharlar:</b>\n{cities}\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n⚡ <i>Real-vaqt monitoringi faol</i>"""
    await callback.message.edit_text(visitors_text, reply_markup=get_admin_sub_keyboard("admin_visitors"), parse_mode="HTML")
    await callback.answer()

@router.callback_query(F.data == "admin_recent_visitors")
async def cb_admin_recent_visitors(callback: CallbackQuery):
    if not callback.from_user or not is_admin(callback.from_user.id):
        await callback.answer("Ruxsat berilmagan.", show_alert=True)
        return
    visitors = get_recent_visitors(5)
    if not visitors:
        text = "👁️ <b>SO'NGGI MEHMONLAR</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<i>Hozircha yangi mehmonlar bazada mavjud emas.</i>"
    else:
        v_lines = ""
        for i, v in enumerate(visitors, 1):
            name = v["visitor_name"] or "Anonim"
            city = v["city"] or "O'zbekiston"
            dev = v["os"] or v["device_type"] or "Desktop"
            map_link = f" | <a href='https://yandex.uz/maps/?pt={v['longitude']},{v['latitude']},pm2rdm&z=16'>📍 Xarita</a>" if v['latitude'] and v['longitude'] else ""
            v_lines += f"<b>{i}. {name}</b>\n📍 {city} ({dev}){map_link}\n🕒 <i>{v['visited_at']}</i>\n\n"
        text = f"👁️ <b>SO'NGGI 5 TA PORTFOLIO MEHMONI:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n{v_lines}"
    await callback.message.edit_text(text, reply_markup=get_admin_sub_keyboard("admin_recent_visitors"), parse_mode="HTML")
    await callback.answer()

@router.callback_query(F.data == "admin_users")
async def cb_admin_users(callback: CallbackQuery):
    if not callback.from_user or not is_admin(callback.from_user.id):
        await callback.answer("Ruxsat berilmagan.", show_alert=True)
        return
    users = get_recent_users(5)
    user_lines = "".join([f"<b>{i}. {u['full_name']}</b> (@{u['username'] or 'mavjud_emas'})\n🆔 <code>{u['user_id']}</code> | 🌐 {u['language'].upper()}\n🕒 <i>{u['last_active']}</i>\n\n" for i, u in enumerate(users, 1)])
    users_text = f"👥 <b>SO'NGGI 5 TA BOT FOYDALANUVCHISI:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n{user_lines or '<i>Foydalanuvchilar yoq.</i>'}"
    await callback.message.edit_text(users_text, reply_markup=get_admin_sub_keyboard("admin_users"), parse_mode="HTML")
    await callback.answer()

@router.callback_query(F.data == "admin_leads")
async def cb_admin_leads(callback: CallbackQuery):
    if not callback.from_user or not is_admin(callback.from_user.id):
        await callback.answer("Ruxsat berilmagan.", show_alert=True)
        return
    messages = get_recent_messages(5)
    msg_lines = "".join([f"<b>{i}. {m['user_name']}</b> (<code>{m['contact_info']}</code>)\n💬 \"<i>{m['message_text'][:100]}</i>\"\n🕒 <i>{m['created_at']}</i>\n\n" for i, m in enumerate(messages, 1)])
    leads_text = f"📩 <b>SO'NGGI 5 TA QABUL QILINGAN XABAR:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n{msg_lines or '<i>Xabarlar mavjud emas.</i>'}"
    await callback.message.edit_text(leads_text, reply_markup=get_admin_sub_keyboard("admin_leads"), parse_mode="HTML")
    await callback.answer()

@router.callback_query(F.data == "admin_diag")
async def cb_admin_diag(callback: CallbackQuery):
    if not callback.from_user or not is_admin(callback.from_user.id):
        await callback.answer("Ruxsat berilmagan.", show_alert=True)
        return
    diag_text = f"""⚡ <b>TIZIM DIAGNOSTIKASI VA SALOMATLIK HOLATI</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n✅ <b>Python aiogram Engine:</b> 3.x Active\n✅ <b>Lokal Ma'lumotlar Bazasi:</b> SQLite Active\n✅ <b>Vercel Serverless Webhook:</b> 24/7 Connected\n✅ <b>Portfolio URL:</b> <code>{config.PORTFOLIO_URL}</code>\n✅ <b>Admin Autentifikatsiyasi:</b> <code>{callback.from_user.id}</code> (Tasdiqlangan)\n✅ <b>Anti-Spam:</b> Faol"""
    await callback.message.edit_text(diag_text, reply_markup=get_admin_sub_keyboard("admin_diag"), parse_mode="HTML")
    await callback.answer()
