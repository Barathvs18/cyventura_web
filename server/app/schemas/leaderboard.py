"""
Pydantic schema for leaderboard response.
"""
from pydantic import BaseModel


class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    score: int
    solved_count: int


class LeaderboardResponse(BaseModel):
    leaderboard: list[LeaderboardEntry]
    total: int
