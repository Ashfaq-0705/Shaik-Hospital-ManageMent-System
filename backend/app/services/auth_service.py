"""
services/auth_service.py
Authentication service - login, register, token handling.
"""

from datetime import timedelta
from sqlalchemy.orm import Session
from app.core import security
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.schemas.token import Token, TokenData
from fastapi import HTTPException, status


def authenticate_user(db: Session, username: str, password: str) -> User | None:
    """Authenticate user with username and password."""
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return None
    if not security.verify_password(password, user.hashed_password):
        return None
    return user


def create_user(db: Session, user_data: UserCreate) -> User:
    """Create a new user."""
    hashed_password = security.get_password_hash(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        role=user_data.role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_username(db: Session, username: str) -> User | None:
    """Get user by username."""
    return db.query(User).filter(User.username == username).first()


def create_token(data: dict) -> Token:
    """Create JWT access token."""
    access_token = security.create_access_token(data)
    return Token(access_token=access_token, token_type="bearer")


def get_current_user(db: Session, token: str = None) -> User | None:
    """Get current authenticated user from token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    
    payload = security.decode_token(token)
    if not payload:
        raise credentials_exception
    
    username = payload.get("sub")
    if username is None:
        raise credentials_exception
    
    user = get_user_by_username(db, username)
    if user is None:
        raise credentials_exception
    
    return user


def create_admin_user(db: Session, username: str = "admin", password: str = "admin123") -> User:
    """Create default admin user."""
    user = db.query(User).filter(User.username == username).first()
    if user:
        return user
    hashed_password = security.get_password_hash(password)
    db_user = User(
        username=username,
        email="admin@hospital.com",
        hashed_password=hashed_password,
        role="Admin",
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
