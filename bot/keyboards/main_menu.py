from aiogram.types import (
    ReplyKeyboardMarkup,
    KeyboardButton,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    WebAppInfo,
)
from bot.config import config
from bot.locales import get_text

def get_main_reply_keyboard(lang: str = 'uz') -> ReplyKeyboardMarkup:
    """
    Main persistent reply keyboard for fast navigation
    """
    btn_webapp = KeyboardButton(
        text=get_text("btn_webapp", lang),
        web_app=WebAppInfo(url=config.PORTFOLIO_URL)
    )
    btn_about = KeyboardButton(text=get_text("btn_about", lang))
    btn_projects = KeyboardButton(text=get_text("btn_projects", lang))
    btn_skills = KeyboardButton(text=get_text("btn_skills", lang))
    btn_cv = KeyboardButton(text=get_text("btn_cv", lang))
    btn_contact = KeyboardButton(text=get_text("btn_contact", lang))
    btn_language = KeyboardButton(text=get_text("btn_language", lang))

    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [btn_webapp],
            [btn_about, btn_projects],
            [btn_skills, btn_cv],
            [btn_contact, btn_language],
        ],
        resize_keyboard=True,
        is_persistent=True,
    )
    return keyboard

def get_main_inline_keyboard(lang: str = 'uz') -> InlineKeyboardMarkup:
    """
    Inline interactive keyboard for quick links
    """
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text=get_text("btn_webapp", lang),
                    web_app=WebAppInfo(url=config.PORTFOLIO_URL)
                )
            ],
            [
                InlineKeyboardButton(
                    text="🐙 GitHub Repo",
                    url=config.GITHUB_URL
                ),
                InlineKeyboardButton(
                    text="✈️ Telegram DM",
                    url="https://t.me/toyneden"
                ),
            ],
        ]
    )
