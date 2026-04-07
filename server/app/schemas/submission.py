"""
Pydantic schemas for Flag Submission endpoint.
"""
from datetime import datetime
from pydantic import BaseModel


# ── Request ───────────────────────────────────────────────────────────────────

class FlagSubmitRequest(BaseModel):
    challenge_id: str
    flag: str


# ── Response ──────────────────────────────────────────────────────────────────

class FlagSubmitResponse(BaseModel):
    correct: bool
    message: str
    points_awarded: int = 0


# ── Submission record (admin view) ────────────────────────────────────────────

class SubmissionOut(BaseModel):
    id: str
    username: str           # resolved from user_id at query time
    challenge_title: str    # resolved from challenge_id at query time
    submitted_flag: str
    is_correct: bool
    submitted_at: datetime
