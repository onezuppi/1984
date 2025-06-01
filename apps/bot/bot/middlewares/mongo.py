from aiogram import BaseMiddleware
from aiogram.types import TelegramObject
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Callable, Dict, Any

class MongoMiddleware(BaseMiddleware):
    def __init__(self, mongo_client: AsyncIOMotorClient, db_name: str):
        super().__init__()
        self.client: AsyncIOMotorClient = mongo_client
        self.db: AsyncIOMotorDatabase = self.client[db_name]

    async def __call__(
        self,
        handler: Callable[[TelegramObject, Dict[str, Any]], Any],
        event: TelegramObject,
        data: Dict[str, Any]
    ) -> Any:
        data["db"] = self.db

        return await handler(event, data)
