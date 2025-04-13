import hashlib
import hmac
import time
import jwt

from fastapi import APIRouter, HTTPException
from starlette.requests import Request

from ..config import settings
from ..models import TelegramAuth


router = APIRouter()

def verify_telegram_auth(data: TelegramAuth) -> bool:
    """Проверка подлинности данных от Telegram с помощью хеша."""
    # Преобразуем BaseModel в словарь и исключаем отсутствующие поля и сам hash
    data_dict = data.dict(exclude_none=True)
    hash_to_check = data_dict.pop('hash', None)
    if not hash_to_check:
        return False
    # Формируем строку проверки данных (отсортированные ключ=значение, разделённые '\n')
    data_check_arr = [f"{key}={value}" for key, value in sorted(data_dict.items())]
    data_check_string = "\n".join(data_check_arr)
    # Вычисляем свой хеш
    secret_key = hashlib.sha256(settings.TG_BOT_TOKEN.encode()).digest()
    computed_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    # Сравниваем с присланным хешем
    if computed_hash != hash_to_check:
        return False
    # Дополнительно: проверяем, что авторизация недавняя (менее 1 суток назад)
    if time.time() - data.auth_date > 24 * 3600:
        return False
    return True


@router.post("/auth/telegram")
def auth_telegram(payload: TelegramAuth):
    if not verify_telegram_auth(payload):
        raise HTTPException(status_code=401, detail="Invalid Telegram data")
    user_claims = {
        "id": payload.id,
        "first_name": payload.first_name,
        "last_name": payload.last_name,
        "username": payload.username,
        "photo_url": payload.photo_url,
    }
    token = jwt.encode(user_claims, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

    return {"token": token}



@router.get("/me")
def get_me(request: Request):
    """
    Возвращает информацию о текущем пользователе по JWT.
    Ожидает заголовок Authorization: Bearer <token>.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = auth_header.split("Bearer ")[1]
    # Декодируем и проверяем JWT
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    # Формируем ответ с именем и аватаром
    first_name = payload.get("first_name", "")
    last_name = payload.get("last_name", "")
    name = (first_name + " " + last_name).strip()
    avatar = payload.get("photo_url")
    return {"name": name, "avatar": avatar}