from fastapi import FastAPI

from .config import settings
from .routes import tg_auth_router


app = FastAPI(
    title="Auth Service",
    debug=settings.DEBUG,
    root_path="/api",
)


app.include_router(tg_auth_router, prefix="", tags=["TG Auth"])
