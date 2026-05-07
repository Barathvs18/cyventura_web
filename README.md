# Cyventura CTF Platform

A full-stack, responsive platform for hosting Capture The Flag (CTF) challenges. 

## 🛠️ Tech Stack

**Frontend:**
- **React (Vite)**: Fast, modern UI development.
- **Three.js & Framer Motion**: 3D elements and smooth animations for a premium, dynamic feel.
- **Vanilla CSS**: Custom styling with glassmorphism and cyberpunk-inspired aesthetics.

**Backend:**
- **FastAPI (Python)**: High-performance, asynchronous REST API.
- **MongoDB (Motor)**: NoSQL database for flexible data storage (hosted on Atlas).
- **JWT & bcrypt**: Secure authentication and password hashing.
- **SHA-256**: Secure flag validation with app-level salting.

**Deployment:**
- **Docker & Docker Compose**: Containerized multi-stage builds (Node.js + Nginx for frontend, Python slim for backend) for seamless environment parity.

---

## 🚀 How to Run the Application

The easiest way to run the entire application (frontend + backend) is using Docker Compose.

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.
- Ensure ports `80` (Frontend) and `8000` (Backend) are free on your machine.

### 2. Start the Stack
Navigate to the root directory (`cyventura_web`) and run:
```bash
docker compose up --build -d
```

### 3. Access the Platform
- **Frontend App**: [http://localhost](http://localhost)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

> **Note on Database**: The backend automatically connects to MongoDB Atlas using the URI defined in `server/.env`. A local MongoDB container is not required.

---

## 🛡️ Admin Features & Access

The platform includes a dedicated Admin Dashboard to manage the CTF lifecycle.

### Accessing the Admin Panel
1. Navigate to `http://localhost/admin/dashboard` or click the log in 

2. Log in with an Admin account. 
Email	: admin@cyventura.com
Password	: Admin@123


### Admin Capabilities
- **Manage Challenges**: Create new CTF challenges, upload associated files, and toggle their visibility (Active/Inactive).
- **View Submissions**: Monitor a real-time feed of all flag submissions (both correct and incorrect) across all users.
- **Manage Users**: View all registered users, their scores, solved challenge counts, and remove users if necessary (Admin accounts are protected).
- **Register Users**: Manually register new users directly from the admin panel.
