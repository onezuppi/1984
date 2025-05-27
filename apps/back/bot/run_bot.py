import asyncio

from bot.bot import dp, bot


async def main():
    await dp.start_polling(bot)


def run():
    asyncio.run(main())


if __name__ == "__main__":
    run()
