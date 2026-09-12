from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message
from bot.keyboards.admin_kb import get_admin_keyboard
from bot.handlers.admin_callbacks import (
    router as callbacks_router,
    is_admin,
    build_admin_dashboard_text
)
from bot.handlers.admin_broadcast import router as broadcast_router
from bot.handlers.admin_replies import router as replies_router

router = Router()

# Include modular sub-routers
router.include_router(callbacks_router)
router.include_router(broadcast_router)
router.include_router(replies_router)

@router.message(Command("admin"))
async def handle_admin(message: Message):
    user = message.from_user
    if not user or not is_admin(user.id):
        await message.answer(
            "⛔ <b>Ruxsat etilmagan:</b> Bu buyruq faqat bot administratori (Bekzod Idiyev) uchun mo'ljallangan.",
            parse_mode="HTML"
        )
        return

    dashboard_text = build_admin_dashboard_text(user.id)
    await message.answer(dashboard_text, reply_markup=get_admin_keyboard(), parse_mode="HTML")
