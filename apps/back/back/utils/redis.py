from redis.asyncio import Redis

from config import settings

redis_client = Redis.from_url(settings.REDIS_URL, decode_responses=True)


async def init_redis() -> None:
    await redis_client.ping()


async def close_redis() -> None:
    await redis_client.close()
