import hashlib
import hmac
import time

import jwt  # PyJWT library
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pydantic_settings import BaseSettings  # обновлённый импорт


# Настройки, читаемые из .env
class Settings(BaseSettings):
    BOT_TOKEN: str  # токен Telegram-бота (от @BotFather)
    JWT_SECRET: str  # секретный ключ для подписи JWT
    JWT_ALGORITHM: str = "HS256"  # алгоритм JWT (по умолчанию HS256)

    class Config:
        env_file = ".env"
        extra = "allow"  # разрешаем лишние поля в файле .env


settings = Settings()


# Pydantic-модель данных, приходящих от Telegram
class TelegramAuth(BaseModel):
    id: int
    first_name: str
    last_name: str | None = None
    username: str | None = None
    photo_url: str | None = None
    auth_date: int
    hash: str


app = FastAPI()

# Разрешаем CORS для разработки (чтобы фронтенд на другом порте мог обращаться к API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # в продакшене укажите конкретный домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    secret_key = hashlib.sha256(settings.BOT_TOKEN.encode()).digest()
    computed_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    # Сравниваем с присланным хешем
    if computed_hash != hash_to_check:
        return False
    # Дополнительно: проверяем, что авторизация недавняя (менее 1 суток назад)
    if time.time() - data.auth_date > 24 * 3600:
        return False
    return True


@app.post("/auth/telegram")
def auth_telegram(payload: TelegramAuth):
    """Принимает данные от Telegram Login Widget, проверяет их и выдает JWT."""
    # Валидируем подпись данных
    if not verify_telegram_auth(payload):
        raise HTTPException(status_code=401, detail="Invalid Telegram data")
    # Данные подлинны – генерируем JWT токен
    user_claims = {
        "id": payload.id,
        "first_name": payload.first_name,
        "last_name": payload.last_name,
        "username": payload.username,
        "photo_url": payload.photo_url,
    }
    token = jwt.encode(user_claims, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return {"token": token}



@app.get("/me")
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
