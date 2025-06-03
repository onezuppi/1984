from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import Request, FastAPI
from redis.asyncio import Redis
from config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.mongo_client = AsyncIOMotorClient(settings.MONGO_URI)
    app.state.db = app.state.mongo_client[settings.MONGO_DATABASE]
    app.state.redis = Redis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)

    yield

    app.state.mongo_client.close()
    await app.state.redis.close()

def get_db(request: Request):
    return request.app.state.db

def get_users_collection(request: Request):
    return request.app.state.db[settings.USERS_COLLECTION]

def get_photos_collection(request: Request):
    return request.app.state.db[settings.PHOTO_COLLECTION]

def get_redis(request: Request):
    return request.app.state.redis

def get_channels_collection(request: Request):
    return request.app.state.db[settings.CHANNELS_COLLECTION]

def get_channel_posts_collection(request: Request):
    return request.app.state.db[settings.CHANNEL_POSTS_COLLECTION]