import uuid
import json
from aiogram import types, Router, Bot
from redis.asyncio import Redis
from aiogram.filters import Command
from config import settings
from bot.utils.profile_data import fetch_avatar_base64, build_payload


register_router = Router(name="user_handlers")

@register_router.message(Command("start"))
async def cmd_start(message: types.Message, redis: Redis, bot: Bot):
    avatar = await fetch_avatar_base64(bot, message.from_user.id)
    payload = build_payload(message, avatar)

    token = str(uuid.uuid4())
    try:
        await redis.set(token, json.dumps(payload), ex=settings.TOKEN_ALIVE_TIME * 60)
    except Exception:
        await message.answer("Ошибка Redis, попробуйте позже.")
        return

    url = f"{settings.REDIRECT_URL}?token={token}"

    keyboard = None if settings.DEBUG else types.InlineKeyboardMarkup(
            inline_keyboard=[[types.InlineKeyboardButton(text="Авторизоваться", url=url)]]
        )
    text = f"Нажмите для авторизации (ссылка живёт {settings.TOKEN_ALIVE_TIME} минут)"
    text = f"{text} {url}" if settings.DEBUG else text

    await message.answer(text, reply_markup=keyboard)