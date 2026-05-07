"""
Admin routes (admin-only access):
  POST   /admin/challenge              – create a new challenge
  POST   /admin/upload                 – upload a challenge file
  PUT    /admin/challenge/{id}/activate
  PUT    /admin/challenge/{id}/deactivate
  GET    /admin/submissions            – list all flag submissions
  GET    /admin/challenges             – list all challenges
  GET    /admin/users                  – list all registered users
  DELETE /admin/user/{id}              – remove a user by ID
"""
import os
import shutil
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.schemas.auth import RegisterRequest, UserOut
from app.schemas.challenge import ChallengeCreateRequest, ChallengeOut
from app.schemas.submission import SubmissionOut
from app.services import auth_service, challenge_service, submission_service
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


# ── Register User (Admin Only) ────────────────────────────────────────────────

@router.post("/register", response_model=UserOut, status_code=201)
async def register_user(
    payload: RegisterRequest,
    _: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Register a new user account (Admin only).
    """
    return await auth_service.register_user(payload, db)


# ── List all users ────────────────────────────────────────────────────────────

@router.get("/users", response_model=list[UserOut])
async def list_all_users(
    _: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Return all registered users (admin only)."""
    users = await db["users"].find().to_list(length=1000)
    result = []
    for u in users:
        result.append(UserOut(
            id=str(u["_id"]),
            username=u.get("username", ""),
            email=u.get("email", ""),
            role=u.get("role", "user"),
            score=u.get("score", 0),
            solved_challenges=[str(s) for s in u.get("solved_challenges", [])],
        ))
    return result


# ── Delete a user ─────────────────────────────────────────────────────────────

@router.delete("/user/{id}", status_code=204)
async def delete_user(
    id: str = Depends(valid_object_id),
    current_admin: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Permanently delete a user account (admin only). Cannot delete yourself."""
    from bson import ObjectId
    if str(current_admin.get("_id", "")) == id:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="You cannot delete your own admin account.")
    result = await db["users"].delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found.")

