"""
Pydantic models (MongoDB document shapes).
These represent the data as stored in MongoDB.
"""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


# ─── User ────────────────────────────────────────────────────────────────────

class UserModel(BaseModel):
    """Represents a user document stored in MongoDB."""
    id: Optional[str] = Field(default=None, alias="_id")
    name: str
    email: EmailStr
    hashed_password: str
    bio: Optional[str] = None
    department: Optional[str] = None
    year: Optional[int] = None
    profile_picture: Optional[str] = None  # URL
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


# ─── Post ────────────────────────────────────────────────────────────────────

class CommentModel(BaseModel):
    """Embedded comment inside a post document."""
    comment_id: str          # UUID string
    user_id: str
    user_name: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class PostModel(BaseModel):
    """Represents a post document stored in MongoDB."""
    id: Optional[str] = Field(default=None, alias="_id")
    title: str
    content: str
    category: str = "announcement"     # announcement | event
    author_id: str
    author_name: str
    image_url: Optional[str] = None
    event_date: Optional[datetime] = None   # for event posts
    likes: list[str] = []              # list of user_ids who liked
    comments: list[CommentModel] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}
