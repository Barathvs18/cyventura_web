"""
FastAPI dependency injection helpers:
  - get_current_user  – validates JWT, returns user doc from DB
  - require_admin     – asserts the current user has role == "admin"
  - valid_object_id   – validates MongoDB ObjectId path parameters
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.utils.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ── Current user ──────────────────────────────────────────────────────────────

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict:
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exc

    user_id: str = payload.get("sub")
    if not user_id or not ObjectId.is_valid(user_id):
        raise credentials_exc

    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_exc

    user["_id"] = str(user["_id"])
    return user


# ── Admin guard ───────────────────────────────────────────────────────────────

async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


# ── ObjectId validator ────────────────────────────────────────────────────────

def valid_object_id(id: str) -> str:
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid ObjectId: {id}",
        )
    return id
