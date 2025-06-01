from aiogram import BaseMiddleware, Bot
from aiogram.types import TelegramObject
from typing import Callable, Dict, Any

class BotMiddleware(BaseMiddleware):
    def __init__(self, bot: Bot):
        super().__init__()
        self._bot = bot

    async def __call__(
        self,
        handler: Callable[[TelegramObject, Dict[str, Any]], Any],
        event: TelegramObject,
        data: Dict[str, Any]
    ) -> Any:
        data["bot"] = self._bot

        return await handler(event, data)
