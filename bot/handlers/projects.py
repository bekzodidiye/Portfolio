from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message, CallbackQuery
from bot.locales import get_text
from bot.utils.db import get_user_language
from bot.keyboards.projects_kb import get_projects_inline_keyboard, get_single_project_keyboard

router = Router()

@router.message(Command("projects"))
@router.message(F.text.in_(["📂 Loyihalarim", "📂 Мои Проекты", "📂 Projects"]))
async def handle_projects(message: Message):
    user = message.from_user
    lang = get_user_language(user.id) if user else 'uz'
    text = get_text("projects_text", lang)
    await message.answer(text, reply_markup=get_projects_inline_keyboard(), parse_mode="HTML")

@router.callback_query(F.data == "proj_list")
async def cb_proj_list(callback: CallbackQuery):
    user = callback.from_user
    lang = get_user_language(user.id) if user else 'uz'
    text = get_text("projects_text", lang)
    await callback.message.edit_text(text, reply_markup=get_projects_inline_keyboard(), parse_mode="HTML")
    await callback.answer()

@router.callback_query(F.data == "proj_buddy")
async def cb_proj_buddy(callback: CallbackQuery):
    user = callback.from_user
    lang = get_user_language(user.id) if user else 'uz'
    text = get_text("project_buddy", lang)
    await callback.message.edit_text(text, reply_markup=get_single_project_keyboard("https://github.com/bekzodidiye/Portfolio"), parse_mode="HTML")
    await callback.answer()

@router.callback_query(F.data == "proj_esports")
async def cb_proj_esports(callback: CallbackQuery):
    user = callback.from_user
    lang = get_user_language(user.id) if user else 'uz'
    text = get_text("project_esports", lang)
    await callback.message.edit_text(text, reply_markup=get_single_project_keyboard("https://github.com/bekzodidiye/Portfolio"), parse_mode="HTML")
    await callback.answer()

@router.callback_query(F.data == "proj_peerlearn")
async def cb_proj_peerlearn(callback: CallbackQuery):
    user = callback.from_user
    lang = get_user_language(user.id) if user else 'uz'
    text = get_text("project_peerlearn", lang)
    await callback.message.edit_text(text, reply_markup=get_single_project_keyboard("https://github.com/bekzodidiye/Portfolio"), parse_mode="HTML")
    await callback.answer()
