import uvicorn
from back.config import settings

def start() -> None:
    uvicorn.run("back.app:app", host=settings.APP_HOST, port=settings.APP_PORT, reload=settings.DEBUG)

if __name__ == "__main__":
    start()


