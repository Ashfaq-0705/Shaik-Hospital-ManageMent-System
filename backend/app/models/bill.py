"""
models/bill.py
Bill SQLAlchemy ORM model.
"""

from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Bill(Base):
    __tablename__ = "bills"

    bill_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id", ondelete="CASCADE"), nullable=False)
    description = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    bill_date = Column(String, nullable=True)
    paid_status = Column(String, default="Unpaid")

    patient = relationship("Patient", back_populates="bills")