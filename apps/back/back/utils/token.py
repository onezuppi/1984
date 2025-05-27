from datetime import datetime, timedelta

import jwt

from config import settings


def create_auth_token(user_id: int, username: str):
    expire = datetime.utcnow() + timedelta(minutes=5)
    payload = {"user_id": user_id, "username": username, "exp": expire}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.ALGORITHM)


def verify_auth_token(token: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        return {"user_id": payload["user_id"], "username": payload["username"]}
    except (jwt.ExpiredSignatureError, jwt.DecodeError):
        return None
