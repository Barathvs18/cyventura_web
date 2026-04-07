"""
Challenge MongoDB document model.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ChallengeInDB(BaseModel):
    """Represents the Challenge document as stored in MongoDB."""
    id: Optional[str] = Field(default=None, alias="_id")
    title: str
    description: str
    file_url: Optional[str] = None      # relative path served via /uploads/
    flag_hash: str                       # bcrypt hash of the correct flag
    points: int = 100
    week_number: int
    active: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
