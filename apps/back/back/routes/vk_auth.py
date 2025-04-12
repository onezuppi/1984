import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from ..config import settings
from ..users.schemas import UserCreate
from ..users.models import User
from ..users.manager import UserManager
from fastapi_users.db import BeanieUserDatabase
from fastapi_users.authentication import JWTStrategy

router = APIRouter()

async def get_user_db():
    from ..users.models import User
    from fastapi_users.db import BeanieUserDatabase

    yield BeanieUserDatabase(User)

async def get_user_manager(user_db: BeanieUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=settings.secret_key, lifetime_seconds=3600)

@router.get("/")
async def vk_auth(code: str, user_manager: UserManager = Depends(get_user_manager)):
    async with httpx.AsyncClient() as client:
        response = await client.get("https://oauth.vk.com/access_token", params={
            "client_id": settings.vk_client_id,
            "client_secret": settings.vk_client_secret,
            "redirect_uri": settings.vk_redirect_uri,
            "code": code
        })
    data = response.json()
    if "error" in data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=data.get("error_description", "VK error"))
    vk_id = str(data.get("user_id"))
    if not vk_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="VK did not return user_id")
    email = data.get("email")
    user = await user_manager.user_db.get_by_field("vk_id", vk_id)
    if not user and email:
        user = await user_manager.user_db.get_by_field("email", email)
        if user:
            user.vk_id = vk_id
            await user_manager.user_db.update(user)
    if not user:
        user_email = email or f"{vk_id}@vk.fake"
        user_in = UserCreate(email=user_email, password="very-secure-fake-password", vk_id=vk_id)
        try:
            user = await user_manager.create(user_in)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    jwt_strategy = get_jwt_strategy()
    access_token = jwt_strategy.write_token({"sub": str(user.id)})
    refresh_token = jwt_strategy.write_token({"sub": str(user.id), "type": "refresh"})
    return JSONResponse(content={"access_token": access_token, "refresh_token": refresh_token})
