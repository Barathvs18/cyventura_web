"""
Authentication routes:
  POST /api/auth/register  – create account
  POST /api/auth/login     – obtain JWT
"""
from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime

from app.database import get_database
from app.schemas.schemas import RegisterRequest, LoginRequest, TokenResponse, UserResponse, MessageResponse
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.helpers import serialize_doc

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
async def register(
    payload: RegisterRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Register a new user account.

    - Prevents duplicate email registration.
    - Stores bcrypt-hashed password – plain text is never persisted.
    """
    # Duplicate email check
    existing = await db["users"].find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    now = datetime.utcnow()
    user_doc = {
        "name": payload.name.strip(),
        "email": payload.email.lower(),
        "hashed_password": hash_password(payload.password),
        "bio": None,
        "department": None,
        "year": None,
        "profile_picture": None,
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }

    result = await db["users"].insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    return UserResponse(**serialize_doc(user_doc))


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login and receive a JWT access token",
)
async def login(
    payload: LoginRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Authenticate with email + password.
    Returns a JWT Bearer token valid for 24 hours (configurable).
    """
    user = await db["users"].find_one({"email": payload.email.lower()})

    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Contact an administrator.",
        )

    token = create_access_token(data={"sub": str(user["_id"])})
    return TokenResponse(access_token=token)
