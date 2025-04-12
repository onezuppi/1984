from uuid import UUID
from fastapi_users.manager import BaseUserManager
from fastapi_users.exceptions import UserAlreadyExists
from ..config import settings
from ..users.models import User


class UserManager(BaseUserManager[User, UUID]):
    reset_password_token_secret = settings.secret_key
    verification_token_secret = settings.secret_key

    async def on_after_register(self, user: User, request=None):
        print(f"User registered: {user.id}")
