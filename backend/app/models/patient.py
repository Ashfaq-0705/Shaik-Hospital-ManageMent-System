"""
models/patient.py
Patient SQLAlchemy ORM model.
"""

from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Patient(Base):
    __tablename__ = "patients"

    patient_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    email = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    disease = Column(Text, nullable=True)
    admission_date = Column(String, nullable=True)

    appointments = relationship("Appointment", back_populates="patient", cascade="all, delete")
    bills = relationship("Bill", back_populates="patient", cascade="all, delete")
    medical_records = relationship("MedicalRecord", back_populates="patient", cascade="all, delete")