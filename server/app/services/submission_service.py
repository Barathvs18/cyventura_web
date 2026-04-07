"""
Submission service – flag submission logic with rate limiting.
"""
from datetime import datetime, timedelta

from bson import ObjectId
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.schemas.submission import FlagSubmitRequest, FlagSubmitResponse, SubmissionOut
from app.utils.security import verify_flag

# Rate-limit: max N attempts per user per challenge within a window
_RATE_LIMIT_ATTEMPTS = 5
_RATE_LIMIT_WINDOW_MINUTES = 10


async def submit_flag(
    payload: FlagSubmitRequest,
    current_user: dict,
    db: AsyncIOMotorDatabase,
) -> FlagSubmitResponse:
    user_id = current_user["_id"]
    challenge_id = payload.challenge_id

    # ── Validate ObjectId ─────────────────────────────────────────────────────
    if not ObjectId.is_valid(challenge_id):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid challenge_id")

    # ── Fetch challenge ───────────────────────────────────────────────────────
    challenge = await db["challenges"].find_one({"_id": ObjectId(challenge_id)})
    if not challenge or not challenge.get("active"):
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Challenge not found or inactive")

    # ── Prevent duplicate solve ───────────────────────────────────────────────
    if challenge_id in current_user.get("solved_challenges", []):
        raise HTTPException(status.HTTP_409_CONFLICT, detail="You already solved this challenge")

    # ── Rate limiting ─────────────────────────────────────────────────────────
    window_start = datetime.utcnow() - timedelta(minutes=_RATE_LIMIT_WINDOW_MINUTES)
    recent_attempts = await db["submissions"].count_documents({
        "user_id": user_id,
        "challenge_id": challenge_id,
        "submitted_at": {"$gte": window_start},
    })
    if recent_attempts >= _RATE_LIMIT_ATTEMPTS:
        raise HTTPException(
            status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many attempts. Try again after {_RATE_LIMIT_WINDOW_MINUTES} minutes.",
        )

    # ── Verify flag ───────────────────────────────────────────────────────────
    is_correct = verify_flag(payload.flag, challenge["flag_hash"])
    points_awarded = 0

    # ── Record submission ─────────────────────────────────────────────────────
    submission_doc = {
        "user_id": user_id,
        "challenge_id": challenge_id,
        "submitted_flag": payload.flag,
        "is_correct": is_correct,
        "submitted_at": datetime.utcnow(),
    }
    await db["submissions"].insert_one(submission_doc)

    # ── Update user on correct submission ─────────────────────────────────────
    if is_correct:
        points_awarded = challenge["points"]
        await db["users"].update_one(
            {"_id": ObjectId(user_id)},
            {
                "$inc": {"score": points_awarded},
                "$addToSet": {"solved_challenges": challenge_id},
            },
        )
        return FlagSubmitResponse(
            correct=True,
            message=f"🎉 Correct! You earned {points_awarded} points.",
            points_awarded=points_awarded,
        )

    return FlagSubmitResponse(correct=False, message="❌ Incorrect flag. Try again!")


async def get_all_submissions(db: AsyncIOMotorDatabase) -> list[SubmissionOut]:
    # Fetch all submissions newest first
    submissions = await db["submissions"].find({}).sort("submitted_at", -1).to_list(length=1000)

    if not submissions:
        return []

    # ── Batch-resolve usernames ────────────────────────────────────────────────
    unique_user_ids = list({s["user_id"] for s in submissions if ObjectId.is_valid(s["user_id"])})
    user_docs = await db["users"].find(
        {"_id": {"$in": [ObjectId(uid) for uid in unique_user_ids]}},
        {"_id": 1, "username": 1},
    ).to_list(length=None)
    user_map = {str(u["_id"]): u["username"] for u in user_docs}

    # ── Batch-resolve challenge titles ────────────────────────────────────────
    unique_challenge_ids = list({s["challenge_id"] for s in submissions if ObjectId.is_valid(s["challenge_id"])})
    challenge_docs = await db["challenges"].find(
        {"_id": {"$in": [ObjectId(cid) for cid in unique_challenge_ids]}},
        {"_id": 1, "title": 1},
    ).to_list(length=None)
    challenge_map = {str(c["_id"]): c["title"] for c in challenge_docs}

    # ── Build response ─────────────────────────────────────────────────────────
    results = []
    for doc in submissions:
        username = user_map.get(doc["user_id"], f"Unknown ({doc['user_id'][:8]}...)")
        challenge_title = challenge_map.get(doc["challenge_id"], f"Deleted Challenge ({doc['challenge_id'][:8]}...)")
        results.append(SubmissionOut(
            id=str(doc["_id"]),
            username=username,
            challenge_title=challenge_title,
            submitted_flag=doc["submitted_flag"],
            is_correct=doc["is_correct"],
            submitted_at=doc["submitted_at"],
        ))
    return results
