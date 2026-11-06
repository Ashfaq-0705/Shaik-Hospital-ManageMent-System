"""
schemas/appointment.py
Appointment Pydantic schemas for validation and serialization.
"""

from pydantic import BaseModel, Field
from typing import Optional


class AppointmentBase(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_date: str = Field(..., min_length=1)
    appointment_time: str = Field(..., min_length=1)
    status: str = Field(default="Scheduled")


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentUpdate(BaseModel):
    patient_id: Optional[int] = None
    doctor_id: Optional[int] = None
    appointment_date: Optional[str] = None
    appointment_time: Optional[str] = None
    status: Optional[str] = None


class AppointmentResponse(AppointmentBase):
    appointment_id: int

    class Config:
        from_attributes = True