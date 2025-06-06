import base64
from typing import List
from fastapi import APIRouter, HTTPException, Depends, Response
from back.models.channel import ChannelModel
from back.utils.db import get_channels_collection
from back.utils.jwt import verify_and_get_user

router = APIRouter(prefix="/channels", tags=["Channels"])


@router.get("", response_model=List[ChannelModel])
async def get_user_channels(
    user_id: str = Depends(verify_and_get_user),
    channels=Depends(get_channels_collection),
):
    cursor = channels.find({"user_id": int(user_id)})
    channels_list = []
    async for channel in cursor:
        channels_list.append(ChannelModel(**channel))
    if not channels_list:
        raise HTTPException(status_code=404, detail="No channels found for this user.")

    return channels_list


@router.get("/{channel_id}", response_model=ChannelModel)
async def get_channel_by_id(
    channel_id: int,
    user_id: str = Depends(verify_and_get_user),
    channels=Depends(get_channels_collection),
):
    channel_doc = await channels.find_one({"_id": channel_id, "user_id": int(user_id)})
    if not channel_doc:
        raise HTTPException(status_code=404, detail="Channel not found or access denied.")

    return ChannelModel(**channel_doc)