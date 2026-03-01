"""
Post / feed routes:
  POST   /api/posts/              – create post  (auth required)
  GET    /api/posts/              – list all posts (paginated, public)
  GET    /api/posts/{post_id}     – single post with comments (public)
  POST   /api/posts/{post_id}/like     – toggle like (auth required)
  POST   /api/posts/{post_id}/comment  – add comment (auth required)
  DELETE /api/posts/{post_id}          – delete post (author only)
"""
import uuid
from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.schemas.schemas import (
    CommentRequest,
    CommentResponse,
    CreatePostRequest,
    MessageResponse,
    PostListResponse,
    PostResponse,
)
from app.utils.helpers import serialize_doc
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/posts", tags=["Posts"])


# ─── Helper ───────────────────────────────────────────────────────────────────

def _build_post_response(doc: dict) -> PostResponse:
    data = serialize_doc(doc)
    data["likes_count"] = len(data.get("likes", []))
    data["comments_count"] = len(data.get("comments", []))
    return PostResponse(**data)


async def _get_post_or_404(post_id: str, db: AsyncIOMotorDatabase) -> dict:
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid post ID format.")
    doc = await db["posts"].find_one({"_id": ObjectId(post_id)})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")
    return doc


# ─── Routes ───────────────────────────────────────────────────────────────────

@router.post(
    "/",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new post",
)
async def create_post(
    payload: CreatePostRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    """Create an announcement or event post. Requires authentication."""
    now = datetime.utcnow()
    post_doc = {
        "title": payload.title.strip(),
        "content": payload.content.strip(),
        "category": payload.category,
        "author_id": str(current_user["_id"]),
        "author_name": current_user["name"],
        "image_url": payload.image_url,
        "event_date": payload.event_date,
        "likes": [],
        "comments": [],
        "created_at": now,
        "updated_at": now,
    }
    result = await db["posts"].insert_one(post_doc)
    post_doc["_id"] = result.inserted_id
    return _build_post_response(post_doc)


@router.get(
    "/",
    response_model=PostListResponse,
    summary="Fetch all posts (paginated)",
)
async def list_posts(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=50),
    category: str | None = Query(default=None, pattern="^(announcement|event)$"),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Returns a paginated list of posts, newest first.
    Optionally filter by `category` (announcement | event).
    """
    query: dict = {}
    if category:
        query["category"] = category

    total = await db["posts"].count_documents(query)
    skip = (page - 1) * page_size

    cursor = db["posts"].find(query).sort("created_at", -1).skip(skip).limit(page_size)
    posts = [_build_post_response(doc) async for doc in cursor]

    return PostListResponse(total=total, page=page, page_size=page_size, posts=posts)


@router.get(
    "/{post_id}",
    response_model=PostResponse,
    summary="Fetch a single post with all comments",
)
async def get_post(
    post_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    doc = await _get_post_or_404(post_id, db)
    return _build_post_response(doc)


@router.post(
    "/{post_id}/like",
    response_model=MessageResponse,
    summary="Toggle like on a post",
)
async def toggle_like(
    post_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    """
    Like a post if the user hasn't liked it yet; unlike it otherwise.
    Likes are stored as a list of user_id strings inside the post document.
    """
    doc = await _get_post_or_404(post_id, db)
    user_id_str = str(current_user["_id"])

    if user_id_str in doc.get("likes", []):
        # Unlike
        await db["posts"].update_one(
            {"_id": doc["_id"]},
            {"$pull": {"likes": user_id_str}, "$set": {"updated_at": datetime.utcnow()}},
        )
        return MessageResponse(message="Like removed.")
    else:
        # Like
        await db["posts"].update_one(
            {"_id": doc["_id"]},
            {"$addToSet": {"likes": user_id_str}, "$set": {"updated_at": datetime.utcnow()}},
        )
        return MessageResponse(message="Post liked.")


@router.post(
    "/{post_id}/comment",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a comment to a post",
)
async def add_comment(
    post_id: str,
    payload: CommentRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    """Adds an embedded comment to the post document."""
    doc = await _get_post_or_404(post_id, db)

    comment = {
        "comment_id": str(uuid.uuid4()),
        "user_id": str(current_user["_id"]),
        "user_name": current_user["name"],
        "content": payload.content.strip(),
        "created_at": datetime.utcnow(),
    }

    await db["posts"].update_one(
        {"_id": doc["_id"]},
        {"$push": {"comments": comment}, "$set": {"updated_at": datetime.utcnow()}},
    )

    return CommentResponse(**comment)


@router.delete(
    "/{post_id}",
    response_model=MessageResponse,
    summary="Delete a post (author only)",
)
async def delete_post(
    post_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    """Only the post author can delete their own post."""
    doc = await _get_post_or_404(post_id, db)

    if doc["author_id"] != str(current_user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorised to delete this post.",
        )

    await db["posts"].delete_one({"_id": doc["_id"]})
    return MessageResponse(message="Post deleted successfully.")
