"""
Admin User Creator Script
=========================
Run this once to create the first admin account:

    python create_admin.py

Or with custom credentials:

    python create_admin.py --username admin --email admin@cyventura.com --password MyStr0ngPass!
"""
import asyncio
import argparse
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app.utils.security import hash_password


async def create_admin(username: str, email: str, password: str):
    print(f"\n🔧  Connecting to MongoDB ({settings.DATABASE_NAME})...")
    client = AsyncIOMotorClient(settings.MONGODB_URI.strip())
    db = client[settings.DATABASE_NAME]

    # Check if email already exists
    existing = await db["users"].find_one({"email": email})
    if existing:
        if existing.get("role") == "admin":
            print(f"✅  Admin already exists: {email}")
        else:
            # Promote to admin
            await db["users"].update_one(
                {"email": email},
                {"$set": {"role": "admin"}}
            )
            print(f"✅  Promoted existing user to admin: {email}")
        client.close()
        return

    # Check if username already exists
    if await db["users"].find_one({"username": username}):
        print(f"❌  Username '{username}' is already taken. Choose another.")
        client.close()
        sys.exit(1)

    # Create new admin user
    doc = {
        "username": username,
        "email": email,
        "password_hash": hash_password(password),
        "role": "admin",
        "score": 0,
        "solved_challenges": [],
    }
    result = await db["users"].insert_one(doc)
    print(f"\n✅  Admin user created successfully!")
    print(f"    ID       : {result.inserted_id}")
    print(f"    Username : {username}")
    print(f"    Email    : {email}")
    print(f"    Role     : admin")
    print(f"\n👉  You can now log in at http://localhost:5173/login\n")
    client.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create a CTF admin user")
    parser.add_argument("--username", default="admin",          help="Admin username (default: admin)")
    parser.add_argument("--email",    default="admin@cyventura.com", help="Admin email")
    parser.add_argument("--password", default="Admin@123",      help="Admin password (default: Admin@123)")
    args = parser.parse_args()

    asyncio.run(create_admin(args.username, args.email, args.password))
