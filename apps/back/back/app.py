from fastapi import FastAPI

from config import settings
from .routes import auth_router, user_router
from .utils.db import lifespan

app = FastAPI(
    title="Auth Service",
    debug=settings.DEBUG,
    root_path="/api",
    lifespan=lifespan,
)

for rout in (auth_router, user_router):
    app.include_router(rout)
