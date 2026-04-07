"""
Application configuration using Pydantic Settings.
Reads all values from environment variables / .env file.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Cyventura CTF Platform"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = False

    # MongoDB – defaults to local so the app starts even without .env
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "cyventura_ctf"

    # JWT – must be set in .env for production
    JWT_SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION_USE_STRONG_SECRET"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """
    Cached settings instance – only reads .env once per process.
    Use FastAPI's Depends(get_settings) to inject settings.
    """
    return Settings()


settings = get_settings()
