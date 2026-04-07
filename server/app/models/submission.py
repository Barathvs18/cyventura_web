"""
Submission MongoDB document model.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class SubmissionInDB(BaseModel):
    """Represents the Submission document as stored in MongoDB."""
    id: Optional[str] = Field(default=None, alias="_id")
    user_id: str
    challenge_id: str
    submitted_flag: str
    is_correct: bool
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
