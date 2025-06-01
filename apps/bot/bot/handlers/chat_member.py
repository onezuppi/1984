from aiogram import Router, types, Bot, F
from aiogram.filters import ChatMemberUpdatedFilter, IS_NOT_MEMBER, ADMINISTRATOR
from aiogram.enums import ChatType
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorDatabase

chat_member_router = Router(name="chat_member_handlers")


@chat_member_router.chat_member(
    ChatMemberUpdatedFilter(member_status_changed=IS_NOT_MEMBER >> ADMINISTRATOR),
    F.chat.type == ChatType.CHANNEL
)
async def track_channel_admin_change(
    update: types.ChatMemberUpdated,
    bot: Bot,
    db: AsyncIOMotorDatabase
):
    old_status: str = update.old_chat_member.status
    new_status: str = update.new_chat_member.status
    chat: types.Chat = update.chat

    chat_id: int = chat.id
    chat_full: types.Chat = await bot.get_chat(chat_id)

    subscribers_count: Optional[int] = None
    try:
        subscribers_count = await bot.get_chat_member_count(chat_id)
    except Exception:
        subscribers_count = None

    users_col = db["admin_channels"]

    if old_status in ("left", "kicked") and new_status == "administrator":
        doc = {
            "_id": chat_id,
            "title": chat_full.title or "",
            "username": chat_full.username or "",
            "type": chat_full.type,
            "description": chat_full.description or "",
            "invite_link": chat_full.invite_link or "",
            "subscribers_count": subscribers_count,
            "photo_file_id": None,
            "is_private": not bool(chat_full.username),
        }

        if chat_full.photo:
            doc["photo_file_id"] = chat_full.photo.small_file_id

        await users_col.update_one(
            {"_id": chat_id},
            {"$set": doc},
            upsert=True
        )

    elif old_status == "administrator" and new_status in ("left", "kicked"):
        await users_col.delete_one({"_id": chat_id})
