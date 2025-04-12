import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi_users.authentication import AuthenticationBackend, BearerTransport, JWTStrategy

from back.routes import tg_auth_router, vk_auth_router
from back.db import init_db
from back.config import settings


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=settings.secret_key, lifetime_seconds=3600)


bearer_transport = BearerTransport(tokenUrl="/auth/jwt/login")
auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()

    yield

app = FastAPI(
    title="Auth Service",
    debug=settings.debug,
    root_path="/api",
    lifespan=lifespan,
)

app.include_router(tg_auth_router, prefix="/auth", tags=["Telegram Auth"])
app.include_router(vk_auth_router, prefix="/auth", tags=["VK Auth"])


def start() -> None:
    uvicorn.run("main:app", host=settings.app_host, port=settings.app_port, reload=settings.debug)

if __name__ == "__main__":
    start()
