import dotenv
from pydantic_settings import BaseSettings
from urllib.parse import quote_plus

dotenv.load_dotenv()

class Settings(BaseSettings):
    secret_key: str
    vk_client_id: str
    vk_client_secret: str
    vk_redirect_uri: str
    tg_bot_token: str
    debug: bool = False
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    mongo_host: str = "localhost"
    mongo_port: int = 27017
    mongo_database: str = "mongodb"
    mongo_username: str
    mongo_password: str

    @property
    def mongodb_uri(self) -> str:
        user = quote_plus(self.mongo_username)
        password = quote_plus(self.mongo_password)

        return (
            f"mongodb://{user}:{password}"
            f"@{self.mongo_host}:{self.mongo_port}/{self.mongo_database}"
            f"?authSource=admin"
        )

    class Config:
        env_file = ".env"

settings = Settings()
