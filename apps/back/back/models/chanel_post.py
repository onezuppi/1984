from datetime import datetime
from typing import Optional, List, Any

from pydantic import BaseModel, Field


class ChannelPostModel(BaseModel):
    id: str = Field(..., alias="_id")
    chat_id: int
    message_id: int
    date: datetime
    text: Optional[str] = ""
    caption: Optional[str] = ""
    entities: Optional[List[Any]] = []
    media_group_id: Optional[str] = None
    author_signature: Optional[str] = None
    from_chat_title: Optional[str] = None
    from_chat_username: Optional[str] = None
    type: str
    has_media: bool = False
    photo: Optional[List[str]] = None
    video: Optional[str] = None
    document: Optional[str] = None
    audio: Optional[str] = None
    voice: Optional[str] = None

    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            int: lambda v: v
        }