"""
Leaderboard route: GET /leaderboard
"""
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.schemas.leaderboard import LeaderboardResponse
from app.services import leaderboard_service
from app.utils.dependencies import get_current_user

router = APIRouter(tags=["Leaderboard"])


@router.get("/leaderboard", response_model=LeaderboardResponse)
async def leaderboard(
    _: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Return all users ranked by score (highest first). Requires authentication."""
    return await leaderboard_service.get_leaderboard(db)
