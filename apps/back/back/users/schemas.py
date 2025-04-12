from fastapi_users import schemas
from typing import Optional
from uuid import UUID

class UserRead(schemas.BaseUser[UUID]):
    vk_id: Optional[str]
    tg_id: Optional[str]

class UserCreate(schemas.BaseUserCreate):
    vk_id: Optional[str] = None
    tg_id: Optional[str] = None