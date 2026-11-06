"""
models/medical_record.py
MedicalRecord SQLAlchemy ORM model.
"""

from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.doctor_id", ondelete="CASCADE"), nullable=False)
    diagnosis = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(String, nullable=True)

    patient = relationship("Patient", back_populates="medical_records")