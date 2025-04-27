import asyncio
import os

from dotenv import load_dotenv
from telethon import TelegramClient

load_dotenv()
API_ID = int(os.getenv("TELETHON_API_ID"))
API_HASH = os.getenv("TELETHON_API_HASH")
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")


async def main():
    # создаём клиент, но не стартуем сразу
    client = TelegramClient('bot_session', API_ID, API_HASH)
    # используем async context manager
    async with client:
        # внутри контекста автоматически произойдёт connect()
        # теперь логинимся бот-токеном
        await client.sign_in(bot_token=BOT_TOKEN)
        print("Bot successfully signed in!")

        # пример: получить диалоги
        dialogs = await client.get_dialogs()
        for d in dialogs:
            print(d.name, d.id)


if __name__ == "__main__":
    asyncio.run(main())
