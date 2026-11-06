"""
schemas/user.py
User Pydantic schemas for authentication and user management.
"""

from pydantic import BaseModel, Field
from typing import Optional


class UserBase(BaseModel):
    username: str = Field(..., min_length=1, max_length=50)
    email: str
    role: str = Field(default="Receptionist")


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=1, max_length=50)
    email: Optional[str] = None
    role: Optional[str] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    username: str
    password: str
