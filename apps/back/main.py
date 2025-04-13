import uvicorn
from fastapi import FastAPI

from back.config import settings
from back.routes import tg_auth_router


app = FastAPI(
    title="Auth Service",
    debug=settings.DEBUG,
    root_path="/api",
)


app.include_router(tg_auth_router, prefix="", tags=["TG Auth"])


def start() -> None:
    uvicorn.run("main:app", host=settings.APP_HOST, port=settings.APP_PORT, reload=settings.DEBUG)

if __name__ == "__main__":
    start()


