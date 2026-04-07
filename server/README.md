# Cyventura CTF Platform — Backend

A fully async **FastAPI + MongoDB** backend for the **Weekly CTF Challenge Platform**.

---

## Project Structure

```
server/
├── app/
│   ├── main.py                  # App entry point, router wiring
│   ├── database.py              # Motor async MongoDB client + DI
│   ├── config.py                # Pydantic settings (reads .env)
│   ├── setup_indexes.py         # One-time MongoDB index creation
│   │
│   ├── models/                  # MongoDB document shapes
│   │   ├── user.py
│   │   ├── challenge.py
│   │   └── submission.py
│   │
│   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── auth.py
│   │   ├── challenge.py
│   │   ├── submission.py
│   │   └── leaderboard.py
│   │
│   ├── services/                # Business logic layer
│   │   ├── auth_service.py
│   │   ├── challenge_service.py
│   │   ├── submission_service.py
│   │   └── leaderboard_service.py
│   │
│   ├── routes/                  # FastAPI routers
│   │   ├── auth.py
│   │   ├── challenge.py
│   │   ├── submit.py
│   │   ├── leaderboard.py
│   │   └── admin.py
│   │
│   └── utils/
│       ├── security.py          # bcrypt, SHA-256 flag hash, JWT
│       └── dependencies.py      # get_current_user, require_admin, valid_object_id
│
├── uploads/
│   └── challenges/              # Uploaded challenge files stored here
├── .env                         # Real secrets (git-ignored)
├── .env.example                 # Template — copy to .env
└── requirements.txt
```

---

## Quick Start

### 1. Set up environment

```bash
cd server
cp .env.example .env
# Edit .env — set MONGODB_URI and a strong JWT_SECRET_KEY
```

### 2. Create virtual environment & install deps

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

### 3. (Optional) Create MongoDB indexes

```bash
python -m app.setup_indexes
```

### 4. Run the server

```bash
uvicorn app.main:app --reload --port 8000
```

- **Swagger UI** → http://localhost:8000/docs  
- **ReDoc**      → http://localhost:8000/redoc

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register a new user |
| POST | `/auth/login` | ❌ | Login → returns JWT |
| GET  | `/auth/me` | ✅ | Get current user profile |

### Challenges (User)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/challenge/current` | ✅ | Get active weekly challenge |
| GET | `/challenge/{id}` | ✅ | Get challenge by ID |
| GET | `/challenge/{id}/download` | ✅ | Download challenge file |

### Submit Flag
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/submit-flag` | ✅ | Submit a flag (rate-limited: 5/10min) |

### Leaderboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/leaderboard` | ✅ | Users ranked by score descending |

### Admin (role=admin only)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/admin/challenge` | 🛡️ | Create a new challenge |
| POST | `/admin/upload` | 🛡️ | Upload a challenge file |
| PUT  | `/admin/challenge/{id}/activate` | 🛡️ | Activate challenge |
| PUT  | `/admin/challenge/{id}/deactivate` | 🛡️ | Deactivate challenge |
| GET  | `/admin/submissions` | 🛡️ | View all submissions |
| GET  | `/admin/challenges` | 🛡️ | View all challenges |

---

## Security Features

| Feature | Implementation |
|---------|---------------|
| Password hashing | `bcrypt` via passlib |
| Flag hashing | SHA-256 + app-level salt |
| Authentication | JWT Bearer tokens (python-jose) |
| Role enforcement | `require_admin` FastAPI dependency |
| Duplicate solve | Checked before scoring |
| Rate limiting | 5 attempts per 10 min per user/challenge |
| ObjectId safety | `valid_object_id` dependency on all ID params |
| File upload | UUID-prefixed filenames, stored in `/uploads/challenges/` |

---

## Creating an Admin User

Use `/auth/register` then manually update the role in MongoDB Atlas:

```js
db.users.updateOne(
  { email: "admin@cyventura.com" },
  { $set: { role: "admin" } }
)
```

---

## Flag Submit Flow

```
POST /submit-flag  { challenge_id, flag }
        │
        ├─ Validate ObjectId
        ├─ Challenge exists & active?
        ├─ Already solved by this user?
        ├─ Rate limit check (5 per 10 min)
        ├─ SHA-256 hash(flag) == stored hash?
        │       ├─ ✅ Correct → update score, mark solved, record submission
        │       └─ ❌ Wrong   → record attempt, return incorrect
        └─ Return { correct, message, points_awarded }
```
