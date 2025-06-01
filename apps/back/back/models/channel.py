from typing import Optional

from pydantic import BaseModel, Field


class ChannelModel(BaseModel):
    id: int = Field(..., alias="_id")
    title: str
    username: Optional[str] = None
    type: str
    description: Optional[str] = None
    invite_link: Optional[str] = None
    is_private: bool
    user_id: int

    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            int: lambda v: v
        }
