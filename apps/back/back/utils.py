from fastapi_users.authentication import JWTStrategy
from .config import settings


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=settings.secret_key, lifetime_seconds=3600)
