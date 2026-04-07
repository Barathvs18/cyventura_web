"""
Cyventura CTF Platform – FastAPI Application Entry Point
=========================================================
Run with:
    uvicorn app.main:app --reload --port 8000

Swagger UI : http://localhost:8000/docs
ReDoc      : http://localhost:8000/redoc
"""
import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection

# CTF routers – import directly from submodules (avoids circular import via __init__)
from app.routes.auth import router as auth_router
from app.routes.challenge import router as challenge_router
from app.routes.submit import router as submit_router
from app.routes.leaderboard import router as leaderboard_router
from app.routes.admin import router as admin_router

# ─── Logging ─────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# ─── Lifespan (replaces deprecated @app.on_event) ────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Cyventura CTF API v%s ...", settings.APP_VERSION)
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

# ─── App factory ─────────────────────────────────────────────────────────────

app = FastAPI(
    title="Cyventura CTF Platform API",
    version=settings.APP_VERSION,
    description=(
        "Weekly CTF Challenge Platform REST API.\n\n"
        "### Roles\n"
        "- User - register, view challenges, submit flags, see leaderboard\n"
        "- Admin - create/manage challenges, upload files, view all submissions\n\n"
        "### Security\n"
        "- JWT Bearer authentication\n"
        "- bcrypt password hashing\n"
        "- SHA-256 flag hashing with app-level salt\n"
        "- Rate-limited flag submissions (5 per 10 min)\n"
        "- Duplicate-solve prevention\n"
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# ─── Static / Upload directories ─────────────────────────────────────────────

os.makedirs("uploads/challenges", exist_ok=True)
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

# ─── Routers ─────────────────────────────────────────────────────────────────

app.include_router(auth_router)
app.include_router(challenge_router)
app.include_router(submit_router)
app.include_router(leaderboard_router)
app.include_router(admin_router)

# ─── Health checks ───────────────────────────────────────────────────────────

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
