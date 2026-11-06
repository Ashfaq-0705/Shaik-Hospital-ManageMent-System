"""
schemas/doctor.py
Doctor Pydantic schemas for validation and serialization.
"""

from pydantic import BaseModel, Field
from typing import Optional


class DoctorBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    specialization: str = Field(..., min_length=1, max_length=100)
    contact: str = Field(..., min_length=1, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    qualification: Optional[str] = None
    experience: Optional[str] = None
    consultation_fee: float = Field(default=0, ge=0)


class DoctorCreate(DoctorBase):
    pass


class DoctorUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    specialization: Optional[str] = Field(None, min_length=1, max_length=100)
    contact: Optional[str] = Field(None, min_length=1, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    qualification: Optional[str] = None
    experience: Optional[str] = None
    consultation_fee: Optional[float] = Field(None, ge=0)


class DoctorResponse(DoctorBase):
    doctor_id: int

    class Config:
        from_attributes = True
