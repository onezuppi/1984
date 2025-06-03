from typing import List

from fastapi import APIRouter, Depends, HTTPException

from back.models.chanel_post import ChannelPostModel
from back.utils.db import get_channel_posts_collection, get_channels_collection
from back.utils.jwt import verify_and_get_user

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.get("/{channel_id}", response_model=List[ChannelPostModel])
async def get_posts_by_channel(
        channel_id: int,
        user_id: str = Depends(verify_and_get_user),
        posts=Depends(get_channel_posts_collection),
        channels=Depends(get_channels_collection),
):
    channel = await channels.find_one({"_id": channel_id, "user_id": int(user_id)})
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found or not owned by user.")

    cursor = posts.find({"chat_id": channel_id})
    posts_list = []
    async for post in cursor:
        posts_list.append(ChannelPostModel(**post))
    if not posts_list:
        raise HTTPException(status_code=404, detail="No posts found for this channel.")

    return posts_list
