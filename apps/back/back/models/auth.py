from typing import List
from pydantic import BaseModel, HttpUrl, EmailStr


class AuthLinkRequest(BaseModel):
    user_id: int
    username: str


class AuthLinkResponse(BaseModel):
    url: HttpUrl


class TokenRequest(BaseModel):
    token: str


class TokenResponse(BaseModel):
    user_id: int
    username: str
