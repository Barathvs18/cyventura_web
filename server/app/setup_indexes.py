"""
Create MongoDB indexes for the CTF platform.
Run once after deployment:
    python -m app.setup_indexes

Indexes created:
  users        – unique email, unique username, score desc (leaderboard)
  challenges   – active flag, week_number desc
  submissions  – compound (user_id + challenge_id), submitted_at desc
"""
import asyncio
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def create_indexes() -> None:
    client = AsyncIOMotorClient(settings.MONGODB_URI.strip())
    db = client[settings.DATABASE_NAME]

    # ── users ──────────────────────────────────────────────────────────────────
    await db["users"].create_index("email", unique=True)
    await db["users"].create_index("username", unique=True)
    await db["users"].create_index([("score", -1)])       # leaderboard sort
    logger.info("✅  users indexes created")

    # ── challenges ─────────────────────────────────────────────────────────────
    await db["challenges"].create_index("active")
    await db["challenges"].create_index([("week_number", -1)])
    logger.info("✅  challenges indexes created")

    # ── submissions ────────────────────────────────────────────────────────────
    # Compound index to quickly check if a user already solved a challenge
    await db["submissions"].create_index(
        [("user_id", 1), ("challenge_id", 1), ("submitted_at", -1)]
    )
    logger.info("✅  submissions indexes created")

    client.close()
    logger.info("🎉  All indexes created successfully for database: %s", settings.DATABASE_NAME)


if __name__ == "__main__":
    asyncio.run(create_indexes())
