from datetime import datetime, timedelta

import jwt
from jwt import ExpiredSignatureError, InvalidTokenError

from back.utils.redis import redis_client
from config import settings


async def create_auth_token(user_id: int, username: str) -> str:
    now = datetime.utcnow()
    exp = now + timedelta(minutes=5)

    payload = {
        "sub": str(user_id),
        "username": username,
        "iat": now,
        "exp": exp,
    }

    token = jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm=settings.ALGORITHM
    )
    if isinstance(token, bytes):
        token = token.decode("utf-8")

    await redis_client.set(
        f"auth_token:{token}",
        f"{user_id}:{username}",
        ex=300  # 5 минут
    )

    return token


async def verify_auth_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(
            token,
            settings.JWT_PUBLIC_KEY,
            algorithms=[settings.ALGORITHM],
            options={"require": ["exp", "iat", "sub"]}
        )
    except (ExpiredSignatureError, InvalidTokenError):
        return None

    exists = await redis_client.exists(f"auth_token:{token}")
    if not exists:
        return None

    return {
        "user_id": int(payload["sub"]),
        "username": payload["username"],
    }
