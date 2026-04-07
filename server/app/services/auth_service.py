"""
Auth service – register, login, fetch current user.
"""
from datetime import timedelta

from bson import ObjectId
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.config import settings
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserOut
from app.utils.security import hash_password, verify_password, create_access_token


async def register_user(payload: RegisterRequest, db: AsyncIOMotorDatabase) -> UserOut:
    # Duplicate checks
    if await db["users"].find_one({"email": payload.email}):
        raise HTTPException(status.HTTP_409_CONFLICT, detail="Email already registered")
    if await db["users"].find_one({"username": payload.username}):
        raise HTTPException(status.HTTP_409_CONFLICT, detail="Username already taken")

    doc = {
        "username": payload.username,
        "email": payload.email,
        "password_hash": hash_password(payload.password),
        "role": "user",
        "score": 0,
        "solved_challenges": [],
    }
    result = await db["users"].insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return _to_user_out(doc)


async def login_user(payload: LoginRequest, db: AsyncIOMotorDatabase) -> TokenResponse:
    user = await db["users"].find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(
        data={"sub": str(user["_id"]), "role": user["role"]},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return TokenResponse(access_token=token)


def get_me(user: dict) -> UserOut:
    return _to_user_out(user)


# ── Helpers ───────────────────────────────────────────────────────────────────

def _to_user_out(doc: dict) -> UserOut:
    return UserOut(
        id=str(doc.get("_id", "")),
        username=doc["username"],
        email=doc["email"],
        role=doc["role"],
        score=doc.get("score", 0),
        solved_challenges=doc.get("solved_challenges", []),
    )
