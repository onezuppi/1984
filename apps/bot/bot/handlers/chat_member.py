from aiogram import Router, types, Bot, F
from aiogram.enums import ChatType
from aiogram.filters.chat_member_updated import ChatMemberUpdatedFilter, IS_NOT_MEMBER, ADMINISTRATOR
from motor.motor_asyncio import AsyncIOMotorDatabase

chat_member = Router(name="channel_member_handlers")

chat_member.my_chat_member.filter(F.chat.type == ChatType.CHANNEL)


@chat_member.my_chat_member(
    ChatMemberUpdatedFilter(member_status_changed=IS_NOT_MEMBER >> ADMINISTRATOR)
)
async def bot_added_to_channel(
        update: types.ChatMemberUpdated,
        bot: Bot,
        db: AsyncIOMotorDatabase
):
    chat = update.chat
    chat_id = chat.id
    chat_full = await bot.get_chat(chat_id)
    inviter_id = update.from_user.id if update.from_user else None

    channels_col = db["channels"]

    doc = {
        "_id": chat_id,
        "title": chat_full.title or "",
        "username": chat_full.username or "",
        "type": chat_full.type,
        "description": chat_full.description or "",
        "invite_link": chat_full.invite_link or "",
        "is_private": not bool(chat_full.username),
        "user_id": inviter_id,
    }

    if chat_full.photo:
        doc["photo_file_id"] = chat_full.photo.small_file_id

    await channels_col.update_one(
        {"_id": chat_id},
        {"$set": doc},
        upsert=True
    )


@chat_member.my_chat_member(
    ChatMemberUpdatedFilter(member_status_changed=ADMINISTRATOR >> IS_NOT_MEMBER)
)
async def bot_removed_from_channel(
        update: types.ChatMemberUpdated,
        db: AsyncIOMotorDatabase
):
    chat_id = update.chat.id
    channels_col = db["channels"]
    await channels_col.delete_one({"_id": chat_id})
