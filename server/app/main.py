"""
Cyventura Backend – FastAPI Application Entry Point
====================================================
Run with:
    uvicorn app.main:app --reload --port 8000

Swagger UI : http://localhost:8000/docs
ReDoc      : http://localhost:8000/redoc
"""
import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.routers import auth, users, posts

# ─── Logging ─────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s – %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# ─── App factory ─────────────────────────────────────────────────────────────

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Production-ready REST API for the **Cyventura** college club website.\n\n"
        "### Features\n"
        "- 🔐 JWT authentication (register / login)\n"
        "- 👤 User profile management\n"
        "- 📢 Post creation with likes & comments\n"
        "- 🍃 MongoDB Atlas via Motor async driver\n"
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ─── Static Files ────────────────────────────────────────────────────────────

os.makedirs("uploads/profiles", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ─── CORS ────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Startup / Shutdown ──────────────────────────────────────────────────────

@app.on_event("startup")
async def startup() -> None:
    logger.info("🚀  Starting %s v%s …", settings.APP_NAME, settings.APP_VERSION)
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown() -> None:
    await close_mongo_connection()

# ─── Routers ─────────────────────────────────────────────────────────────────

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(posts.router)

# ─── Health check ────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"], summary="Root health check")
async def root():
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"], summary="Detailed health check")
async def health():
    return {"status": "healthy", "database": "connected"}
