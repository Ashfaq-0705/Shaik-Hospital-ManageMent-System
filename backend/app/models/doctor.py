"""
models/doctor.py
Doctor SQLAlchemy ORM model.
"""

from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    doctor_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    email = Column(String, nullable=True)
    qualification = Column(String, nullable=True)
    experience = Column(String, nullable=True)
    consultation_fee = Column(Float, default=0)

    appointments = relationship("Appointment", back_populates="doctor", cascade="all, delete")