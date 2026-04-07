"""
Security utilities:
  - Password hashing / verification via bcrypt (direct, no passlib)
  - Flag hashing / verification (SHA-256 with app-level salt)
  - JWT creation / decoding via python-jose
"""
import hashlib
import bcrypt
from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt

from app.config import settings


# ── Password hashing (bcrypt direct — passlib 1.7.4 breaks with bcrypt 4+) ───

def hash_password(plain: str) -> str:
    """Return bcrypt hash of the plain-text password."""
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    """Verify a plain-text password against a stored bcrypt hash."""
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


# ── Flag hashing ──────────────────────────────────────────────────────────────
# SHA-256 is used (not bcrypt) so verification is O(1) and deterministic.
# A fixed application-level salt prevents rainbow-table attacks.

_FLAG_SALT = "cyventura_ctf_salt_2024"


def hash_flag(plain_flag: str) -> str:
    """Return hex SHA-256 digest of salt+flag."""
    salted = _FLAG_SALT + plain_flag.strip()
    return hashlib.sha256(salted.encode()).hexdigest()


def verify_flag(plain_flag: str, stored_hash: str) -> bool:
    return hash_flag(plain_flag) == stored_hash


# ── JWT ───────────────────────────────────────────────────────────────────────

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    payload = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload.update({"exp": expire})
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        return None
