from aiogram import Bot, Dispatcher
from motor.motor_asyncio import AsyncIOMotorClient
from redis.asyncio import Redis

from bot.handlers import register_router, chat_member_router, group_member_router
from bot.middlewares import RedisMiddleware, MongoMiddleware, BotMiddleware
from config import settings

bot = Bot(token=settings.TG_BOT_TOKEN)
dp = Dispatcher()


async def main():
    redis_client = Redis.from_url(settings.REDIS_URL, decode_responses=True)
    dp.update.middleware(RedisMiddleware(redis_client))

    mongo_client = AsyncIOMotorClient(settings.MONGO_URI)
    dp.update.middleware(MongoMiddleware(mongo_client, settings.MONGO_DATABASE))

    dp.update.outer_middleware(BotMiddleware(bot))

    for router in (register_router, chat_member_router, group_member_router):
        dp.include_router(router)

    await dp.start_polling(bot)
    await redis_client.aclose()
    mongo_client.close()
