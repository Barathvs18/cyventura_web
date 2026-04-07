"""
MongoDB Atlas connection handler using Motor async driver.
Provides a reusable dependency for injecting the database.

Graceful startup: if MongoDB is unreachable at boot the server still starts;
individual requests will surface a 503 error until the DB reconnects.
"""
import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from fastapi import HTTPException, status
from app.config import settings

logger = logging.getLogger(__name__)

# Module-level client – single shared connection pool
_client: AsyncIOMotorClient | None = None


async def connect_to_mongo() -> None:
    """Called once at application startup."""
    global _client
    try:
        _client = AsyncIOMotorClient(
            settings.MONGODB_URI.strip(),
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
        )
        # Verify the connection is alive
        await _client.admin.command("ping")
        logger.info("✅  Connected to MongoDB  (db=%s)", settings.DATABASE_NAME)
    except Exception as exc:
        logger.warning(
            "⚠️  Could not connect to MongoDB at startup: %s\n"
            "   The server will still start – requests requiring the DB will return 503.",
            exc,
        )
        # Don't raise – allow the app to start even if DB is unreachable


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
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database not available. Check your MONGODB_URI in .env",
        )
    return _client[settings.DATABASE_NAME]
