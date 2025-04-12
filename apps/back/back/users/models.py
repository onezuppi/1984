from beanie import Document
from fastapi_users.db import BeanieBaseUser, BeanieUserDatabase
from typing import Optional
from pydantic import Field


class  User(BeanieBaseUser, Document):
    vk_id: Optional[str] = Field(default=None, unique=True)
    tg_id: Optional[str] = Field(default=None, unique=True)

    class Settings:
        name = "users"

class UserDB(User, BeanieUserDatabase):
    pass