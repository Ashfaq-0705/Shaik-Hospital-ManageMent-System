"""
startup.py
Startup script to initialize database and start the FastAPI server.
"""
import os
import sys

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import init_db, SessionLocal
from app.services.auth_service import create_admin_user
from app.core.config import settings

# Initialize database
print("Initializing database...")
init_db()

# Create admin user
db = SessionLocal()
try:
    admin = create_admin_user(db)
    print(f"Admin user ready: {admin.username} (role: {admin.role})")
finally:
    db.close()

# Start server
import uvicorn
print(f"Starting server on http://0.0.0.0:8000")
uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)