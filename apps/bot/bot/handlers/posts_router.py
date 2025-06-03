from aiogram import Router, types
from motor.motor_asyncio import AsyncIOMotorDatabase

posts_router = Router(name="channel_posts_handler")


def make_post_doc(message: types.Message) -> dict:
    return {
        "_id": f"{message.chat.id}_{message.message_id}",
        "chat_id": message.chat.id,
        "message_id": message.message_id,
        "date": message.date,
        "text": message.text or "",
        "caption": message.caption or "",
        "entities": [e.model_dump() for e in (message.entities or [])],
        "media_group_id": message.media_group_id,
        "author_signature": message.author_signature,
        "from_chat_title": message.chat.title,
        "from_chat_username": message.chat.username,
        "type": message.chat.type,
        "has_media": bool(message.photo or message.video or message.document or message.audio or message.voice),
        "photo": [photo.file_id for photo in message.photo] if message.photo else None,
        "video": message.video.file_id if message.video else None,
        "document": message.document.file_id if message.document else None,
        "audio": message.audio.file_id if message.audio else None,
        "voice": message.voice.file_id if message.voice else None,
    }


@posts_router.channel_post()
async def save_channel_post(
        message: types.Message,
        db: AsyncIOMotorDatabase,
):
    posts_col = db["channel_posts"]
    doc = make_post_doc(message)
    await posts_col.update_one(
        {"_id": doc["_id"]},
        {"$set": doc},
        upsert=True
    )


@posts_router.edited_channel_post()
async def save_edited_channel_post(
        message: types.Message,
        db: AsyncIOMotorDatabase,
):
    posts_col = db["channel_posts"]
    doc = make_post_doc(message)
    await posts_col.update_one(
        {"_id": doc["_id"]},
        {"$set": doc},
        upsert=True
    )
