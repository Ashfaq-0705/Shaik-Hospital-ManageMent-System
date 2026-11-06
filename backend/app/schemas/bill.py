"""
schemas/bill.py
Bill Pydantic schemas for validation and serialization.
"""

from pydantic import BaseModel, Field
from typing import Optional


class BillBase(BaseModel):
    patient_id: int
    description: Optional[str] = None
    amount: float = Field(..., ge=0)
    paid_status: str = Field(default="Unpaid")


class BillCreate(BillBase):
    pass


class BillUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = Field(None, ge=0)
    paid_status: Optional[str] = None


class BillResponse(BillBase):
    bill_id: int
    bill_date: Optional[str] = None

    class Config:
        from_attributes = True