"""
User profile routes (all protected by JWT):
  GET    /api/users/me         – get own profile
  PUT    /api/users/me         – update profile
  DELETE /api/users/me         – delete account
"""
from fastapi import APIRouter, HTTPException, status, Depends, File, UploadFile, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
import os
import shutil
import uuid

from app.database import get_database
from app.schemas.schemas import UserResponse, UpdateProfileRequest, MessageResponse
from app.utils.security import get_current_user
from app.utils.helpers import serialize_doc

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user's profile",
)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    """Returns the authenticated user's profile."""
    return UserResponse(**serialize_doc(current_user))


@router.put(
    "/me",
    response_model=UserResponse,
    summary="Update current user's profile",
)
async def update_my_profile(
    payload: UpdateProfileRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    """
    Update editable profile fields.
    Only provided (non-None) fields are updated (PATCH-like behaviour).
    """
    update_data = payload.model_dump(exclude_none=True)

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No fields provided to update.",
        )

    update_data["updated_at"] = datetime.utcnow()

    await db["users"].update_one(
        {"_id": current_user["_id"]},
        {"$set": update_data},
    )

    updated_user = await db["users"].find_one({"_id": current_user["_id"]})
    return UserResponse(**serialize_doc(updated_user))


@router.post(
    "/me/profile_picture",
    response_model=UserResponse,
    summary="Upload a new profile picture",
)
async def upload_profile_picture(
    request: Request,
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    """
    Upload a profile picture for the current user and save it locally in uploads/profiles.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    file_ext = os.path.splitext(file.filename)[1]
    if not file_ext:
        file_ext = ".png"
    
    filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join("uploads", "profiles", filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Build full URL
    base_url = str(request.base_url)
    image_url = f"{base_url}uploads/profiles/{filename}"

    await db["users"].update_one(
        {"_id": current_user["_id"]},
        {"$set": {"profile_picture": image_url, "updated_at": datetime.utcnow()}},
    )

    updated_user = await db["users"].find_one({"_id": current_user["_id"]})
    return UserResponse(**serialize_doc(updated_user))


@router.delete(
    "/me",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete current user's account",
)
async def delete_my_account(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    """
    Permanently deletes the authenticated user's account.
    Also removes all posts authored by the user.
    """
    user_id_str = str(current_user["_id"])

    # Delete user document
    await db["users"].delete_one({"_id": current_user["_id"]})

    # Cascade-delete the user's posts
    await db["posts"].delete_many({"author_id": user_id_str})

    return MessageResponse(message="Account and associated content deleted successfully.")
