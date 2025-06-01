import urllib

import dotenv
from pydantic_settings import BaseSettings

dotenv.load_dotenv()

class Settings(BaseSettings):
    APP_HOST: str = "127.0.0.1"
    APP_PORT: int = 8000
    DEBUG: bool = False

    REDIS_URL: str

    JWT_SECRET: str
    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    TOKEN_EXPIRE_MINUTES: int = 5

    MONGO_HOST: str
    MONGO_PORT: int
    MONGO_DATABASE: str
    MONGO_USERNAME: str
    MONGO_PASSWORD: str

    USERS_COLLECTION: str = "users"
    PHOTO_COLLECTION: str = "photos"

    @property
    def MONGO_URI(self) -> str:
        user = urllib.parse.quote_plus(self.MONGO_USERNAME)
        pwd = urllib.parse.quote_plus(self.MONGO_PASSWORD.strip('"'))

        return f"mongodb://{user}:{pwd}@{self.MONGO_HOST}:{self.MONGO_PORT}/{self.MONGO_DATABASE}?authSource=admin"


    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
