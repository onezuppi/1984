from fastapi import APIRouter, HTTPException
from back.models.auth import AuthLinkRequest, AuthLinkResponse, TokenRequest, TokenResponse
from back.utils.token import create_auth_token, verify_auth_token
from config import settings

router = APIRouter()


@router.post("/get_auth_link", response_model=AuthLinkResponse)
async def get_auth_link(data: AuthLinkRequest) -> AuthLinkResponse:
    token = await create_auth_token(user_id=data.user_id, username=data.username)

    url = f"{settings.FRONTEND_URL}auth/{token}"
    return AuthLinkResponse(url=url)


@router.post("/verify_token", response_model=TokenResponse)
async def verify_token(data: TokenRequest) -> TokenResponse:

    user_info = verify_auth_token(data.token)
    if not user_info:
        raise HTTPException(status_code=401, detail="Invalid, expired or revoked token")
    return user_info
