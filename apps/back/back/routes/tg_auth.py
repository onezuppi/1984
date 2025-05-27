from fastapi import APIRouter, HTTPException

from back.utils.token import verify_auth_token, create_auth_token
from config import settings
from ..models.auth import AuthLinkResponse, AuthLinkRequest, TokenResponse, TokenRequest

router = APIRouter()


@router.post("/get_auth_link", response_model=AuthLinkResponse)
async def get_auth_link(data: AuthLinkRequest):
    token = create_auth_token(data.user_id, data.username)
    url = f"{settings.FRONTEND_URL}/auth/{token}"
    return {"url": url}


@router.post("/verify_token", response_model=TokenResponse)
async def verify_token(data: TokenRequest):
    user_info = verify_auth_token(data.token)
    if not user_info:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user_info
