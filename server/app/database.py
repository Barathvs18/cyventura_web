"""
MongoDB Atlas connection handler using Motor async driver.
Provides a reusable dependency for injecting the database.
"""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Module-level client – single shared connection pool
_client: AsyncIOMotorClient | None = None


async def connect_to_mongo() -> None:
    """Called once at application startup."""
    global _client
    _client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        serverSelectionTimeoutMS=5000,
    )
    # Verify the connection is alive
    await _client.admin.command("ping")
    logger.info("✅  Connected to MongoDB Atlas")


async def close_mongo_connection() -> None:
    """Called once at application shutdown."""
    global _client
    if _client:
        _client.close()
        logger.info("🛑  MongoDB connection closed")


def get_database() -> AsyncIOMotorDatabase:
    """
    FastAPI dependency – returns the active database instance.

    Usage:
        db: AsyncIOMotorDatabase = Depends(get_database)
    """
    if _client is None:
        raise RuntimeError("Database client is not initialised. Did you call connect_to_mongo()?")
    return _client[settings.DATABASE_NAME]
