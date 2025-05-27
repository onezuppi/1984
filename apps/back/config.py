import dotenv
from pydantic_settings import BaseSettings

dotenv.load_dotenv()


class Settings(BaseSettings):
    BOT_TOKEN: str
    JWT_SECRET: str
    ALGORITHM: str = "HS256"
    FRONTEND_URL: str = "http://localhost:4200"
    BACKEND_URL: str = "http://localhost:8080/api"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8080
    DEBUG: bool = False

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
