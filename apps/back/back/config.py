import dotenv
from pydantic_settings import BaseSettings

dotenv.load_dotenv()


class Settings(BaseSettings):
    TG_BOT_TOKEN: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    DEBUG: bool = False

    class Config:
        env_file = ".env"
        extra = "allow"



settings = Settings()
