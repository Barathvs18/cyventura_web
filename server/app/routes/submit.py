"""
Submit flag route: POST /submit-flag
"""
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.schemas.submission import FlagSubmitRequest, FlagSubmitResponse
from app.services import submission_service
from app.utils.dependencies import get_current_user

router = APIRouter(tags=["Submit"])


@router.post("/submit-flag", response_model=FlagSubmitResponse)
async def submit_flag(
    payload: FlagSubmitRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Submit a flag for a CTF challenge.

    - Hashes the submitted flag and compares with stored hash.
    - Prevents duplicate solves.
    - Rate-limits to 5 attempts per 10 minutes.
    - Awards points on correct submission.
    """
    return await submission_service.submit_flag(payload, current_user, db)
