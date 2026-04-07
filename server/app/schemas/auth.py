"""
Pydantic schemas for Auth endpoints (request bodies & responses).
"""
from pydantic import BaseModel, EmailStr, Field


# ── Register ──────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=32)
    email: EmailStr
    password: str = Field(..., min_length=6)


# ── Login ─────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ── Token response ────────────────────────────────────────────────────────────

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Me (GET /auth/me) ─────────────────────────────────────────────────────────

class UserOut(BaseModel):
    id: str
    username: str
    email: str
    role: str
    score: int
    solved_challenges: list[str]
