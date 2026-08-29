import asyncio
import logging
import sys
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.types import BotCommand

from bot.config import config
from bot.utils.db import init_db
from bot.handlers import (
    start,
    about,
    projects,
    skills,
    resume,
    contact,
    admin,
)

async def set_bot_commands(bot: Bot):
    commands = [
        BotCommand(command="start", description="🚀 Bosh menyu / Главное меню / Main Menu"),
        BotCommand(command="about", description="👨‍💻 Men haqimda / Обо мне / About Me"),
        BotCommand(command="projects", description="📂 Loyihalarim / Проекты / Projects"),
        BotCommand(command="skills", description="🛠️ Ko'nikmalar & Stack / Навыки / Tech Stack"),
        BotCommand(command="cv", description="📄 Rezyume / Резюме / Resume"),
        BotCommand(command="contact", description="✍️ Xabar qoldirish / Оставить сообщение / Contact"),
        BotCommand(command="language", description="🌐 Tilni o'zgartirish / Сменить язык / Change Language"),
    ]
    await bot.set_my_commands(commands)

async def main():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
        stream=sys.stdout,
    )
    logger = logging.getLogger(__name__)
    logger.info("Initializing Bekzod Idiyev Portfolio Bot (aiogram 3.x)...")

    # Initialize Database
    init_db()

    # Create Bot & Dispatcher
    bot = Bot(
        token=config.TELEGRAM_BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)
    )
    dp = Dispatcher()

    # Register Handlers
    dp.include_router(start.router)
    dp.include_router(about.router)
    dp.include_router(projects.router)
    dp.include_router(skills.router)
    dp.include_router(resume.router)
    dp.include_router(contact.router)
    dp.include_router(admin.router)

    # Set bot commands in Telegram UI
    await set_bot_commands(bot)

    logger.info("Bot successfully started polling...")
    try:
        await dp.start_polling(bot, drop_pending_updates=True)
    finally:
        await bot.session.close()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        print("Bot stopped.")
