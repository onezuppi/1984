import json
import jwt
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, status, Query

from back.models.auth import TokenResponse, RefreshRequest
from back.utils.db import get_users_collection, get_photos_collection, get_redis
from back.utils.jwt import create_access_token, create_refresh_token, verify_and_get_user
from config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/by-token", response_model=TokenResponse)
async def auth_by_token(
    token: str = Query(),
    users=Depends(get_users_collection),
    photos=Depends(get_photos_collection),
    redis=Depends(get_redis),
):
    raw = await redis.get(token)
    if not raw:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is invalid or expired"
        )
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Corrupted data in Redis"
        )

    user_id = payload["user_id"]
    now = datetime.utcnow()

    await users.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "chat_id": payload.get("chat_id"),
                "username": payload.get("username", ""),
                "first_name": payload.get("first_name", ""),
                "last_name": payload.get("last_name", ""),
                "created_at": now,
            },
            "$setOnInsert": {"user_id": user_id},
        },
        upsert=True
    )

    avatar_b64 = payload.get("avatar_base64")
    if avatar_b64:
        await photos.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "avatar_base64": avatar_b64,
                    "created_at": now
                },
                "$setOnInsert": {"user_id": user_id},
            },
            upsert=True
        )

    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)

    await redis.delete(token)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    body: RefreshRequest
):
    refresh_token = body.refresh_token
    try:
        data = jwt.decode(
            refresh_token,
            settings.JWT_SECRET,
            algorithms=[settings.ALGORITHM]
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    user_id = data.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    new_access = create_access_token(int(user_id))

    return TokenResponse(
        access_token=new_access,
        refresh_token=""
    )
