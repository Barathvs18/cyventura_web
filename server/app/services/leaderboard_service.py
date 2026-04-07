"""
Leaderboard service – users ranked by score descending.
"""
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.schemas.leaderboard import LeaderboardEntry, LeaderboardResponse


async def get_leaderboard(db: AsyncIOMotorDatabase) -> LeaderboardResponse:
    cursor = db["users"].find(
        {"role": "user"},
        {"username": 1, "score": 1, "solved_challenges": 1},
    ).sort("score", -1)

    entries = []
    rank = 1
    async for doc in cursor:
        entries.append(LeaderboardEntry(
            rank=rank,
            username=doc["username"],
            score=doc.get("score", 0),
            solved_count=len(doc.get("solved_challenges", [])),
        ))
        rank += 1

    return LeaderboardResponse(leaderboard=entries, total=len(entries))
