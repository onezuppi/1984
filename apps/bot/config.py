from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    TG_BOT_TOKEN: str
    REDIRECT_URL: str
    DEBUG: bool = False
    REDIS_URL: str
    TOKEN_ALIVE_TIME: int = 5

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
