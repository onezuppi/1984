import hmac
import hashlib
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from ..config import settings
from ..users.schemas import UserCreate
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

@router.post("/")
async def tg_auth(user_data: dict, user_manager: UserManager = Depends(get_user_manager)):
    received_hash = user_data.pop("hash", None)
    if not received_hash:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No hash provided")
    data_check_arr = [f"{key}={user_data[key]}" for key in sorted(user_data)]
    data_check_string = "\n".join(data_check_arr)
    secret_key = hashlib.sha256(settings.tg_bot_token.encode()).digest()
    computed_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    if computed_hash != received_hash:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Telegram hash")
    tg_id = str(user_data.get("id"))
    if not tg_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No tg_id")
    user = await user_manager.user_db.get_by_field("tg_id", tg_id)
    fake_email = f"{tg_id}@tg.fake"
    if not user:
        user = await user_manager.user_db.get_by_field("email", fake_email)
        if user:
            user.tg_id = tg_id
            await user_manager.user_db.update(user)
    if not user:
        user_in = UserCreate(email=fake_email, password="very-secure-fake-password", tg_id=tg_id)
        try:
            user = await user_manager.create(user_in)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    jwt_strategy = get_jwt_strategy()
    access_token = jwt_strategy.write_token({"sub": str(user.id)})
    refresh_token = jwt_strategy.write_token({"sub": str(user.id), "type": "refresh"})
    return JSONResponse(content={"access_token": access_token, "refresh_token": refresh_token})
