from aiogram import Router, types, Bot
from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorGridFSBucket

posts_router = Router(name="channel_posts_handler")

async def save_photo_to_gridfs(db: AsyncIOMotorDatabase, bot: Bot, file_id: str) -> str:
    file = await bot.get_file(file_id)
    content = await bot.download_file(file.file_path)
    fs_bucket = AsyncIOMotorGridFSBucket(db, bucket_name="photos")
    grid_in = fs_bucket.open_upload_stream(filename=f"{file.file_id}.jpg")
    await grid_in.write(content)
    await grid_in.close()
    return str(grid_in._id)

def make_post_doc(message: types.Message, photo_gridfs_ids: list[str]) -> dict:
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
        "photo_file_ids": [photo.file_id for photo in message.photo] if message.photo else None,
        "photo_gridfs_ids": photo_gridfs_ids or None,
        "video": message.video.file_id if message.video else None,
        "document": message.document.file_id if message.document else None,
        "audio": message.audio.file_id if message.audio else None,
        "voice": message.voice.file_id if message.voice else None,
    }

@posts_router.channel_post()
async def save_channel_post(
    message: types.Message,
    db: AsyncIOMotorDatabase,
    bot: Bot,
):
    posts_col = db["channel_posts"]
    photo_gridfs_ids = []
    if message.photo:
        for photo in message.photo:
            gridfs_id = await save_photo_to_gridfs(db, bot, photo.file_id)
            photo_gridfs_ids.append(gridfs_id)
    doc = make_post_doc(message, photo_gridfs_ids)
    await posts_col.update_one({"_id": doc["_id"]}, {"$set": doc}, upsert=True)

@posts_router.edited_channel_post()
async def save_edited_channel_post(
    message: types.Message,
    db: AsyncIOMotorDatabase,
    bot: Bot,
):
    posts_col = db["channel_posts"]
    photo_gridfs_ids = []
    if message.photo:
        for photo in message.photo:
            gridfs_id = await save_photo_to_gridfs(db, bot, photo.file_id)
            photo_gridfs_ids.append(gridfs_id)
    doc = make_post_doc(message, photo_gridfs_ids)
    await posts_col.update_one({"_id": doc["_id"]}, {"$set": doc}, upsert=True)
