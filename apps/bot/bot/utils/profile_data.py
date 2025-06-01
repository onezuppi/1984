import base64
import aiohttp
from aiogram import Bot, types

from config import settings


async def fetch_avatar_base64(bot: Bot, user_id: int) -> str | None:
    try:
        photos = await bot.get_user_profile_photos(user_id, limit=1)
        if photos.total_count > 0:
            smallest_photo = photos.photos[0][0]
            file = await bot.get_file(smallest_photo.file_id)
            file_url = f"https://api.telegram.org/file/bot{settings.TG_BOT_TOKEN}/{file.file_path}"

            async with aiohttp.ClientSession() as session:
                async with session.get(file_url) as resp:
                    if resp.status == 200:
                        img_bytes = await resp.read()

                        return base64.b64encode(img_bytes).decode('utf-8')
    except Exception:
        pass

    return None


def build_payload(message: types.Message, avatar_base64: str | None) -> dict:
    user = message.from_user
    return {
        "user_id": user.id,
        "chat_id": message.chat.id,
        "username": user.username or "",
        "first_name": user.first_name or "",
        "last_name": user.last_name or "",
        "avatar_base64": avatar_base64 or None,
    }
