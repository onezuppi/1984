from fastapi import FastAPI

from config import settings
from .routes import routers
from .utils.db import lifespan

app = FastAPI(
    title="Auth Service",
    debug=settings.DEBUG,
    root_path="/api",
    lifespan=lifespan,
)

for rout in routers:
    app.include_router(rout)
