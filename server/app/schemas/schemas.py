"""
Pydantic request/response schemas (API layer).
Separated from MongoDB models to decouple the API contract from storage.
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime


# ─── Auth Schemas ─────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit.")
        if not any(c.isalpha() for c in v):
            raise ValueError("Password must contain at least one letter.")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ─── User Schemas ─────────────────────────────────────────────────────────────

class UserResponse(BaseModel):
    """Safe public representation of a user (no password)."""
    id: str
    name: str
    email: EmailStr
    bio: Optional[str] = None
    department: Optional[str] = None
    year: Optional[int] = None
    profile_picture: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    bio: Optional[str] = Field(default=None, max_length=500)
    department: Optional[str] = Field(default=None, max_length=100)
    year: Optional[int] = Field(default=None, ge=1, le=6)
    profile_picture: Optional[str] = None  # URL to hosted image


# ─── Post Schemas ─────────────────────────────────────────────────────────────

class CommentRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)


class CommentResponse(BaseModel):
    comment_id: str
    user_id: str
    user_name: str
    content: str
    created_at: datetime


class CreatePostRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    content: str = Field(..., min_length=10, max_length=5000)
    category: str = Field(default="announcement", pattern="^(announcement|event)$")
    image_url: Optional[str] = None
    event_date: Optional[datetime] = None


class PostResponse(BaseModel):
    id: str
    title: str
    content: str
    category: str
    author_id: str
    author_name: str
    image_url: Optional[str] = None
    event_date: Optional[datetime] = None
    likes: list[str]
    likes_count: int
    comments: list[CommentResponse]
    comments_count: int
    created_at: datetime
    updated_at: datetime


class PostListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    posts: list[PostResponse]


# ─── Generic ─────────────────────────────────────────────────────────────────

class MessageResponse(BaseModel):
    message: str
