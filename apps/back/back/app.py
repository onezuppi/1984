from fastapi import FastAPI

from config import settings
from .routes import tg_auth_router
from .utils.redis import init_redis, close_redis

app = FastAPI(
    title="Auth Service",
    debug=settings.DEBUG,
    root_path="/api",
)

app.include_router(tg_auth_router, prefix="", tags=["TG Auth"])

app.add_event_handler("startup", init_redis)
app.add_event_handler("shutdown", close_redis)