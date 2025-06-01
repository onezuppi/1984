# models/auth.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AuthLinkRequest(BaseModel):
    user_id: int
    chat_id: int
    username: str
    first_name: str
    last_name: str
    avatar_base64: Optional[str]

class AuthLinkResponse(BaseModel):
    id: str


class RefreshRequest(BaseModel):
    refresh_token: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str

class UserModel(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: int
    chat_id: int
    username: str
    first_name: str
    last_name: str
    created_at: datetime

    class Config:
        validate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}

class UserPhotoModel(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: int
    created_at: datetime

    class Config:
        validate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}
