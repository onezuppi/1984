import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from ..config import settings
from ..users.schemas import UserCreate
from ..users.models import User
from ..users.manager import UserManager
from fastapi_users.db import BeanieUserDatabase
from ..utils import get_jwt_strategy

router = APIRouter()


async def get_user_db():
    from ..users.models import User
    from fastapi_users.db import BeanieUserDatabase
    yield BeanieUserDatabase(User)


async def get_user_manager(user_db: BeanieUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)

# Эндпоинт авторизации через VK (обмен кода на токены и сохранение данных)
@router.post("/vk")
async def vk_auth(code: str, user_manager: UserManager = Depends(get_user_manager)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://oauth.vk.com/access_token",
            params={
                "client_id": settings.vk_client_id,
                "client_secret": settings.vk_client_secret,
                "redirect_uri": settings.vk_redirect_uri,
                "code": code,
            },
        )
    data = response.json()
    if "error" in data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=data.get("error_description", "VK error"),
        )
    vk_id = str(data.get("user_id"))
    if not vk_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="VK did not return user_id"
        )

    email = data.get("email")
    # Поиск пользователя по vk_id
    user = await user_manager.user_db.get_by_field("vk_id", vk_id)
    if not user and email:
        user = await user_manager.user_db.get_by_field("email", email)
        if user:
            user.vk_id = vk_id
            # Сохранение новых данных от VK
            user.vk_data = data
            await user_manager.user_db.update(user)
    if not user:
        user_email = email or f"{vk_id}@vk.fake"
        user_in = UserCreate(email=user_email, password="very-secure-fake-password", vk_id=vk_id)
        try:
            user = await user_manager.create(user_in)
            # После создания пользователя сохраняем данные от VK
            user.vk_data = data
            await user_manager.user_db.update(user)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    # Генерация токенов
    jwt_strategy = get_jwt_strategy()
    access_token = jwt_strategy.write_token({"sub": str(user.id)})
    refresh_token = jwt_strategy.write_token({"sub": str(user.id), "type": "refresh"})
    return JSONResponse(content={"access_token": access_token, "refresh_token": refresh_token})


# Схема запроса для обновления токена
class RefreshTokenRequest(BaseModel):
    refresh_token: str


# Эндпоинт для обновления JWT с использованием refresh_token
@router.post("/refresh")
async def refresh_token_endpoint(
    req: RefreshTokenRequest, user_manager: UserManager = Depends(get_user_manager)
):
    jwt_strategy = get_jwt_strategy()
    try:
        payload = jwt_strategy.read_token(req.refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid token type")
        user_id = payload.get("sub")
        user = await user_manager.user_db.get(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        new_access = jwt_strategy.write_token({"sub": str(user.id)})
        new_refresh = jwt_strategy.write_token({"sub": str(user.id), "type": "refresh"})
        return JSONResponse(content={"access_token": new_access, "refresh_token": new_refresh})
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
