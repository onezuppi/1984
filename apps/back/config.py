import dotenv
from pydantic_settings import BaseSettings

dotenv.load_dotenv()


class Settings(BaseSettings):
    BOT_TOKEN: str
    JWT_SECRET: str
    ALGORITHM: str = "HS256"
    # не дает открывать ссылки без https
    FRONTEND_URL: str = "https://github.com/"
    BACKEND_URL: str = "http://127.0.0.1:8080/api"
    APP_HOST: str = "127.0.0.1"
    APP_PORT: int = 8080
    DEBUG: bool = False
    REDIS_URL: str = "redis://127.0.0.1:6379/0"

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
