"""
Challenge routes (user-facing):
  GET  /challenge/current
  GET  /challenge/{id}
  GET  /challenge/{id}/download
"""
import os

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.schemas.challenge import ChallengeOut
from app.services import challenge_service
from app.utils.dependencies import get_current_user, valid_object_id

router = APIRouter(prefix="/challenge", tags=["Challenge"])


@router.get("/current", response_model=ChallengeOut)
async def current_challenge(
    _: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Return the currently active weekly challenge."""
    return await challenge_service.get_current_challenge(db)

from typing import List

@router.get("/all", response_model=List[ChallengeOut])
async def all_active_challenges(
    _: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Return all active challenges."""
    return await challenge_service.get_active_challenges(db)


@router.get("/{id}", response_model=ChallengeOut)
async def get_challenge(
    id: str = Depends(valid_object_id),
    _: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Return a specific challenge by its MongoDB ObjectId."""
    return await challenge_service.get_challenge_by_id(id, db)


@router.get("/{id}/download")
async def download_challenge_file(
    id: str = Depends(valid_object_id),
    _: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Download the challenge file attached to a challenge."""
    challenge = await challenge_service.get_challenge_by_id(id, db)
    if not challenge.file_url:
        from fastapi import HTTPException, status
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="No file attached to this challenge")

    file_path = challenge.file_url.lstrip("/")
    if not os.path.exists(file_path):
        from fastapi import HTTPException, status
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="File not found on server")

    return FileResponse(
        path=file_path,
        filename=os.path.basename(file_path),
        media_type="application/octet-stream",
    )
