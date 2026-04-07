"""
Auth routes: POST /auth/register, POST /auth/login, GET /auth/me
"""
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserOut
from app.services import auth_service
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserOut, status_code=201)
async def register(
    payload: RegisterRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Register a new user account."""
    return await auth_service.register_user(payload, db)


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Authenticate and receive a JWT access token."""
    return await auth_service.login_user(payload, db)


@router.get("/me", response_model=UserOut)
async def me(current_user: dict = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return auth_service.get_me(current_user)
