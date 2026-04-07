"""
Admin routes (admin-only access):
  POST /admin/challenge           – create a new challenge
  POST /admin/upload              – upload a challenge file
  PUT  /admin/challenge/{id}/activate
  PUT  /admin/challenge/{id}/deactivate
  GET  /admin/submissions         – list all flag submissions
  GET  /admin/challenges          – list all challenges
"""
import os
import shutil
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.schemas.challenge import ChallengeCreateRequest, ChallengeOut
from app.schemas.submission import SubmissionOut
from app.services import challenge_service, submission_service
from app.utils.dependencies import require_admin, valid_object_id

router = APIRouter(prefix="/admin", tags=["Admin"])

UPLOAD_DIR = "uploads/challenges"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ── Create challenge ──────────────────────────────────────────────────────────

@router.post("/challenge", response_model=ChallengeOut, status_code=201)
async def create_challenge(
    payload: ChallengeCreateRequest,
    _: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Create a new CTF challenge.
    The flag is hashed (SHA-256 + app salt) before storage.
    """
    return await challenge_service.create_challenge(payload, db)


# ── Upload challenge file ─────────────────────────────────────────────────────

@router.post("/upload", response_model=ChallengeOut)
async def upload_challenge_file(
    challenge_id: str = Form(...),
    file: UploadFile = File(...),
    _: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Upload a file for an existing challenge (multipart/form-data).
    The file is saved to /uploads/challenges/ and its path is stored in MongoDB.
    """
    valid_object_id(challenge_id)

    # Sanitise filename; prepend UUID to avoid collisions
    ext = os.path.splitext(file.filename)[1] if file.filename else ""
    safe_name = f"{uuid.uuid4().hex}{ext}"
    dest_path = os.path.join(UPLOAD_DIR, safe_name)

    try:
        with open(dest_path, "wb") as buf:
            shutil.copyfileobj(file.file, buf)
    except Exception as exc:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File save failed: {exc}",
        )

    file_url = f"/{dest_path.replace(os.sep, '/')}"
    return await challenge_service.attach_file_url(challenge_id, file_url, db)


# ── Activate / Deactivate ─────────────────────────────────────────────────────

@router.put("/challenge/{id}/activate", response_model=ChallengeOut)
async def activate_challenge(
    id: str = Depends(valid_object_id),
    _: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Set a challenge to active=True (makes it the live challenge)."""
    return await challenge_service.set_challenge_active(id, True, db)


@router.put("/challenge/{id}/deactivate", response_model=ChallengeOut)
async def deactivate_challenge(
    id: str = Depends(valid_object_id),
    _: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Set a challenge to active=False."""
    return await challenge_service.set_challenge_active(id, False, db)


# ── View all submissions ──────────────────────────────────────────────────────

@router.get("/submissions", response_model=list[SubmissionOut])
async def list_submissions(
    _: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Return all flag submissions, newest first."""
    return await submission_service.get_all_submissions(db)


# ── View all challenges ───────────────────────────────────────────────────────

@router.get("/challenges", response_model=list[ChallengeOut])
async def list_all_challenges(
    _: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Return all challenges (active and inactive), newest week first."""
    return await challenge_service.get_all_challenges(db)


# ── Delete challenge ──────────────────────────────────────────────────────────

@router.delete("/challenge/{id}", status_code=204)
async def delete_challenge(
    id: str = Depends(valid_object_id),
    _: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Delete a challenge permanently."""
    await challenge_service.delete_challenge(id, db)
