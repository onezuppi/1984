import asyncio
from bot.bot import main


def start() -> None:
    asyncio.run(main())


if __name__ == "__main__":
    start()