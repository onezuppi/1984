import base64
from fastapi import APIRouter, HTTPException, Depends, Response
from back.models.auth import UserModel
from back.models.channel import ChannelModel
from back.utils.db import get_users_collection, get_photos_collection, get_channels_collection
from back.utils.jwt import verify_and_get_user

router = APIRouter(prefix="/user", tags=["User"])


@router.get("", response_model=UserModel, dependencies=[Depends(verify_and_get_user)])
async def get_current_user(
        user_id: str = Depends(verify_and_get_user),
        users=Depends(get_users_collection),
):
    doc = await users.find_one({"user_id": int(user_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="User not found")
    doc["_id"] = str(doc["_id"])

    return UserModel(**doc)


@router.get("/photo")
async def get_my_photo(
        user_id: str = Depends(verify_and_get_user),
        photos=Depends(get_photos_collection),
):
    photo_doc = await photos.find_one({"user_id": int(user_id)})
    if not photo_doc or not photo_doc.get("avatar_base64"):
        raise HTTPException(status_code=404, detail="Photo not found")
    try:
        img_bytes = base64.b64decode(photo_doc["avatar_base64"])
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to decode image")

    return Response(content=img_bytes, media_type="image/jpeg")
