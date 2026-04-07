"""
User MongoDB document model.
"""
from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from pydantic import BaseModel, Field


class UserInDB(BaseModel):
    """Represents the User document as stored in MongoDB."""
    id: Optional[str] = Field(default=None, alias="_id")
    username: str
    email: str
    password_hash: str
    role: str = "user"        # "user" | "admin"
    score: int = 0
    solved_challenges: List[str] = []   # list of challenge_id strings
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
