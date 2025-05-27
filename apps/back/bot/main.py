import asyncio

import aiohttp
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

from config import settings

bot = Bot(token=settings.BOT_TOKEN)
dp = Dispatcher()


@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    user_id = message.from_user.id
    username = message.from_user.username or str(user_id)
    payload = {
        "user_id": user_id,
        "username": username,
    }
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                    f"{settings.BACKEND_URL}/get_auth_link",
                    json=payload,
                    timeout=10
            ) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    url = data["url"]

                    kb = InlineKeyboardMarkup(
                        inline_keyboard=[
                            [InlineKeyboardButton(text="Авторизоваться", url=url)]
                        ]
                    )
                    await message.answer(
                        "Нажмите кнопку для авторизации (ссылка действует 5 минут):",
                        reply_markup=kb
                    )
                else:
                    text = await resp.text()
                    await message.answer(f"Ошибка генерации ссылки ({resp.status}): {text}")
    except Exception as e:
        await message.answer(f"Внутренняя ошибка: {e}")


async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
