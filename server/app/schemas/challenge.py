"""
Pydantic schemas for Challenge endpoints.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


# ── Admin: Create challenge ───────────────────────────────────────────────────

class ChallengeCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    flag: str = Field(..., min_length=1, description="Plain-text flag – hashed before storage")
    points: int = Field(default=100, ge=1)
    active: bool = False


# ── Public challenge response (hides flag_hash) ───────────────────────────────

class ChallengeOut(BaseModel):
    id: str
    title: str
    description: str
    file_url: Optional[str] = None
    points: int
    active: bool
    created_at: datetime


# ── Admin challenge response (also hides flag_hash, shows more detail) ────────

class ChallengeAdminOut(ChallengeOut):
    pass   # extend if you ever need to expose extra admin-only fields
