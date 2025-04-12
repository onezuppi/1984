from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from .users.models import User
from .config import settings


async def init_db():
    client = AsyncIOMotorClient(settings.mongodb_uri)
    await init_beanie(database=client.get_default_database(), document_models=[User])
