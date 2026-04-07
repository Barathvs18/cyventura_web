"""
Challenge service – CRUD for CTF challenges (user + admin operations).
"""
from datetime import datetime
from typing import List, Optional

from bson import ObjectId
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.schemas.challenge import ChallengeCreateRequest, ChallengeOut
from app.utils.security import hash_flag


# ── Helpers ───────────────────────────────────────────────────────────────────

def _to_out(doc: dict) -> ChallengeOut:
    return ChallengeOut(
        id=str(doc["_id"]),
        title=doc["title"],
        description=doc["description"],
        file_url=doc.get("file_url"),
        points=doc["points"],
        active=doc.get("active", False),
        created_at=doc.get("created_at", datetime.utcnow()),
    )


def _oid(id: str) -> ObjectId:
    if not ObjectId.is_valid(id):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Invalid id: {id}")
    return ObjectId(id)


# ── User-facing reads ─────────────────────────────────────────────────────────

async def get_current_challenge(db: AsyncIOMotorDatabase) -> ChallengeOut:
    doc = await db["challenges"].find_one({"active": True}, sort=[("created_at", -1)])
    if not doc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="No active challenge found")
    return _to_out(doc)

async def get_active_challenges(db: AsyncIOMotorDatabase) -> List[ChallengeOut]:
    cursor = db["challenges"].find({"active": True}).sort("created_at", -1)
    return [_to_out(doc) async for doc in cursor]


async def get_challenge_by_id(challenge_id: str, db: AsyncIOMotorDatabase) -> ChallengeOut:
    doc = await db["challenges"].find_one({"_id": _oid(challenge_id)})
    if not doc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Challenge not found")
    return _to_out(doc)


# ── Admin operations ──────────────────────────────────────────────────────────

async def create_challenge(
    payload: ChallengeCreateRequest, db: AsyncIOMotorDatabase
) -> ChallengeOut:
    doc = {
        "title": payload.title,
        "description": payload.description,
        "file_url": None,
        "flag_hash": hash_flag(payload.flag),
        "points": payload.points,
        "active": payload.active,
        "created_at": datetime.utcnow(),
    }
    result = await db["challenges"].insert_one(doc)
    doc["_id"] = result.inserted_id
    return _to_out(doc)


async def set_challenge_active(
    challenge_id: str, active: bool, db: AsyncIOMotorDatabase
) -> ChallengeOut:
    result = await db["challenges"].find_one_and_update(
        {"_id": _oid(challenge_id)},
        {"$set": {"active": active}},
        return_document=True,
    )
    if not result:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Challenge not found")
    return _to_out(result)


async def attach_file_url(
    challenge_id: str, file_url: str, db: AsyncIOMotorDatabase
) -> ChallengeOut:
    result = await db["challenges"].find_one_and_update(
        {"_id": _oid(challenge_id)},
        {"$set": {"file_url": file_url}},
        return_document=True,
    )
    if not result:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Challenge not found")
    return _to_out(result)


async def delete_challenge(challenge_id: str, db: AsyncIOMotorDatabase) -> None:
    result = await db["challenges"].delete_one({"_id": _oid(challenge_id)})
    if result.deleted_count == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Challenge not found")


async def get_all_challenges(db: AsyncIOMotorDatabase) -> List[ChallengeOut]:
    cursor = db["challenges"].find({}).sort("created_at", -1)
    return [_to_out(doc) async for doc in cursor]
