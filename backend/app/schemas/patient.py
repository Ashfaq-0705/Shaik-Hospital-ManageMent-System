"""
schemas/patient.py
Patient Pydantic schemas for validation and serialization.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


class PatientBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=0, le=150)
    gender: str = Field(..., min_length=1, max_length=20)
    contact: str = Field(..., min_length=1, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = None
    disease: Optional[str] = None
    admission_date: Optional[str] = None


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    age: Optional[int] = Field(None, ge=0, le=150)
    gender: Optional[str] = Field(None, min_length=1, max_length=20)
    contact: Optional[str] = Field(None, min_length=1, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = None
    disease: Optional[str] = None
    admission_date: Optional[str] = None


class PatientResponse(PatientBase):
    patient_id: int

    class Config:
        from_attributes = True
