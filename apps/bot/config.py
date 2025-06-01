import urllib

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    TG_BOT_TOKEN: str
    REDIRECT_URL: str
    DEBUG: bool = False
    REDIS_URL: str
    TOKEN_ALIVE_TIME: int = 5

    MONGO_HOST: str
    MONGO_PORT: int
    MONGO_DATABASE: str
    MONGO_USERNAME: str
    MONGO_PASSWORD: str

    ADMIN_CHANNEL_COLLECTION: str = "admin_channels"

    @property
    def MONGO_URI(self) -> str:
        user = urllib.parse.quote_plus(self.MONGO_USERNAME)
        pwd = urllib.parse.quote_plus(self.MONGO_PASSWORD.strip('"'))

        return f"mongodb://{user}:{pwd}@{self.MONGO_HOST}:{self.MONGO_PORT}/{self.MONGO_DATABASE}?authSource=admin"
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
