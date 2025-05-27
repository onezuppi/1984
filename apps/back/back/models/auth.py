from pydantic import BaseModel


class AuthLinkRequest(BaseModel):
    user_id: int
    username: str


class AuthLinkResponse(BaseModel):
    url: str


class TokenRequest(BaseModel):
    token: str


class TokenResponse(BaseModel):
    user_id: int
    username: str
