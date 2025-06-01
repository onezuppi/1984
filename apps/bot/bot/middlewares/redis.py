from aiogram import BaseMiddleware
from aiogram.types import TelegramObject
from redis.asyncio import Redis
from typing import Callable, Dict, Any

class RedisMiddleware(BaseMiddleware):
    def __init__(self, redis: Redis):
        super().__init__()
        self.redis = redis

    async def __call__(
        self,
        handler: Callable[[TelegramObject, Dict[str, Any]], Any],
        event: TelegramObject,
        data: Dict[str, Any]
    ) -> Any:
        data["redis"] = self.redis

        return await handler(event, data)
